const express = require('express');
const path = require('path');
const app = express();
let server = require('http').Server(app);
let io = require( 'socket.io' )( server );
let stream = require('./ws/steam');
const port = process.env.PORT || 3000;
var cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use("/assets",express.static(__dirname + '/assets'));
app.set('view engine', 'ejs');
app.use("/ws",express.static(__dirname + '/ws'));

io.of('/stream').on('connection',stream);

app.get('/adminlogin', (req,res) => {
    res.render('adminlogin');
    
})

app.get('/', (req,res) => {
    res.render('login');
    
})

app.get('/admindashboard', (req,res) => {
    if(req.cookies.admin){
        res.render('admindashboard');
        return;
    }
        
    else {
        res.render('errorlogin');
        return;
    }
})

app.get('/test', (req,res) => {
    res.render('test');
})

app.get('/room:id', (req,res) => {
    var link = req.link;
    if(req.cookies.mentor || req.cookies.student){
        res.render('session', {link: link});
        return;
    }
    
    else {
        res.render('errorlogin');
        return;
    }
    
})

app.get('/faq', (req,res) =>{
    if(req.cookies.admin) {
        res.render('faq');
        return
    }
    else {
        res.render('errorlogin');
        return
    }
})

app.get('/userfaq', (req,res) =>{
    res.render('userfaq');
})

app.get('/adminusercrud', (req,res) =>{
    if(req.cookies.admin){
        res.render('adminusercrud');
        return
    }
    
    else {
        res.render('errorlogin');
        return;
    }
})

app.get('/adminmanage', (req,res) =>{
    if(req.cookies.admin)
        res.render('adminmanage');
    else {
        res.render('errorlogin');
    }
})

app.get('/admindash', (req,res) =>{
    if(req.cookies.admin)
        res.render('admindash');
    else {
        res.render('errorlogin');
    }
})

app.get('/mentordashboard', (req,res) => {
    if(req.cookies.mentor)
        return res.render('mentordashboard');
    else 
        res.render('errorlogin');
        
})

app.get('/notice',(req,res) => {
    if(req.cookies.admin)
        res.render('notice');   
    else 
        res.render('errorlogin');
})

app.get('/studentlogin', (req,res) => {
    res.render('studentlogin');
   
})

app.get('/studentdashboard',(req,res) => {
    if(req.cookies.student)
        res.render('studentdashboard');
    else 
        res.render('errorlogin'); 
})

app.get('/managechat',(req,res) => {
    if(req.cookies.admin)
        res.render('managechat');
    else {
        res.render('errorlogin');
    }
})

app.get('/mentorlogin', (req,res) => {
        res.render('mentorlogin');
        res.render('errorlogin'); 
})

app.get('/managementor', (req,res) => {
    if(req.cookies.admin)
        res.render('manageMentor');
    else 
        res.render('errorlogin');
})

app.get('/manageMembership', (req,res) => {
    if(req.cookies.admin)
        res.render('manageMembership');
    else 
        res.render('errorlogin');
})

app.get('/mentornotice', (req,res) => {
    if(req.cookies.mentor)
        res.render('mentornotice');
    else 
        res.render('errorlogin');
})

app.get('/testStudent', (req,res) => {
    res.render('testStudent');
})

app.get('/testMentor', (req,res) => {
    res.render('testmentor');
})

server.listen(port,() => {
    console.log(`Server running at port `+port);
  });