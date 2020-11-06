const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const demoSchema= new Schema({
    parentname: String,
    number: String,
    childname:String,
    email:String,
    age:String,
    course:String,
    date:String,
    time:String
});

module.exports= mongoose.model('demo',demoSchema);