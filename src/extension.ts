/* eslint-disable semi */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "apimap" is now active!')

  vscode.window.registerWebviewViewProvider('apiMapView', new MyWebviewViewProvider(context))

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('apimap.ChangeApiEnv', async () => {
    // 弹出输入框，让用户填写信息
    const url = await vscode.window.showInputBox({
      placeHolder: '请填写获取接口Api文档的环境地址',
      prompt: '请填写获取接口Api文档的环境地址',
    })

    if (url) {
      // vscode.window.showInformationMessage(`输入的环境变量值是：${envValue}`)
      try {
        const res = await fetch(`${url}/access-control/v3/api-docs`)
        if (res.ok) {
          const data = await res.json()
          console.log(data)
        }
      } catch (err) {}
    } else {
      vscode.window.showInformationMessage('没有输入值')
    }
  })

  context.subscriptions.push(disposable)
}

class MyWebviewViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    // 设置 webview 内容
    webviewView.webview.options = {
      enableScripts: true,
    }

    webviewView.webview.html = this.getWebviewContent()
  }

  private getWebviewContent(): string {
    // 确保 webview 和 iframe 都使用 100% 高度
    return `
				<html>
						<head>
								<style>
										/* 设置 body 和 html 高度为 100% */
										html, body {
												height: 100%;
												margin: 0;
										}
										/* 设置 iframe 高度为 100% */
										iframe {
												width: 100%;
												height: 100%;
												border: none;
										}
								</style>
						</head>
						<body>
								<iframe src="http://172.16.172.130:23720/doc.html#/home"></iframe>
						</body>
				</html>
		`
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
