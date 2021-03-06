import { app, BrowserWindow, screen, ipcMain, session, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow = null;
let overlayWin: BrowserWindow = null;

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {
  Menu.setApplicationMenu(null)
  const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 800,
    height: 900,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule : true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
  
  return win;
}

function createOverlayWindow(): BrowserWindow {
  const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().;

  // Create the browser window.
  overlayWin = new BrowserWindow({
    x: 21,
    y: 136,
    width: 845,
    height: 927,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule : true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });
  // overlayWin.setIgnoreMouseEvents(true);
  overlayWin.setAlwaysOnTop(true, 'normal');

  if (serve) {

    overlayWin.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    overlayWin.loadURL('http://localhost:4200/#/stash-overlay');

  } else {
    console.log(path.join(__dirname, 'dist/index.html')+'#/stash-overlay');
    overlayWin.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      hash: '/stash-overlay',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  overlayWin.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    overlayWin = null;
  });
  
  return overlayWin;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(() => {
    createWindow();

    
  }, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q1
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('set-cookie', (event, args) => {
    session.defaultSession.cookies.remove(args.cookie.url, args.cookie.name)
    session.defaultSession.cookies.set(args.cookie);
  });

  ipcMain.on('open-overlay',() => {
    createOverlayWindow();
  });

  
} catch (e) {
  // Catch Error
  // throw e;
  console.error(e);
}
