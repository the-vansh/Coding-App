const express=require('express');
const router = express.Router();
const Codes = require('./Codeschema');
const fetchuser = require('./middleware');
router.delete('/deletefile',fetchuser,async(req,res)=>{
   try{
    console.log(req.body.id);

    let file = await Codes.findById(req.body.id);

    if(!file){
        res.status(500).send("NO FILE FOUND");
    }
    // if the fetch file user id not matching the to user id of the requesting user
    if(await(file.userid.toString()!=req.user.id)){
       res.status(500).send("NOT ALLOWED");
    }

    //commting becouse medal ware is not build yet build after frontend;

    file = await Codes.findByIdAndDelete(req.body.id);
    res.status(201).json({ message: 'File Delete Successfully' });
   }catch(error){
    res.status(500).send("Internal Server Error");
   }
});

module.exports = router;