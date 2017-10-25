const express = require("express");

const app = express();

app.listen(3000, "localhost", ()=>{
    console.log("Server listening on localhost:3000");
});

app.use(express.static("static"));