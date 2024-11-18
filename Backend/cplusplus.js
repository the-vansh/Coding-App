const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const processes = {};

router.use(express.text());

router.post('/executecpp', (req, res) => {
    const code = req.body;
    const id = uuidv4();

    const cppFile = `temp_${id}.cpp`;

    fs.writeFileSync(cppFile, code);

    processes[id] = {
        cppFile: cppFile,
        exeFile: `temp_${id}.exe`,
        state: 'waiting', 
    };

    res.json({ id: id });
});

module.exports = { router, processes };
