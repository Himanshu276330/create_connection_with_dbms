const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection(
    {
        user: "root",
        host: "localhost",
        password: "himanshu@154",
        database: "airport"
    }    
);

const command = [
    {"url_to_show_tables": "http://localhost:3002/showTables"},
    {"url_to_Find the airplane models which have spent the  maximum number of hours for every test type.\n Arrange your data according to descending order of Test Type": "http://localhost:3002/q1"},
    {"url_to_Find the testing event with the best score in a particular test.": "http://localhost:3002/q2"},
    {"url_to_Find the testing event with the worst score in a particular test.": "http://localhost:3002/q3"}
]

app.get('/',(req,res)=>{
    res.send(command);
});

app.get('/showTables',(req,res)=>{
    db.query(
        "SHOW TABLES" ,
        (err,result)=>{
            if(err){
                console.log('not connect');
                console.log(err);
            }else{
                console.log(result); 
                res.send(result);
            }
        }  
    );
});

app.get('/q1',(req,res)=>{
    db.query(
        "SELECT t.name AS test, a.model_number, MAX(te.hours) AS max_hours_spent FROM tests t INNER JOIN testing_event te ON t.FAA_number = te.FAA_number INNER JOIN planes p ON te.registration_number = p.registration_number INNER JOIN airplane_models a ON p.model_number = a.model_number GROUP BY t.name, a.model_number ORDER BY t.name DESC;",

        (err,result)=>{
            if(err){
                console.log('not connect');
                console.log(err);
            }else{
                console.log(result); 
                res.send(result);
            }
        }  
    );
});

app.get('/q2',(req,res)=>{
    db.query(
        "SELECT * FROM testing_event WHERE score = (SELECT MAX(score) FROM testing_event);" ,
        (err,result)=>{
            if(err){
                console.log('not connect');
                console.log(err);
            }else{
                console.log(result); 
                res.send(result);
            }
        }  
    );
});

app.get('/q3',(req,res)=>{
    db.query(
        "SELECT * FROM testing_event WHERE score = (SELECT MIN(score) FROM testing_event);" ,
        (err,result)=>{
            if(err){
                console.log('not connect');
                console.log(err);
            }else{
                console.log(result); 
                res.send(result);
            }
        }  
    );
});


app.listen(3002,()=>{
    console.log("You DBMS server is running....");
});