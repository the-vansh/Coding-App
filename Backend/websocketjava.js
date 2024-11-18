const express = require('express');
const router = express.Router();

const WebSocket = require('ws');
const { spawn } = require('child_process');
const fs = require('fs');

const { processes } = require('./java'); // Adjust the path as needed

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
    const id = req.url.split('?id=')[1];

    if (!id || !processes[id]) {
        ws.close();
        return;
    }

    const processInfo = processes[id];
    const { javaFile, className } = processInfo;

    console.log(`Starting compilation for process ID: ${id}`);

    // Compile the Java code
    const compileProcess = spawn('javac', [javaFile]);

    let compilationError = '';

    compileProcess.stderr.on('data', (data) => {
        compilationError += data.toString();
        console.error(`Compilation error (ID: ${id}): ${data}`);
    });

    compileProcess.on('close', (code) => {
        if (code === 0) {
            console.log(`Compilation succeeded for process ID: ${id}`);

            // Execute the compiled Java code
            const javaProcess = spawn('java', [className]);
            processes[id].javaProcess = javaProcess;
            processes[id].state = 'running';

            javaProcess.stdout.on('data', (data) => {
                console.log(`Output from process ID: ${id}: ${data}`);
                ws.send(data.toString());
            });

            javaProcess.stderr.on('data', (data) => {
                console.error(`Runtime error from process ID: ${id}: ${data}`);
                ws.send(data.toString());
            });

            javaProcess.on('close', () => {
                console.log(`Process ID: ${id} finished execution.`);
                ws.close();

                // Clean up
                try {
                    if (fs.existsSync(javaFile)) {
                        fs.unlinkSync(javaFile);
                        console.log(`Deleted javaFile for process ID: ${id}`);
                    } else {
                        console.warn(`javaFile not found for process ID: ${id}`);
                    }

                    const classFile = `${className}.class`;
                    if (fs.existsSync(classFile)) {
                        fs.unlinkSync(classFile);
                        console.log(`Deleted classFile for process ID: ${id}`);
                    } else {
                        console.warn(`classFile not found for process ID: ${id}`);
                    }
                } catch (err) {
                    console.error(`Error cleaning up files for process ID: ${id}: ${err}`);
                }
                delete processes[id];
            });

            ws.on('message', (message) => {
                console.log(`Input for process ID: ${id}: ${message}`);
                javaProcess.stdin.write(message + '\n');
            });

            ws.on('close', () => {
                console.log(`WebSocket closed for process ID: ${id}.`);
                if (javaProcess && !javaProcess.killed) {
                    javaProcess.kill();
                }
            });
        } else {
            console.error(`Compilation failed for process ID: ${id} with code: ${code}`);
            ws.send('Compilation error: ' + compilationError);
            ws.close();
            try {
                if (fs.existsSync(javaFile)) {
                    fs.unlinkSync(javaFile);
                    console.log(`Deleted javaFile for process ID: ${id}`);
                } else {
                    console.warn(`javaFile not found for process ID: ${id}`);
                }
            } catch (err) {
                console.error(`Error cleaning up file for process ID: ${id}: ${err}`);
            }
            delete processes[id];
        }
    });
});

const handleUpgradeJava = (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
    });
};

router.post('/stopExecutionjava/:id', (req, res) => {
    const id = req.params.id;
    if (!processes[id]) {
        res.status(404).json({ error: 'Process not found' });
        return;
    }
    delete processes[id];
    res.status(200).json({ message: `Execution stopped and files deleted for process ID: ${id}` });
});

module.exports = {router, handleUpgradeJava };
