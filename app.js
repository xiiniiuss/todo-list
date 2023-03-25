const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine", "ejs");

//Date............................................................................................................................

let date = new Date();

let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
};

let today = date.toLocaleDateString("en-US", options);

//Database........................................................................................................................

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemSchema = new mongoose.Schema({
    name : String
});

const Item = new mongoose.model('item', itemSchema);

//request and response ...............................................................................................................

app.get("/", (req, res) => {

    Item.find({}).then((todoItems) => {

        res.render("list", { currentDate:today , newListItems:todoItems});

    }) 
});

app.post('/delete', (req, res) => {

    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId).then((err) => {
        if (!err) {
            console.log("Item deleted !");
        }
    });

    res.redirect("/");

})

app.post("/", function(req, res) {

    const itemName = req.body.newItem;

    let add = true;
    
    Item.find({}).then((items) => {

        items.forEach(element => {

            if (element.name === itemName) {

                add = false;

            } else {

                add = true;

            }
        }); 

    })

    if (add === true){

        const newItem = new Item({
            name : itemName
        })

        newItem.save();

    }

    res.redirect("/");
        
});

app.listen(3000);
