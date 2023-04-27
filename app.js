const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const workItems = [];

app.use(express());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://mongo:mongo@cluster0.mzofbvq.mongodb.net/todolistDB?",
  {
    useNewUrlParser: true,
  }
);

// Making a Schema
const itemSchema = new mongoose.Schema({
  name: String,
});
// mongoose model
const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to the TodoList",
});
const item2 = new Item({
  name: "Hit the + button to add a new Item",
});
const item3 = new Item({
  name: "<--Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

// listSchema
const listSchema = {
  name: String,
  items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  Item.find()
    .then((foundItems) => {
      if (foundItems.length === 0) {
        // insert item in mongoose
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Sucessfully saved default item to DB");
          })
          .catch((err) => {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", {
          listTitle: "Today",
          newListItem: foundItems,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.get("/about", (req, res) => {
//   res.render("about");
// });

app.post("/", (req, res) => {
  let itemName = req.body.newItem;
  let listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then((foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox.trim();
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId)
      .then(() => {
        console.log("successfully deleted from the todoList");
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then((foundList) => {
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// app.post("/work", (res, req) => {
//   let item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("/work");
// });

app.get("/:todoTitle", async (req, res) => {
  const requestedTodoTitle = _.capitalize(req.params.todoTitle);

  try {
    const results = await List.findOne({ name: requestedTodoTitle });

    if (!results) {
      const list = new List({
        name: requestedTodoTitle,
        items: defaultItems,
      });
      await list.save();
      res.redirect("/" + requestedTodoTitle);
    }

    res.render("list", {
      listTitle: results ? results.name : requestedTodoTitle,
      newListItem: results ? results.items : defaultItems,
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3200, () => {
  console.log("The Server is running at port 3200");
});
