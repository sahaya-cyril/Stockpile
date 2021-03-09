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
    price: Number,
    stock: {type: Number, default: 0}
};

const cartSchema = {
    item: String,
    bill: {type: Date, default: Date()},
    stock: Number,
    quantity: Number,
    price: Number,
    amount: Number,
};

const Item = mongoose.model("Item", itemSchema);
const Cart = mongoose.model("Cart", cartSchema);

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
    const start = Date.now();
    Item.find({}, (err, items) => {
        if(items.length != 0) {
            Cart.find({}, (err, cartList) => {
                res.render("PurchaseItems", {
                    items: items,
                    date: start,
                    cartList: cartList
                });
            });
        } else {
            res.render("PurchaseItems", {
                items: items,
                date: start,
                cartList: cartList
            });
        }
    });
});

/* res.render("PurchaseItems", {
            items: items,
            date: start, */

app.post("/PurchaseItems", (req, res) => {
    const elements =  req.body.itemName;
    const itemName = elements.split(",");
    const price = req.body.price;
    const stock = req.body.currentStock;

    const cartItem = new Cart({
        item: itemName[0],
        bill: req.body.bill,
        stock: req.body.currentStock,
        quantity: req.body.quantity,
        price: req.body.price,
        amount: req.body.amount
    });
    cartItem.save((err) => {
        if(!err) {
            Item.findOneAndUpdate({item: itemName[0]}, {$set:{price: price, stock: stock}}, (err, data) => {
                if(!err) {
                    res.redirect("/PurchaseItems");
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });

/*     Order.findOneAndUpdate({itemName:itemName[0]},{$set:{bill: bill, stock: itemStock, quantity: quantity, price: price, amount: amount}}, (err, data) => {
        if(!err) {
            res.redirect("/PurchaseItems");
        } else {
            console.log(err);
        }
    }); */
});

app.get("/cartList", (req, res) => {
    console.log("Hello!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});