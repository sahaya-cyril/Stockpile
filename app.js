//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/StockpileDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = {
    item: String,
    price: String,
    bill: {type: Date, default: Date.now},
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
    const elements = req.body.itemName;
    const items = elements.split(",");
    const bill = req.body.bill;
    const stock = req.body.currentStock;
    const quantity = req.body.quantity;
    const price = req.body.price;

    Item.findOneAndUpdate({item:items[3]},{$set:{bill: bill, stock: stock, quantity: quantity, price: price}}, (err, data) => {
        if(!err) {
            res.redirect("/PurchaseItems");
        } else {
            console.log(err);
        }
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});