const inquirer = require("inquirer");
const sql = require("mysql")
const connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});
var po = require('pretty-columns').output;

connection.connect(function (err) {
    if (err) throw (err);
    console.log("Connected to the Bamazon server\n");
    menuInit();
})

function menuInit() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Choose an option:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(answer => {
        switch (answer.menu) {
            case "View Products for Sale": viewProducts()
                break;
            case "View Low Inventory": viewLowInv()
                break;
            case "Add to Inventory": addToInv()
                break;
            case "Add New Product": addToInv()
        }
    })
}
function viewProducts() {
    connection.query("SELECT * FROM PRODUCTS", function (err, res) {
        if (err) throw (err);
        let array = [["Product ID", "Product Name", "Department", "Price", "Quantity"]];
        res.forEach(element => {
            let string = [`${element.item_id}`, `${element.product_name}`, `${element.department_name}`, `${element.price}`, `${element.stock_quantity}`]
            array.push(string);
        });
        printResults(array);
        connection.end()
    });
}
function viewLowInv() {
    connection.query("select * from products where stock_quantity<5", function (err, res) {
        if (err) throw (err)
        let array = [["Product ID", "Product Name", "Department", "Price", "Quantity"]];
        res.forEach(element => {
            let string = [`${element.item_id}`, `${element.product_name}`, `${element.department_name}`, `${element.price}`, `${element.stock_quantity}`]
            array.push(string);
        });
        printResults(array);
        connection.end()
    });
}
function addToInv() {
    inquirer.prompt([
        {
            name: "productID",
            type: "number",
            message: "Enter the ID of the product you wish to update:",
        },
        {
            name: "quantity",
            type: "number",
            message: "Enter the quantity to add to our stock:"
        }
    ]).then(answers => {
        let quantity = answers.quantity;
        let id = answers.productID;
        connection.query(`UPDATE PRODUCTS SET stock_quantity = stock_quantity+ ? WHERE item_id = ?`,
            [`${quantity}`, `${id}`],
            function (err, res) {
                if (err) throw err;
                console.log(`Added successfully!\n ${res.message}`)
            })
        connection.end()
    })
}
function addProcuct() {

}
function printResults(arr) {
    po(arr, {
        align: 'cr',
        columnSeparation: ' | ',
        rowSeparation: " |\n| ",
        prefix: '| ',
        suffix: ' |',
    })
}