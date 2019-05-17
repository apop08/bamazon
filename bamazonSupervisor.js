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
    promptSupervisor();
});

function display() {
    connection.query("SELECT department_id, department_name, overhead_costs, sales from departments", function (err, res) {
        if (err) throw err;
        res.forEach(function (element) {
            console.log("Department id: " + element.department_id);
            console.log("Department name: " + element.department_name);
            console.log("Overhead Costs: $" + element.overhead_costs);
            console.log("Sales: $" + element.sales);
            console.log("Total Profit: $" + parseFloat(element.sales - element.overhead_costs));
            console.log("------------------------------");
        });
        promptSupervisor();
        //connection.end();
    });
}

function addItem(item) {
    connection.query("insert into departments set ?",
        {
            department_name: item.deptName
        }, function (err, res) {

            if (err) throw err;
            promptSupervisor();
        });
}

function promptSupervisorAdd() {
    inquirer
        .prompt([
            {
                name: "deptName",
                type: "input",
                message: "Name of department to add?",
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

function promptSupervisor() {
    inquirer
        .prompt([
            {
                name: "prompt",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Product Sales by Department", "Create New Department", "Quit"],
            }
        ])
        .then(function (ans) {
            switch (ans.prompt) {
                case ("View Product Sales by Department"):
                    display();
                    break;
                case ("Create New Department"):
                    promptSupervisorAdd();
                    break;
                default:
                    connection.end();
            }
        });
}
