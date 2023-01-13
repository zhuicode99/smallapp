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
//从urls—new.ejs 里面的form输入long-url后点submit，由于form的action是/urls
//所以会post（create）到/urls页面，这个end point就是完成post到/url的操作，
//用function生成的shortid，添加到urldatabase，然后完成post到/url界面这个action以后直接跳转
//跳转到/urls/：id 界面，而不是停留在/url界面。但是数据更新在了/url界面。
//new

app.get("/urls/:id",(req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars); 
})//like /urls/b2xVn2 in the browser. 
//Further, the value of req.params.id would be b2xVn2.

//use shortID link to redirect to longID link
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  let http = 'http://';
  if(longURL.includes(http)) {
    res.redirect(`${longURL}`);
  }
  else {
    res.redirect(`${http}${longURL}`); //==》  res.redirect(`http://${longURL}`)
  }
});















app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});









