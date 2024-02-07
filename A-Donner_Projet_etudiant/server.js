/*
Importation des modules requis
*/
//import express from "express";
//import session from "express-session";
//import path from "path";
//import { fileURLToPath } from "url";
//import mysql from "mysql";
//import { body, validationResult } from "express-validator";
//import dateFormat from "dateformat";


let express = require("express");
let http = require("http");
let mysql = require("mysql"); 
let app = express();
let bodyParser = require("body-parser");
//const app = express();
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
/*
Connect to server
*/
const server = app.listen(4000, function() {
console.log("serveur fonctionne sur 4000... ! ");
});

/*
Configuration de EJS
*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
/*
Importation de Bootstrap
*/
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use(express.static('public'));


/*
Connection au server MySQL
*/
const con = mysql.createConnection({
    host: "localhost",
    user: "scott",
    password: "oracle",
    database: "mybd"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("connected!");
});


/*
Description des routes
*/
app.get("/", function (req, res) {
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function (err,
result) {
        if (err) throw err;
        res.render("pages/index", {
            siteTitle: "Application simple",
            pageTitle: "Liste d'événements",
            items: result
        });
    });
});


app.get("/event/add", function (req, res) {
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function (err, 
result) {
        if (err) throw err;
        res.render("pages/add-event", {
            siteTitle: "Application simple",
            pageTitle: "Ajouter un nouvel événement",
            items: result
        });
    });
});
    

app.post("/event/add", function (req, res) {
    const requete = "INSERT INTO e_events (e_name, e_start_date, e_start_end, e_desc, e_location) VALUES (?, ?, ?, ?, ?)";
    const parametres = [
    req.body.e_name,
    dateFormat(req.body.e_start_date, "yyyy-mm-dd"),
    dateFormat(req.body.e_start_end, "yyyy-mm-dd"),
    req.body.e_desc,
    req.body.e_location
    ];

    con.query(requete, parametres, function (err, result) {
        res.redirect("pages/index");
    if (err) throw err;
    res.redirect("pages/index");
    });
    });
    
    /*
    Permettre l'utilisation de body lors des POST request
    */
    app.use(express.json());


    app.use(bodyParser.urlencoded({ extended: true }));
    module.exports = app;


    