const express = require('express');
const router = express.Router();

const WebSocket = require('ws');
const { spawn } = require('child_process');
const fs = require('fs');
const { processes } = require('./c'); 

const wssC = new WebSocket.Server({ noServer: true });

wssC.on('connection', (ws, req) => {
    const id = req.url.split('?id=')[1];

    if (!id || !processes[id]) {
        ws.close();
        return;
    }

    const processInfo = processes[id];
    const { cFile, exeFile } = processInfo;

    console.log(`Starting compilation for process ID: ${id}`);

    const compileProcess = spawn('gcc', [cFile, '-o', exeFile]);
    
    let compilationError = '';

    compileProcess.stderr.on('data', (data) => {
        compilationError += data.toString();
        console.error(`Compilation error (ID: ${id}): ${data}`);
    });

    compileProcess.on('close', (code) => {
        if (code === 0) {
            console.log(`Compilation succeeded for process ID: ${id}`);

            const cProcess = spawn(`./${exeFile}`);
            //const cProcess = spawn('stdbuf', ['-oL', `./${exeFile}`]);
            processes[id].cProcess = cProcess;
            processes[id].state = 'running';

            cProcess.stdout.on('data', (data) => {
                console.log(`Output from process ID: ${id}: ${data}`);
                ws.send(data.toString());
            });

            cProcess.stderr.on('data', (data) => {
                console.error(`Runtime error from process ID: ${id}: ${data}`);
                ws.send(data.toString());
            });

            cProcess.on('close', () => {
                console.log(`Process ID: ${id} finished execution.`);
                ws.close();

                // Clean up
                try {
                    if (fs.existsSync(cFile)) {
                        fs.unlinkSync(cFile);
                        console.log(`Deleted cFile for process ID: ${id}`);
                    } else {
                        console.warn(`cFile not found for process ID: ${id}`);
                    }

                    if (fs.existsSync(exeFile)) {
                        fs.unlinkSync(exeFile);
                        console.log(`Deleted exeFile for process ID: ${id}`);
                    } else {
                        console.warn(`exeFile not found for process ID: ${id}`);
                    }
                } catch (err) {
                    console.error(`Error cleaning up files for process ID: ${id}: ${err}`);
                }
                delete processes[id];
            });

            ws.on('message', (message) => {
                console.log(`Input for process ID: ${id}: ${message}`);
                cProcess.stdin.write(message + '\n');
            });

            ws.on('close', () => {
                console.log(`WebSocket closed for process ID: ${id}.`);
                if (cProcess && !cProcess.killed) {
                    cProcess.kill();
                }
            });
        } else {
            console.error(`Compilation failed for process ID: ${id} with code: ${code}`);
            ws.send('Compilation error: ' + compilationError);
            ws.close();
            try {
                if (fs.existsSync(cFile)) {
                    fs.unlinkSync(cFile);
                    console.log(`Deleted cFile for process ID: ${id}`);
                } else {
                    console.warn(`cFile not found for process ID: ${id}`);
                }
            } catch (err) {
                console.error(`Error cleaning up file for process ID: ${id}: ${err}`);
            }
            delete processes[id];
        }
    });
});

const handleUpgradeC = (req, socket, head) => {
    wssC.handleUpgrade(req, socket, head, (ws) => {
        wssC.emit('connection', ws, req);
    });
};
router.post('/stopExecutionc/:id', (req, res) => {
    const id = req.params.id;
    if (!processes[id]) {
        res.status(404).json({ error: 'Process not found' });
        return;
    }
    delete processes[id];
    res.status(200).json({ message: `Execution stopped and files deleted for process ID: ${id}` });
});

module.exports = {router, handleUpgradeC };