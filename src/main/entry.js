/* eslint-disable */
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var path = require('path');
var Menu = require('menu');
var fs = require('fs-extra');

var consts = require('./consts.js');
var Settings = require('./settings.js');
var Backups = require('./backups.js');
var Monitor = require('./monitor.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
    // Someone tried to run a second instance, we should focus our window
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
    return true;
});

if (shouldQuit) {
    app.quit();
    return;
}

app.consts = consts;
app.settings = new Settings(path.resolve(consts.dataPath, 'settings.json'));
app.backups = new Backups(app.settings);
app.monitor = new Monitor(app.settings, app.backups);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.monitor.stop();
    if (process.platform != 'darwin')
        app.quit();
});

var template = [
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: function (item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: (function () {
                    if (process.platform == 'darwin')
                        return 'Alt+Command+I';
                    else
                        return 'Ctrl+Shift+I';
                })(),
                click: function (item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.toggleDevTools();
                }
            },
        ]
    },
    {
        label: 'Window',
        role: 'window',
        submenu: [
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
        ]
    },
    {
        label: 'About',
        role: 'about',
        submenu: [
            {
                label: 'Help',
                role: 'help',
                click: function () { require('electron').shell.openExternal('http://electron.atom.io') }
            }
        ]
    }
];

menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
    var renderer = (fs.existsSync('./resources/app/src/renderer/main.html') ? 'file://' + process.cwd() + '/resources/app/src/renderer/main.html' : 'file://' + process.cwd() + '/compile/src/renderer/main.html')

    // Create the browser window.
    mainWindow = new BrowserWindow({ minWidth: 600, width: 600, height: 800, autoHideMenuBar: true });

    // and load the index.html of the app.
    mainWindow.loadURL(renderer);

    if (process.argv.indexOf('--dev') >= 0) {
        // Open the devtools.
        mainWindow.openDevTools();
    }

    var watching = true;

    app.monitor.on('stateChanged', function (state) {
        if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('setWatching', state === app.monitor.STATES.watching);
        }
    })

    app.monitor.on('newSaves', function (state) {
        if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('newSaves');
        }
    })

    mainWindow.webContents.on('did-finish-load', function () {
        if (app.monitor.state != app.monitor.STATES.watching) app.monitor.start();
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
