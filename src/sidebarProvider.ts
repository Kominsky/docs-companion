import * as vscode from 'vscode';
import { DocResult } from './docsProvider';

export class SidebarProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private _currentDoc?: DocResult;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    public updateContent(doc: DocResult, silent: boolean = false) {
        this._currentDoc = doc;
        
        if (this._view) {
            this._view.webview.postMessage({
                type: 'updateDoc',
                doc: doc
            });

            if (!silent) {
                this._view.show?.(true); // Reveal the view
            }
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Docs Companion</title>
    <style>
        body {
            padding: 10px;
            color: var(--vscode-foreground);
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            line-height: 1.6;
        }
        
        h1, h2, h3 {
            margin-top: 20px;
            margin-bottom: 10px;
            color: var(--vscode-editor-foreground);
        }
        
        h1 {
            font-size: 1.5em;
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 8px;
        }
        
        .doc-type {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 0.85em;
            margin-bottom: 10px;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
        }
        
        .content {
            margin-top: 15px;
        }
        
        .source {
            margin-top: 20px;
            padding: 10px;
            background: var(--vscode-textBlockQuote-background);
            border-left: 3px solid var(--vscode-textBlockQuote-border);
            font-size: 0.9em;
        }
        
        .links {
            margin-top: 15px;
        }
        
        .links a {
            display: inline-block;
            margin-right: 10px;
            padding: 5px 10px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            text-decoration: none;
            border-radius: 3px;
            font-size: 0.9em;
        }
        
        .links a:hover {
            background: var(--vscode-button-hoverBackground);
        }
        
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--vscode-descriptionForeground);
        }
        
        .empty-state h2 {
            color: var(--vscode-descriptionForeground);
        }
        
        code {
            background: var(--vscode-textCodeBlock-background);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: var(--vscode-editor-font-family);
        }
        
        pre {
            background: var(--vscode-textCodeBlock-background);
            padding: 10px;
            border-radius: 3px;
            overflow-x: auto;
        }
        
        pre code {
            background: none;
            padding: 0;
        }
    </style>
</head>
<body>
    <div id="content">
        <div class="empty-state">
            <h2>📚 Docs Companion</h2>
            <p>Press <code>Ctrl+Shift+D</code> (or <code>Cmd+Shift+D</code> on Mac) with your cursor on a symbol to see its documentation.</p>
            <p style="margin-top: 20px; font-size: 0.9em;">This extension helps you understand your code by providing contextual documentation without writing any code for you.</p>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        // Simple markdown-like rendering
        function renderMarkdown(text) {
            return text
                .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
                .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
                .replace(/\`(.+?)\`/g, '<code>$1</code>')
                .replace(/\\n/g, '<br>');
        }
        
        window.addEventListener('message', event => {
            const message = event.data;
            
            if (message.type === 'updateDoc') {
                const doc = message.doc;
                const contentDiv = document.getElementById('content');
                
                let linksHtml = '';
                if (doc.links && doc.links.length > 0) {
                    linksHtml = '<div class="links">' + 
                        doc.links.map(link => 
                            \`<a href="#" onclick="openLink('\${link.url}')">\${link.label}</a>\`
                        ).join('') + 
                    '</div>';
                }
                
                let sourceHtml = '';
                if (doc.source) {
                    sourceHtml = \`<div class="source">📖 Source: \${doc.source}</div>\`;
                }
                
                contentDiv.innerHTML = \`
                    <span class="doc-type">\${doc.type}</span>
                    <h1>\${doc.title}</h1>
                    <div class="content">\${renderMarkdown(doc.content)}</div>
                    \${sourceHtml}
                    \${linksHtml}
                \`;
            }
        });
        
        function openLink(url) {
            vscode.postMessage({
                type: 'openLink',
                url: url
            });
        }
    </script>
</body>
</html>`;
    }
}
