import * as vscode from 'vscode';
import { DocsProvider } from './docsProvider';
import { SidebarProvider } from './sidebarProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Docs Companion is now active!');

    const docsProvider = new DocsProvider(context);
    const sidebarProvider = new SidebarProvider(context.extensionUri);

    // Register sidebar webview provider
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'docs-companion.sidebarView',
            sidebarProvider
        )
    );

    // Command: Show documentation for symbol under cursor
    const showDocsCommand = vscode.commands.registerCommand(
        'docs-companion.showDocs',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('No active editor');
                return;
            }

            const position = editor.selection.active;
            const wordRange = editor.document.getWordRangeAtPosition(position);
            
            if (!wordRange) {
                vscode.window.showInformationMessage('No symbol under cursor');
                return;
            }

            const word = editor.document.getText(wordRange);
            const docs = await docsProvider.getDocumentation(word, editor.document);
            
            // Update sidebar with documentation
            sidebarProvider.updateContent(docs);
        }
    );

    // Command: Show context-aware documentation
    const showContextDocsCommand = vscode.commands.registerCommand(
        'docs-companion.showContextDocs',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            const contextDocs = await docsProvider.getContextualDocs(editor.document);
            sidebarProvider.updateContent(contextDocs);
        }
    );

    context.subscriptions.push(showDocsCommand, showContextDocsCommand);

    // Auto-update on file change
    vscode.workspace.onDidChangeTextDocument(
        async (event) => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                // Debounce this in production
                const contextDocs = await docsProvider.getContextualDocs(editor.document);
                sidebarProvider.updateContent(contextDocs, true);
            }
        },
        null,
        context.subscriptions
    );
}

export function deactivate() {}
