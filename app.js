var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose= require("mongoose");
const path=require('path');
const dotenv = require('dotenv');
dotenv.config();
const fetch=require('node-fetch');
const flash=require("connect-flash");
const nodemailer = require("nodemailer")
// const request = require("request");
// const sendgridtransport=require("nodemailer-sendgrid-transport")
const Demo = require("./models/demo");

// const transporter = nodemailer.createTransport(
//     sendgridtransport({
//         auth:{
//             api_key:process.env.SENDGRID_API_KEY,
//         }
//     })
// )

let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER,
        pass:process.env.PASSWORD
    }
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@hari.r24lw.mongodb.net/notchup?retryWrites=true&w=majority`,{useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true});
mongoose.connection.once('open',function(){
    console.log("database connected");
}).on('error',function(error){
    console.log("databse connection error"+error)
})

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname+ "/elements"));
app.use(flash());
app.use(require("express-session")({
    secret:"rusty is the best dog",
    resolve: false,
    saveUninitialized:false
}))

app.use(bodyparser.urlencoded({extended:true}));
app.use(function(req,res,next){
    res.locals.min_date=min_date;
    res.locals.max_date=max_date;
    res.locals.success=req.flash("success");
    next();
}) 

app.get('/',(req,res)=>{
    res.render('home') 
})

app.get('/demo',(req,res)=>{
    res.render('demo')
})

app.post('/',function(req,res){
    console.log(req.body)
    var newcreated={
        parentname: req.body.parentname,
        number: req.body.number,
        childname:req.body.childname,
        email:req.body.email,
        age:req.body.age,
        course:req.body.course,
        date:req.body.date,
        time:req.body.time
    }
    Demo.create(newcreated,function(err,dem){
        if(err){
            console.log(err)
        }
        else{
            dem.save();
            return transporter.sendMail({
                to:req.body.email,
                from: "hariqwrty@gmail.com",
                subject: "NotchUp Trial Class Booked successfully",
                html: "<div> <h1>Dear "+ req.body.parentname +"</h1>"+ 
                "<h4>"+ req.body.childname +"'s class on "+  req.body.time +" has been successfully booked.</h4> </div>"
            },function(err , data){
                if(err){
                    console.log('error occured',err);
                }else{
                   req.flash("success","mail sent!")
                   console.log('email sent')
                   res.redirect("/demo")
                }
            });
            
            
        }
    })
   
})


app.listen(process.env.PORT || 3000,() => {
    console.log("connection established");
})

var day=new Date().getDay();
day= day+1;
var month=new Date().getMonth();
month= month+1;
if((day/10)<1){
    var  min_date= "2020"+"-"+month+"-"+"0"+day
}else{
    var  min_date= "2020"+"-"+month+"-"+day
}
console.log(min_date)

day=day+7;
console.log(day)
if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
    if(day>31){
          day=day-31
         month=month+1
    }
}else if(month==4||month==6||month==9||month==11){
    if(day>30){
         day=day-30;
         month=month+1;
    }
}else if(month==2){
    if(day>28){
         day=day-28;
        month=month+1
    }
   
}

if((day/10)<1){
    var  max_date= "2020"+"-"+month+"-"+"0"+day
}else{
    var  max_date= "2020"+"-"+month+"-"+day
}


console.log(max_date)

