const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var items = ["Buy Food", "Cook FOod", "Eat food"];

app.use(express());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  var today = new Date();
  var typeofday = "";
  var currentday = today.getDay();

  if (currentday === 6 || currentday == 0) {
    typeofday = "weekend";
  } else {
    typeofday = "weekday";
  }

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var day = today.toLocaleDateString("en-US", options);

  res.render("list", { kindofday: typeofday, day: day, newListItem: items });
});

app.post("/", (req, res) => {
  item = req.body.newItem;
  console.log(item);
  items.push(item);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("The Server is running at port 3000");
});
