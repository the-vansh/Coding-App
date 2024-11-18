const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const processes = {};

router.use(express.text());

router.post('/executepython', (req, res) => {
    const code = req.body;
    const id = uuidv4();

    const pyFile = `temp_${id}.py`;

    fs.writeFileSync(pyFile, code);

    processes[id] = {
        pyFile: pyFile,
        state: 'waiting', // Initial state
    };

    res.json({ id: id });
});

module.exports = { router, processes };
