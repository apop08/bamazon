const mysql = require("mysql");
const inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    // connection.end();
    display();
});

function display()
{
    connection.query("SELECT item_id, product_name, price, stock_quantity from products", function (err, res) {
        if (err) throw err;
        res.forEach(function (element) {
            console.log("Product id: " + element.item_id);
            console.log("Product name: " + element.product_name);
            console.log("Product price: $" + element.price);
            console.log("Product quantity: " + element.stock_quantity)
            console.log("------------------------------")
        });
        promptCustomer(res);
        //connection.end();
    });
}

function promptCustomer()
{
    inquirer
    .prompt([
        {
            name: "itemToBuy",
            type: "input",
            message: "Which product would you buy? ",
            validate: function (value) {
                if (value) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function (ans) {
        checkItem(ans.itemToBuy);
    });
}

function promptCustomerBuy(item)
{
    inquirer
    .prompt([
        {
            name: "buyQty",
            type: "input",
            message: "How many would you like to buy? ",
            validate: function (value) {
                if (value) {
                    if(value > item.stock_quantity){
                        console.log(" Insufficient quantity!");
                        return false;
                    }
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function (ans) {
        buy(item, ans.buyQty);
    });
}

function checkItem(item)
{
    connection.query("SELECT item_id, product_name, price, stock_quantity from products where ?",{
        product_name: item
    }, function (err, res) {

        if (err) throw err;
        let item_obj = null;
        res.forEach(function (element) {
            console.log("Product id: " + element.item_id);
            console.log("Product name: " + element.product_name);
            console.log("Product price: $" + element.price);
            console.log("Product quantity: " + element.stock_quantity)
            item_obj = element;
            console.log("------------------------------")
        });
        if(item_obj) promptCustomerBuy(item_obj);
        else{
            console.log("Item not found");
            promptCustomer();
        }
    });
}
function buy(item, qty)
{
    connection.query("update products set ? where ?", [{stock_quantity: item.stock_quantity - qty}, {item_id: item.item_id}], function (err, res) {

        if (err) throw err;
        console.log(`You bought ${qty} of ${item.product_name} costing $ ${qty * item.price}`);
        restartQuestion();
    });
}

function restartQuestion()
{
    inquirer
    .prompt([
        {
            name: "restart",
            type: "list",
            message: "Buy again?",
            choices: ["Yes", "No"],
        }
    ])
    .then(function (ans) {
        if(ans.restart == "Yes") display();
        else connection.end();
    });
}
