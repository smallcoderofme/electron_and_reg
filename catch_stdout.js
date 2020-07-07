const fs = require('fs');

const { spawn } = require('child_process');
const bat = spawn('cmd.exe', ['/c', 'my.bat']);

bat.stdout.on('data', (data) => {
  // console.log('--------------------->',data.toString());
  // fs.writeFile('asar_package_list.txt', data.toString(), (err) => {
  // 	if (err) {
  // 		console.log('Error:', err)
  // 	}
  // })
});

bat.stderr.on('data', (data) => {
  // console.error('stderr: data ',data.toString());
});

bat.on('exit', (code) => {
  // console.log(`exit process ${code}`);
});

file:///C:/Users/Administrator/Desktop/apppro/dist/win-unpacked/resources/app.asar/VirtualLocal/Pro/JTSXXXK/comp/img_bg_line.png