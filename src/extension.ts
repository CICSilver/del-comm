// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/* ... */
export function activate(context: vscode.ExtensionContext) {
    const language = vscode.env.language;
    console.log('用户当前使用的语言是:', language);
    // 监听配置的更改
    vscode.workspace.onDidChangeConfiguration((event) => {
        // 检查配置中是否存在重复的项
        const config = vscode.workspace.getConfiguration('delCommExtension');
        const items = config.get('commentStyle') as string[];

        const duplicates = findDuplicates(items);
        if (duplicates.length > 0) {
            vscode.window.showWarningMessage('配置中存在重复的项，请检查配置');
        }
    });

    let disposable = vscode.commands.registerCommand('del-comm.delComments', () => {
        const editor = vscode.window.activeTextEditor;
        // 匹配'//' 开头的注释
        let double_slashes_regex = /(?<!\\)\/\/.*$/gm;
        // 匹配'/* ... */' 注释
        let single_slashes_with_Asterisk_regex = /(?<!\/|['"])\/\*[\s\S]*?\*\//gm;
        // 匹配空行
        let blank_lines_regex = /^\s*[\r\n]/gm;
        // 匹配# 注释
        let py_regex = /(?<!\/)#.*$/gm;

        if (editor) {
            // vscode.window.showInformationMessage(cs[0])
            const mySetting = vscode.workspace.getConfiguration('delCommExtension');
            const cs:String[] = mySetting.get('commentStyle', []);

            const document = editor.document;
            const text = document.getText();
            let withoutComments = text;
            if(cs.includes('//...'))
            {
                withoutComments = text.replace(double_slashes_regex, '');
            }
            if(cs.includes('/*...*/'))
            {
                withoutComments = withoutComments.replace(single_slashes_with_Asterisk_regex, '');
            }
            if(cs.includes('blank line'))
            {
                withoutComments = withoutComments.replace(blank_lines_regex, '');
            }
            if(cs.includes('#...'))
            {
                withoutComments = withoutComments.replace(py_regex, '');
            }
            
            // 根据文件类型配置默认删除项
            const fileExtension = document.fileName.split('.').pop();
            if( fileExtension === 'c' ||
                fileExtension === 'cpp' ||
                fileExtension === 'cc' ||
                fileExtension === 'h'  ||
                fileExtension === 'hpp')
                {
                    mySetting.update('commentStyle', ['//...','/*...*/','blank line'], vscode.ConfigurationTarget.Global)
                }
            if( fileExtension === 'py')
            {
                mySetting.update('commentStyle', ['#...', 'blank line'], vscode.ConfigurationTarget.Global)
            }
            // 打印后缀名
            console.log(fileExtension);

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

// 查找数组中的重复项
function findDuplicates(items: string[]): string[] {
    const duplicates: string[] = [];
    const set = new Set<string>();

    for (const item of items) {
        if (set.has(item)) {
            duplicates.push(item);
        } else {
            set.add(item);
        }
    }

    return duplicates;
}

// This method is called when your extension is deactivated
export function deactivate() { }
