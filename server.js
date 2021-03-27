const express = require('express');
const path = require('path');
const app = express();
let server = require('http').Server(app);



console.log(`path.join(${__dirname}+'/views/admin'`);

app.use("/assets",express.static(__dirname + '/assets'));
app.set('view engine', 'ejs');

app.get('/adminlogin', (req,res) => {
    res.render('adminlogin');
})

app.get('/', (req,res) => {
    res.send('homepage');
})

app.get('/admindashboard', (req,res) => {
    res.render('admindashboard');
})

app.get('/test', (req,res) => {
    res.render('test');
})

app.get('/faq', (req,res) =>{
    res.render('faq');
})

app.get('/userfaq', (req,res) =>{
    res.render('userfaq');
})

server.listen(3000, console.log('Server Is Running'));