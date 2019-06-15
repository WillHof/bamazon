const pretty = require("pretty-columns");
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
    console.log("Connected to the Bamazon server\n")
    getProducts()
})
function getProducts() {
    console.log("Welcome to Bamazon! Below is what we have in stock:\n")
    connection.query("SELECT * FROM PRODUCTS", function (err, res) {
        if (err) throw (err);
        let array = [["Product ID", "Product Name", "Department", "Price", "Quantity"]]
        res.forEach(element => {
            let string = [`${element.item_id}`, `${element.product_name}`, `${element.department_name}`, `${element.price}`, `${element.stock_quantity}`]
            array.push(string)
        });
        printResults(array)
        buyProduct(array)
    })
}

function buyProduct(arr) {
    inquirer.prompt([
        {
            type: "number",
            message: "Please enter the id of the product you wish to purchase",
            name: 'id'
        },
        {
            type: "number",
            message: "How many would you like to purchase?",
            name: 'quantity'
        }
    ]).then(answers => {
        var newArr = []
        let ansID = answers.id
        for (i = 1; i < arr.length; i++) {
            newArr.push(arr[i][0])
        }

        //checks if its a valid thing
        if (newArr.includes(ansID.toString())) { productsPurchased(answers, arr) }
        else {
            console.log("this is not a valid ID");
            connection.end();
        }
    })



};

function productsPurchased(obj, arr) {
    let quant = obj.quantity;
    let id = obj.id;
    let newQuant = arr[id][4] - quant
    let cost = arr[id][3] * quant
    if (newQuant >= 0) {
        connection.query(`UPDATE PRODUCTS SET stock_quantity = ${newQuant} WHERE item_id = ${id}`)
        connection.end()
        console.log(`Your purchase of ${arr[id][1]} has been completed. You have been changed $${cost}.`)
    }
    else {
        console.log("Cannot initiate purchase! Insufficient quantity in stock!")
    }
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