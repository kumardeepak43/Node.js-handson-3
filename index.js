const express = require ('express');
const auth = require ("./Routes/auth")

const app = express();

app.use(express.json())

app.get("/",(req,res) =>{
    res.send("Hello Node")
})

app.listen(8080,(req, res) =>{
    console.log(`server started on 8080`);
})