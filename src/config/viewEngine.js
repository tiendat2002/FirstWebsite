import express from "express";

let congfigViewEngine = (app)=>{
    app.use(express.static("./src/public"))
    app.set("view engine","ejs");//jsp,blade for if else
    app.set("views","./src/views");
}

module.exports = congfigViewEngine;