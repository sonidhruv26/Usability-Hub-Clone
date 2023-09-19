const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const encoder = bodyparser.urlencoded();
const app = express();
app.use(express.static(__dirname));  //for css
const connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "login_database"
    }
);
connection.connect(function(err){
    if(err) throw err;
    console.log("Connected");
});
app.get("/",function (req,resp) {
    resp.sendFile(__dirname+"/login.html");
})
app.post("/signup",encoder,function (req,resp) {
    resp.sendFile(__dirname+"/register.html");
})
app.post("/register",encoder,function (req,resp){
    let username = req.body.username;
    let fullname = req.body.fname;
    let password = req.body.pwd;
    let email = req.body.email;

    connection.query("Insert into login_page (Name,Username,Email,Password) values (?,?,?,?)",[fullname,username,email,password],function (error,result) {
        if(error) throw err;
        else {
            resp.redirect('/login');
            resp.end();
        }
    })
})
let username;
app.post("/login",encoder,function (req,resp) {
    let username = req.body.username;
    let password = req.body.password;

    connection.query("Select * from login_page where Username = ? and Password = ?",[username,password],function (error,result) {
        if(result.length > 0)
            resp.redirect("/welcome");
        else
            resp.redirect("/login");
        resp.end();
    })
})
app.get("/login",function (req,resp) {
    resp.sendFile(__dirname+"/login.html");
})
app.get("/welcome",function(req,resp){
    resp.sendFile(__dirname+"/index.html");
})
app.listen(4000);