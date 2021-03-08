//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/StockpileDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = {
    item: String,
    price: String,
    bill: Date,
    quantity: {type: Number, default: 0},
    stock: {type: Number, default: 0}
};

const Item = mongoose.model("Item", itemSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/AddItem", (req, res) => {
    Item.find({}, (err, items) => {
        res.render("AddItem", {
        items: items
        });
    });
});

app.post("/AddItem", (req, res) => {
    const additem = new Item({
        item: req.body.item,
        price: req.body.price
    }); 
    additem.save((err) => {
        if(!err) {
            res.redirect("/AddItem");
        }
    });
});

app.get("/PurchaseItems", (req, res) => {
    Item.find({}, (err, items) => {
        // var items = JSON.parse(items);
        res.render("PurchaseItems", {
            items: items
        });
    });
});

app.post("/PurchaseItems", (req, res) => {
    
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});