//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const items = [];

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/AddItem", (req, res) => {
    res.render("AddItem", {
        items: items
    });
});

app.post("/AddItem", (req, res) => {
    const item = {
        item: req.body.item,
        price: req.body.price
    } 
    items.push(item);

    res.redirect("/AddItem");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});