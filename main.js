const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');
let win;

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    win.loadFile(path.join(__dirname, 'index.html'));
}

app.on('ready', createWindow);

ipcMain.on('download-from-github', (event, githubUrl) => {
    const urlParts = url.parse(githubUrl);

    const options = {
        hostname: urlParts.hostname,
        port: 443,
        path: urlParts.path,
        method: 'GET',
    };

    const req = https.request(options, (res) => {
        let fileData = '';

        res.on('data', (chunk) => {
            fileData += chunk;
        });

        res.on('end', () => {
            fs.writeFile(path.join(__dirname, 'downloadedFile'), fileData, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    event.reply('download-error', err);
                } else {
                    console.log('File downloaded successfully');
                    event.reply('download-complete', path.join(__dirname, 'downloadedFile'));
                }
            });
        });
    });

    req.on('error', (error) => {
        console.error('Error downloading file:', error);
        event.reply('download-error', error);
    });

    req.end();
});