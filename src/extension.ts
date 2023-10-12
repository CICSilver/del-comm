// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('del-comm.removeCommentsAndEmptyLines', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const text = document.getText();

			// 删除 // 开头的注释
            let withoutComments = text.replace(/\/\/.*$/gm, '');
            // 删除 /* ... */ 注释
            withoutComments = withoutComments.replace(/\/\*[\s\S]*?\*\//gm, '');
            // 删除空行
            withoutComments = withoutComments.replace(/^\s*[\r\n]/gm, '');

			const edit = new vscode.WorkspaceEdit();
            const range = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            edit.replace(document.uri, range, withoutComments);

            return vscode.workspace.applyEdit(edit);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}


// let disposable = vscode.commands.registerCommand('extension.removeCommentsAndEmptyLines', () => {
// 	const editor = vscode.window.activeTextEditor;
// 	if (editor) {
// 		const document = editor.document;
// 		const text = document.getText();

// 		const withoutComments = text.replace(/\/\/.*[\n]|\/\*.*\*\/|^\s*(?=\r?$)\n/gm, '');

// 		const edit = new vscode.WorkspaceEdit();
// 		const range = new vscode.Range(
// 			document.positionAt(0),
// 			document.positionAt(text.length)
// 		);
// 		edit.replace(document.uri, range, withoutComments);

// 		return vscode.workspace.applyEdit(edit);
// 	}
// });

// context.subscriptions.push(disposable);