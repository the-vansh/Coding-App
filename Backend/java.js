const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const processes = {};

router.use(express.text());

router.post('/executejava', (req, res) => {
    const code = req.body;
    const id = uuidv4().replace(/-/g, ''); // Remove hyphens from the UUID

    const javaFile = `Temp${id}.java`;
    const className = `Temp${id}`;

    // Modify the class name in the Java code to match the file name
    const modifiedCode = code.replace(/public\s+class\s+\w+/, `public class ${className}`);

    fs.writeFileSync(javaFile, modifiedCode);

    processes[id] = {
        javaFile: javaFile,
        className: className,
        state: 'waiting', // Initial state
    };

    res.json({ id: id });
});

module.exports = { router, processes };
