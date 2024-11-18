const express = require('express');
const router = express.Router();

const WebSocket = require('ws');
const { spawn } = require('child_process');
const fs = require('fs');

const { processes } = require('./python');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
    const id = req.url.split('?id=')[1];

    if (!id || !processes[id]) {
        ws.close();
        return;
    }

    const processInfo = processes[id];
    const { pyFile } = processInfo;

    console.log(`Starting execution for process ID: ${id}`);

    // Execute the Python code
    const pyProcess = spawn('python', [pyFile]);
    processes[id].pyProcess = pyProcess;
    processes[id].state = 'running';

    pyProcess.stdout.on('data', (data) => {
        console.log(`Output from process ID: ${id}: ${data}`);
        ws.send(data.toString());
    });

    pyProcess.stderr.on('data', (data) => {
        console.error(`Runtime error from process ID: ${id}: ${data}`);
        ws.send(data.toString());
    });

    pyProcess.on('close', () => {
        console.log(`Process ID: ${id} finished execution.`);
        ws.close();

        // Clean up
        try {
            if (fs.existsSync(pyFile)) {
                fs.unlinkSync(pyFile);
                console.log(`Deleted pyFile for process ID: ${id}`);
            } else {
                console.warn(`pyFile not found for process ID: ${id}`);
            }
        } catch (err) {
            console.error(`Error cleaning up file for process ID: ${id}: ${err}`);
        }
        delete processes[id];
    });

    ws.on('message', (message) => {
        console.log(`Input for process ID: ${id}: ${message}`);
        pyProcess.stdin.write(message + '\n');
    });

    ws.on('close', () => {
        console.log(`WebSocket closed for process ID: ${id}.`);
        if (pyProcess && !pyProcess.killed) {
            pyProcess.kill();
        }
    });
});

const handleUpgradePy = (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
    });
};

router.post('/stopExecutionpython/:id', (req, res) => {
    const id = req.params.id;
    if (!processes[id]) {
        res.status(404).json({ error: 'Process not found' });
        return;
    }
    delete processes[id];
    res.status(200).json({ message: `Execution stopped and files deleted for process ID: ${id}` });
});

module.exports = {router, handleUpgradePy };
