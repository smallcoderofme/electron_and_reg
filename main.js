const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const crypto = require("crypto");
const storage = require('electron-json-storage');
const macaddress = require('macaddress');
let publicKey = fs.readFileSync(path.join(__dirname, "/rsa_public.key"));

global.saveDefault= {
  mac: 'default value'
}

macaddress.one(function (err, _mac) {
  saveDefault.mac = Buffer.from(_mac).toString('base64')
});

function createWindow () {   
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  // storage.clear(function(error) {
  //   if (error) throw error;
  // });
  // win.show()
  // 并且为你的应用加载index.html
  // const p = path.join("exp")
  // win.loadFile("exp/index.html")
  const p = path.resolve(__dirname, 'VirtualLocal')
  // win.loadFile(p+`/index.html`)
  // console.log(storage.getDataPath());
  function exejs(){
    require("electron").ipcMain.on("click", (event, data)=> {

      let result;
      try
      {
      //在这里运行代码
      // 解密
        result = crypto.publicDecrypt(publicKey,Buffer.from(data['regincode'],"hex"));
      }catch(err)
      {
      // 弹窗机器码
        dialog.showMessageBox({
            type: "info",//图标类型
            title: "提示",//信息提示框标题
            message: "注册码不正确！请联系恒茂创远管理员。",//信息提示框内容
            buttons: ["确认"],//下方显示的按钮
            // icon:nativeImage.createFromPath("./icon/search-globe.png"),//图标
            cancelId:2//点击x号关闭返回值
        });
        return;
      }


      if(data['maccode'] == result.toString('utf8')){
          storage.set('foobar', { regincode: data['regincode'] }, function(error) {
            if (error) throw error;
          });
          // 弹窗机器码
          dialog.showMessageBox({
            type: "info",//图标类型
            title: "提示",//信息提示框标题
            message: "注册成功！请重启程序。",//信息提示框内容
            buttons: ["确认"],//下方显示的按钮
            // icon:nativeImage.createFromPath("./icon/search-globe.png"),//图标
            cancelId:2//点击x号关闭返回值
        });
        return;
        
      }
    });
  
     win.webContents.executeJavaScript(`
        document.getElementById("regin_btn").addEventListener("click", function(){
            maccode = document.getElementById("maccode").value;
            regincode = document.getElementById("regincode").value;
            require("electron").ipcRenderer.send("click", {"maccode":maccode,"regincode":regincode});
        });
    `)
  }

  storage.get('foobar', function(error, data) {
    if (error) throw error;    

    if(data['regincode'] == undefined){
      win.loadFile('tishi.html')
      exejs();
    }else{

      let result = crypto.publicDecrypt(publicKey,Buffer.from(data['regincode'],"hex"));
      if( saveDefault.mac == result.toString('utf8') ){
        win.loadFile(p+'/index.html')
      }else{
        win.loadFile('tishi.html')
        exejs();
      }
    }    
  });
  // 打开开发者工具
  win.webContents.openDevTools()

//  const menu = Menu.buildFromTemplate(template)
// 	Menu.setApplicationMenu(null)

  // require("electron").ipcMain.once("click", (event, data)=> {
  //   console.log('------------------------------------------ click: ', data);
  //   const dataPath = storage.getDataPath();
  //   console.log('++++++++++++++++++++++++++++++++++++++++++ dataPath:', dataPath);
  // });
  //  win.webContents.executeJavaScript(`
  //     document.getElementById("click123").addEventListener("click", function(){
  //         require("electron").ipcRenderer.send("click", {"hello":"123"});
  //     });
  // `)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
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
