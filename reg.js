const { app, BrowserWindow } = require('electron')
// 非对称性加密
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

// 主进程中在global上自定义对象
global.saveDefault= {
    encode: 'default value',
}

function createWindow () {   
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  // 并且为你的应用加载index.html
  win.loadFile('index.html')

  // 打开开发者工具
  win.webContents.openDevTools()


    require("electron").ipcMain.on("click", (event, data)=> {
        console.log('------------------------------------------ click: ', data['macbase64']);
        let privateKey = fs.readFileSync(path.join(__dirname, "/rsa_private.key"));

        // 加密
        enc = crypto.privateEncrypt(privateKey, Buffer.from(data['macbase64'],'utf8'));
        saveDefault.encode = enc.toString('hex')        

    });

    win.webContents.executeJavaScript(`
        document.getElementById("create_btn").addEventListener("click", function(){
        macbase64 = document.getElementById("macbase64").value;
        require("electron").ipcRenderer.send("click", {"macbase64":macbase64});

        });
    `)
}

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

//当所有窗口都被关闭后退出
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 您可以把应用程序其他的流程写在在此文件中
// 代码 也可以拆分成几个文件，然后用 require 导入。
