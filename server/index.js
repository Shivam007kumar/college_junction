const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require('./users/user')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/collegejunction");

app.post('/register',(req,res) =>{
    UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

app.post('/login', (req,res)=>{
    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user=>{
        if(user){
            if(user.password == password){
                res.json("Success")
            }else{
                res.json("No record existed")
            }
        }else{
            res.json("No record existed")
        }
    })
})

app.listen(3001,()=>{
    console.log("server is running")
})