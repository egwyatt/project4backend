import express from 'express';

import cors from 'cors';

import users from './routes/users.js';

import mysql from 'mysql2';

// connecting Database
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb"
});

const app = express();

app.use(express.json());

app.use(cors());

app.use('/users',users);

app.get('/',(req,res) => {

    res.send('backend operational');

})

app.listen( 5000, () => {

    console.log('listening at http://localhost:5000/');
    

})
app.post('/register', (req, res) => {

    const userName = req.body.userName; 

    const password = req.body.password; 

    const confirmPassword = req.body.confirmPassword; 

    connection.query("INSERT INTO users (userName, password) VALUES (?, ?)", [userName, password], 

        (err, result) => {

            if(result){

                res.send(result); 

            } else {

                res.send({message: "Enter Requested Data"})

            }

        }

    )

})