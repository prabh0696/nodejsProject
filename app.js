var express = require('express');
var app = express();
var mysql = require('mysql');

var bodyparser = require('body-parser');

var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database: 'retrofitdb'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.get('/profile/',(req,res)=>{

    connection.query("SELECT * FROM user_profile",(err,result)=>{
        if(err) throw err;
        res.send(JSON.stringify(result));
        console.log(result);
    });
});

app.post('/profile/',(req,res,next)=>{

    var data = req.body;
    var name = data.name;
    var email = data.email;
    var phone = data.phone;
    var address = data.address;
    var city = data.city;
    var province = data.province;
    var country = data.country;
    var postalcode = data.postalcode;

    connection.query("SELECT * FROM user_profile WHERE email = ?",[email],function(err,result,fields){
        connection.on('error',(err)=>{
            console.log("[MYSQL ERROR]",err);
        });

        if(result && result.length){
            res.json("Profile data for this User already Exists......");
        }
        else{
            var insert = "INSERT INTO user_profile (name,email,phone,address,city,province,country,postalcode) values(?,?,?,?,?,?,?,?)";
            var values = [name,email,phone,address,city,province,country,postalcode];

            console.log("executing: "+insert);
            connection.query(insert,values,(err,result,fields)=>{
                connection.on('error',(err)=>{
                    console.log("[MYSQL ERROR]",err);
            });
            res.json(name+"'s profile data has been saved successfully");
            console.log("Profile data saved Successfully");
        });
        }
    });
});

app.get('/feedback/',(req,res)=>{

    connection.query("SELECT * FROM user_feedback",(err,result)=>{
        if(err) throw err;
        res.send(JSON.stringify(result));
        console.log(result);
    });
});

app.post('/feedback/',(req,res,next)=>{

    var data = req.body;
    var name = data.name;
    var email = data.email;
    var phone = data.phone;
    var producttype = data.producttype;
    var feedback = data.feedback;

    var insert = "INSERT INTO user_feedback (name,email,phone,producttype,feedback) values(?,?,?,?,?)";
    var value = [name,email,phone,producttype,feedback];

    console.log("executing:"+insert);
    connection.query(insert,value,(err,result,fields)=>{
        connection.on('error',(err)=>{
            console.log("[MYSQL ERROR]",err);
        });
        
    
    res.json("Your Feedback Submitted Successfully");
    console.log("Feedback Saved");
     });
});

var server = app.listen(3000,()=>{
    console.log("Server Running at http://localhost:3000");
});