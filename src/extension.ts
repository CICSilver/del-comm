// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/* ... */
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('del-comm.delComments', () => {
		const editor = vscode.window.activeTextEditor;
        // 匹配'//' 开头的注释
        let double_slashes_regex = /(?<!\\)\/\/.*$/gm;
        // 匹配'/* ... */' 注释
        // 
        let single_slashes_with_Asterisk_regex = /(?<!\/|['"])\s*\/\*[\s\S]*?\*\//gm;
        // 匹配空行
        let blank_lines_regex = /^\s*[\r\n]/gm;
		if (editor) {
			const document = editor.document;
			const text = document.getText();

            let withoutComments = text.replace(double_slashes_regex, '');
            withoutComments = withoutComments.replace(single_slashes_with_Asterisk_regex, '');
            withoutComments = withoutComments.replace(blank_lines_regex, '');

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
