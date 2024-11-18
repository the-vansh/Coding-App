const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const processes = {};

router.use(express.text());

function injectFlushAfterPrintf(code) {
    // Regex to match printf calls
    const printfRegex = /printf\s*\([^;]*?\);/g;
    
    // Replace printf calls with printf followed by fflush(stdout);
    const modifiedCode = code.replace(printfRegex, (match) => {
        return `${match} fflush(stdout);`;
    });

    return modifiedCode;
}

router.post('/executec', (req, res) => {
    let code = req.body;
    const id = uuidv4();
    code = injectFlushAfterPrintf(code);// to append fflush(stdout);after evety printf becous
    // without this the output only comes at last;
    //console.log(code);
    const cFile = `temp_${id}.c`;

    fs.writeFileSync(cFile, code);

    processes[id] = {
        cFile: cFile,
        exeFile: `temp_${id}.exe`,
        state: 'waiting', // Initial state
    };

    res.json({ id: id });
});

module.exports = { router, processes };
