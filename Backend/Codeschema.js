const mongoose = require('mongoose');
const {Schema} = mongoose;
const Codeschema = new Schema({
     userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
     },
     tag:{
        type:String,
        required:true,
     },
     file: {
        type:String,
        required:true,
     },
     date:{
         type:Date,
         default:Date.now
     }
});
module.exports = mongoose.model('Codes',Codeschema);