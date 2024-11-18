const express =  require('express');
const router = express.Router();
const Codes = require('./Codeschema');
const fetchuser = require('./middleware');

router.use(express.json());
router.get('/fetchallfile',fetchuser,async(req,res)=>{
    try{
        const file = await Codes.find({userid:req.user.id});// this line have to change when add the middleware                                 // becouse the this id come form middleware
        res.json(file);
    }catch(err){
        res.status(500).send("Internal server error");
    }
   
})
module.exports = router;