const Codes = require('./Codeschema');
const express = require('express');
const router = express.Router();
const fetchuser = require('./middleware');
router.use(express.json()); 
router.post('/savecode',fetchuser,async(req,res)=>{
    try{
        const userid = req.user.id;
        const {tag,file,date} = req.body;
        const codes = new Codes({userid,tag,file,date});

        await codes.save();
        res.status(201).json({ message: 'File Saved Successfully' });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;