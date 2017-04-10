const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var win = null;

app.on('ready', function() {
    win = new BrowserWindow({width: 1280, height: 800});
    win.loadURL('file://' + __dirname + '/index.html');
});