// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
})

connection.connect (function(err){
    if (err) throw err;
    console.log("connection successful");
    makeTable();
})

var makeTable=function(){
    connection.query("SELECT * FROM products",function(err,res){
        for (var i=0; i<res.length; i++){
            console.log(res[i].itemid+" || "+res[i].productname+" ||"+res[i].departmentname+" || "+res[i].price+" || "+res[i].stockquantity+ "\n");
        }
    promptCustomer(res);
    })
}

var promptCustomer = function(res){
    inquirer.prompt([{
        type:"input",
        name: "choice",
        message: "What would like to purchase? [Q for quit]"
    }]).then(function(answer){
        var correct = false; 
        for (var i=0;i<res.length;i++){
            if(res[i].productname==answer.choice){
            correct=true;
            var product=answer.choice;
            var id=i;
            inquirer.prompt({
                type: "input",
                name: "quant",
                message: "How many do you want to buy?",
                validate: function(value){
                    if(isNaN(value)===false){
                        return true;
                    } else {
                        return false;
                    }
                }
            }).then(function(answer){
                if((res[id].stockquantity-answer.quant)>0){
                    connection.query ("UPDATE products SET stockquantity='" +(res[id].stockquantity-answer.quant)+"'WHERE productname='"+product+"'",function(err,res2){
                        console.log("Product Bought!!");
                        makeTable();
                    })
                }else{
                    console.log("Not a valid selection!");
                    promptCustomer(res);
                }
            }
        )
            }
        }
    })
}