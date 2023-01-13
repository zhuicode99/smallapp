const express = require("express");
const app = express();
const PORT = 8080; // default port 8080



app.set("view engine", "ejs") // set the structure 


app.use(express.urlencoded({ extended: true })); //body parser for post requst


const generateRandomString = () => {
  let randomStr = "";
  let calc = (Math.random()).toString(36).substring(2, 8);
  randomStr += calc;
  return randomStr;
};

const urlDatabase = { //temp database
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls.json",(req, res) => {
   res.json(urlDatabase);
});


app.get("/urls",(req, res) => {
  const templateVars = {
    urls: urlDatabase
  }
  res.render("urls_index", templateVars); 
});

//new
app.get("/urls/new",(req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let id = generateRandomString();
  urlDatabase[id] = req.body['longURL'];
  res.redirect(`/urls/${id}`)
});
//new

app.get("/urls/:id",(req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
})//like /urls/b2xVn2 in the browser. 
//Further, the value of req.params.id would be b2xVn2.


















app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});









