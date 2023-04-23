const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const items = ["Buy Food", "Cook FOod", "Eat food"];
const workItems = [];

app.use(express());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  let day = date.getDate();
  res.render("list", {
    listTitle: day,
    newListItem: items,
  });
});

app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: "Work List",
    newListItem: workItems,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  let item = req.body.newItem;

  if (req.body.list == "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.post("/work", (res, req) => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(3000, () => {
  console.log("The Server is running at port 3000");
});
