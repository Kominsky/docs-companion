import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

export interface DocResult {
    symbol: string;
    type: 'npm-package' | 'local-function' | 'builtin' | 'unknown';
    title: string;
    content: string;
    source?: string;
    links?: { label: string; url: string }[];
}

export class DocsProvider {
    private packageJsonCache: any = null;
    private workspaceRoot: string | undefined;

    constructor(private context: vscode.ExtensionContext) {
        this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        this.loadPackageJson();
    }

    private async loadPackageJson() {
        if (!this.workspaceRoot) {
            return;
        }

        const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        
        try {
            const content = await fs.promises.readFile(packageJsonPath, 'utf-8');
            this.packageJsonCache = JSON.parse(content);
        } catch (error) {
            console.log('No package.json found or error reading it');
        }
    }

    async getDocumentation(symbol: string, document: vscode.TextDocument): Promise<DocResult> {
        // First, check if it's an npm package
        if (this.packageJsonCache) {
            const allDeps = {
                ...this.packageJsonCache.dependencies,
                ...this.packageJsonCache.devDependencies
            };

            if (allDeps[symbol]) {
                return await this.fetchNpmDocs(symbol, allDeps[symbol]);
            }
        }

        // Check if it's a common builtin
        const builtinDocs = this.getBuiltinDocs(symbol, document.languageId);
        if (builtinDocs) {
            return builtinDocs;
        }

        // Otherwise, return unknown
        return {
            symbol,
            type: 'unknown',
            title: `No documentation found for "${symbol}"`,
            content: 'This symbol could not be identified in your dependencies or as a builtin.',
        };
    }

    async getContextualDocs(document: vscode.TextDocument): Promise<DocResult> {
        const text = document.getText();
        const imports = this.extractImports(text);

        if (imports.length === 0) {
            return {
                symbol: 'context',
                type: 'unknown',
                title: 'No imports detected',
                content: 'No packages or modules imported in this file yet.',
            };
        }

        // For now, show docs for the first import
        const firstImport = imports[0];
        return await this.getDocumentation(firstImport, document);
    }

    private extractImports(text: string): string[] {
        const imports: string[] = [];
        
        // Match: import ... from 'package'
        const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
        let match;
        
        while ((match = importRegex.exec(text)) !== null) {
            const packageName = match[1];
            // Only get the package name, not the path
            const pkgName = packageName.startsWith('@') 
                ? packageName.split('/').slice(0, 2).join('/')
                : packageName.split('/')[0];
            
            if (!pkgName.startsWith('.')) {
                imports.push(pkgName);
            }
        }

        // Match: require('package')
        const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
        while ((match = requireRegex.exec(text)) !== null) {
            const packageName = match[1];
            const pkgName = packageName.startsWith('@')
                ? packageName.split('/').slice(0, 2).join('/')
                : packageName.split('/')[0];
            
            if (!pkgName.startsWith('.')) {
                imports.push(pkgName);
            }
        }

        return [...new Set(imports)]; // Remove duplicates
    }

    private async fetchNpmDocs(packageName: string, version: string): Promise<DocResult> {
        try {
            const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
            const data = response.data;

            const readme = data.readme || 'No README available';
            const description = data.description || 'No description available';
            const homepage = data.homepage || `https://www.npmjs.com/package/${packageName}`;

            return {
                symbol: packageName,
                type: 'npm-package',
                title: `${packageName} (${version})`,
                content: `**Description:** ${description}\n\n${readme.substring(0, 2000)}${readme.length > 2000 ? '...' : ''}`,
                source: 'npm registry',
                links: [
                    { label: 'npm', url: `https://www.npmjs.com/package/${packageName}` },
                    { label: 'Homepage', url: homepage }
                ]
            };
        } catch (error) {
            return {
                symbol: packageName,
                type: 'npm-package',
                title: `${packageName} (${version})`,
                content: 'Failed to fetch documentation from npm.',
                source: 'npm registry'
            };
        }
    }

    private getBuiltinDocs(symbol: string, languageId: string): DocResult | null {
        const jsBuiltins: Record<string, string> = {
            'console': 'The console object provides access to the browser\'s debugging console.',
            'Array': 'The Array object is used to store multiple values in a single variable.',
            'Object': 'The Object class represents one of JavaScript\'s data types.',
            'Promise': 'The Promise object represents the eventual completion or failure of an asynchronous operation.',
            'Map': 'The Map object holds key-value pairs and remembers the original insertion order of the keys.',
            'Set': 'The Set object lets you store unique values of any type.',
        };

        if (languageId === 'javascript' || languageId === 'typescript') {
            if (jsBuiltins[symbol]) {
                return {
                    symbol,
                    type: 'builtin',
                    title: `${symbol} (JavaScript Built-in)`,
                    content: jsBuiltins[symbol],
                    source: 'MDN Web Docs',
                    links: [
                        { label: 'MDN', url: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${symbol}` }
                    ]
                };
            }
        }

        return null;
    }
}
