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
    promptManager();
});

function display() {
    connection.query("SELECT item_id, product_name, price, stock_quantity from products", function (err, res) {
        if (err) throw err;
        res.forEach(function (element) {
            console.log("Product id: " + element.item_id);
            console.log("Product name: " + element.product_name);
            console.log("Product price: $" + element.price);
            console.log("Product quantity: " + element.stock_quantity)
            console.log("------------------------------")
        });
        promptManager();
        //connection.end();
    });
}

function promptManagerUpdate() {
    inquirer
        .prompt([
            {
                name: "itemToUpd",
                type: "input",
                message: "Which product would you like to add to? ",
                validate: function (value) {
                    if (value) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (ans) {
            checkItem(ans.itemToUpd);
        });
}

function displayLowInv() {
    connection.query("SELECT item_id, product_name, price, stock_quantity from products where stock_quantity < 5", function (err, res) {
        if (err) throw err;
        res.forEach(function (element) {
            console.log("Product id: " + element.item_id);
            console.log("Product name: " + element.product_name);
            console.log("Product price: $" + element.price);
            console.log("Product quantity: " + element.stock_quantity)
            console.log("------------------------------")
        });
        promptManager();
        //connection.end();
    });
}

function checkItem(item) {
    connection.query("SELECT item_id, product_name, price, stock_quantity from products where ?", {
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
        if (item_obj) addToInv(item_obj);
        else {
            console.log("Item not found");
            promptManagerUpdate();
        }
    });
}


function promptManagerAdd() {
    inquirer
        .prompt([
            {
                name: "itemName",
                type: "input",
                message: "Name of product to add?",
                validate: function (value) {
                    if (value) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "deptName",
                type: "input",
                message: "What department would you like to add to?",
                validate: function (value) {
                    if (value) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of the item?",
                validate: function (value) {
                    if (value) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "units",
                type: "input",
                message: "What is the items inventory?",
                validate: function (value) {
                    if (value) {
                        return true;
                    }
                    return false;
                }
            },
        ])
        .then(function (ans) {
            addItem(ans)
        });
}

function addItem(item) {
    connection.query("insert into products set ?",
        {
            product_name: item.itemName,
            department_name: item.deptName,
            price: item.price,
            stock_quantity: item.units
        }, function (err, res) {

            if (err) throw err;
            promptManager();
        });
}

function add(item, qty) {

    connection.query("update products set ? where ?", [{ stock_quantity: item.stock_quantity + qty }, { item_id: item.item_id }], function (err, res) {

        if (err) throw err;
        promptManager();
    });
}

function addToInv(item) {
    inquirer
        .prompt([
            {
                name: "addQty",
                type: "input",
                message: "How many would you like to add? ",
                validate: function (value) {
                    if (value) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (ans) {
            add(item, ans.addQty);
        });
}

function promptManager() {
    inquirer
        .prompt([
            {
                name: "prompt",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
            }
        ])
        .then(function (ans) {
            switch (ans.prompt) {
                case ("View Products for Sale"):
                    display();
                    break;
                case ("View Low Inventory"):
                    displayLowInv();
                    break;
                case ("Add to Inventory"):
                    promptManagerUpdate();
                    break;
                case ("Add New Product"):
                    promptManagerAdd();
                    break;
                default:
                    connection.end();
            }
        });
}
