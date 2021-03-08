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

const orderSchema = {
    invoiceNo: Number,
    custName: String,
    itemName: String,
    quantity: Number,
    price: Number,
    totalAmount: Number,
    bill: {type: Date, default: Date()},
    itemStock: [itemSchema.stock.default]
};

const Item = mongoose.model("Item", itemSchema);
const Order = mongoose.model("Order", orderSchema);

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
        res.render("PurchaseItems", {
            items: items
        });
    });
});

app.post("/PurchaseItems", (req, res) => {
    const elements =  req.body.itemName;
    const itemName = elements.split(",");

    const orderItem = new Order({
        item: itemName,
        bill: req.body.bill,
        itemStock: req.body.currentStock,
        quantity: req.body.quantity,
        price: req.body.price,
        totalAmount: req.body.amount
    });

    orderItem.save((err) => {
        if(!err) {
            res.redirect("/PurchaseItems");
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

app.get("/MyStock", (req, res) => {
    Item.find({}, (err, items) => {
        res.render("MyStock", {
            items: items
        });
    });
});

app.get("/invoice", (req, res) => {
        res.render("invoice", {
    });
});

app.get("/SellItem", (req, res) => {
    const start = Date.now();
    Item.find({}, (err, items) => {
        res.render("SellItem", {
            items: items,
            date: start
        });
    });
});

app.post("/SellItem", (req, res) => {
    const custName = req.body.customerName;
    const elements = req.body.itemName;
    const items = elements.split(",");
    const bill = req.body.bill;
    const stock = req.body.currentStock;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const amount = req.body.amount;

    Item.findOneAndUpdate({item:items[3]},{$set:{custName: custName, bill: bill, stock: stock, quantity: quantity, price: price, amount: amount}}, (err, data) => {
        if(!err) {
            res.redirect("/SellItem");
        } else {
            console.log(err);
        }
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});