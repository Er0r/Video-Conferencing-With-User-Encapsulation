const express = require('express');
const path = require('path');
const app = express();
let server = require('http').Server(app);
let io = require( 'socket.io' )( server );
let stream = require('./ws/steam');
// const encryption = require('./assets/js/encryption');

console.log(`path.join(${__dirname}+'/views/admin'`);

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
    res.render('admindashboard');
})

app.get('/test', (req,res) => {
    res.render('test');
})

app.get('/room:id', (req,res) => {
    var link = req.link;
    res.render('session', {link: link});
})

app.get('/faq', (req,res) =>{
    res.render('faq');
})

app.get('/userfaq', (req,res) =>{
    res.render('userfaq');
})

app.get('/adminusercrud', (req,res) =>{
    res.render('adminusercrud');
})

app.get('/adminmanage', (req,res) =>{
    res.render('adminmanage');
})

app.get('/admindash', (req,res) =>{
    res.render('admindash');
})

app.get('/mentordashboard', (req,res) => {
    res.render('mentordashboard');
})

app.get('/notice',(req,res) => {
    res.render('notice');
})

app.get('/studentlogin', (req,res) => {
    res.render('studentlogin');
})

app.get('/studentdashboard',(req,res) => {
    res.render('studentdashboard');
})

app.get('/managechat',(req,res) => {
    res.render('managechat');
})

app.get('/mentorlogin', (req,res) => {
    res.render('mentorlogin');
})

app.get('/managementor', (req,res) => {
    res.render('manageMentor');
})

app.get('/manageMembership', (req,res) => {
    res.render('manageMembership');
})

app.get('/mentornotice', (req,res) => {
    res.render('mentornotice');
})

server.listen(3000, console.log('Server Is Running'));