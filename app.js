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
    item: {type: String, default: 0},
    price: {type: Number, default: 0},
    stock: {type: Number, default: 0}
};

const cartSchema = {
    item: {type: String, default: 0},
    bill: {type: Date, default: Date()},
    stock: {type: Number, default: 0},
    quantity: {type: Number, default: 0},
    price: {type: Number, default: 0},
    amount: {type: Number, default: 0}
};

const custOrderSchema = {
    customerName: {type: String, default: "unknown"},
    item: {type: String, default: 0},
    bill: {type: Date, default: Date()},
    stock: {type: Number, default: 0},
    quantity: {type: Number, default: 0},
    gst: {type: Number, default: 0},
    price: {type: Number, default: 0},
    amount: {type: Number, default: 0},
};

const custHistorySchema = {
    invoice: Number,
    customerName: {type: String, default: "unknown"},
    totalAmount: {type: Number, default: 0}

};

const Item = mongoose.model("Item", itemSchema);
const Cart = mongoose.model("Cart", cartSchema);
const Order = mongoose.model("Order", custOrderSchema);
const History = mongoose.model("History", custHistorySchema);

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

    const addcart = new Cart({
        item: req.body.item,
        price: req.body.price,
        quantity: req.body.quantity,
        stock: req.body.currentStock,
        bill: req.body.bill,
        amount: req.body.amount
    });    

    additem.save((err) => {
        if(!err) {
            addcart.save((err) => {
                if(!err) {
                    res.redirect("/AddItem");
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
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
            res.redirect("/AddItem");
        }
    });
});

app.post("/PurchaseItems", (req, res) => {
    const elements =  req.body.itemName;
    const itemName = elements.split(",");
    const price = req.body.price;
    const stock = req.body.currentStock;

    const query = Cart.where({item: itemName[0]});
    query.findOne((err, result) => {
        if(result || !result) {
            if(!result) {
                var quantity = 0 + parseInt(req.body.quantity);
                var amount = 0 + parseInt(req.body.amount);
            } else {
                var quantity = parseInt(result.quantity) + parseInt(req.body.quantity);
                var amount = parseInt(result.amount) + parseInt(req.body.amount);
            }
            Cart.findOneAndUpdate({item: itemName[0]}, {$set:{bill: req.body.bill, stock: req.body.currentStock, quantity: quantity, price: req.body.price, amount: amount}}, (err, data) => {
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
        }
    });
});

app.get("/invoice", (req, res) => {
    Cart.find({}, (err, cartList) => {
        res.render("invoice", {
            cartList: cartList
        });
    });
});

app.post("/invoice", (req, res) => {
    const start = Date.now();
    const itemName = req.body.itemName;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const amount = req.body.amount;
    
    res.redirect("/invoice");

/*     Cart.aggregate([{$group: {$item: $itemName, Quantity: {$sum: $quantity}, Price: {$sum: $price}, Amount: {$sum: $amount}}}], (err, cartList) => {
        if(err) {
            console.log(err);
        } else {
            res.render("invoice", {
                date: start,
                cartList: cartList
            });
        }
    });  */
});

app.get("/MyStock", (req, res) => {
    Item.find({}, (err, items) => {
        res.render("MyStock", {
            items: items
        });
    });
});

app.get("/SellItem", (req, res) => {
    const start = Date.now();

    Item.find({}, (err, items) => {
        if(!err) {
            Order.find({}, (err, orders) => {
                res.render("SellItem", {
                    orders: orders,
                    items: items,
                    date: start
                });
            });
        } else {
            console.log(err);
        }
    });
});

app.post("/SellItem", (req, res) => {
    const elements =  req.body.itemName;
    const itemName = elements.split(",");
    const price = parseInt(req.body.price);
    const stock = req.body.currentStock;
    const gst = Math.round((price * 0.18) * 100)/100;

    const query = Order.where({item: itemName[0]});
    query.findOne((err, result) => {
        if(!result) {
            var quantity = 0 + parseInt(req.body.quantity);
            var amount = 0 + parseInt(req.body.amount);

            const orderList = new Order({
                customerName: req.body.customerName,
                item: itemName[0],
                bill: req.body.bill,
                stock: stock,
                quantity: quantity,
                gst: gst,
                price: price,
                amount: amount
            });
            
            orderList.save((err) => {
                if(!err) {
                    Item.findOneAndUpdate({item: itemName[0]}, {$set:{price: price, stock: stock}}, (err, data) => {
                        if(!err) {
                            res.redirect("/SellItem");
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            var quantity = parseInt(result.quantity) + parseInt(req.body.quantity);
            var amount = parseInt(result.amount) + parseInt(req.body.amount);
        
            Order.findOneAndUpdate({item: itemName[0]}, {$set:{customerName: req.body.customerName, bill: req.body.bill, stock: stock, quantity: quantity, price: price, gst: gst, amount: amount}}, (err, data) => {
                if(!err) {
                    Item.findOneAndUpdate({item: itemName[0]}, {$set:{price: price, stock: stock}}, (err, data) => {
                        if(!err) {
                            res.redirect("/SellItem");
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        }
    });
});

app.get("/sellInvoice", (req, res) => {
    const start = Date.now();

    Order.find({}, (err, orderList) => {
        res.render("sellInvoice", {
            orderList: orderList,
            date: start
        });
    });
});

app.post("/sellInvoice", (req, res) => {
    res.redirect("/sellInvoice")
});

app.post("/orderHist", (req, res) => {
    const orderHist = new History({
        invoice: req.body.invoice,
        customerName: req.body.custName,
        totalAmount: req.body.totalAmount
    });

    orderHist.save((err) => {
        if(!err) {
            res.redirect("/sellInvoice");
        } else {
            console.log(err);
        }
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});