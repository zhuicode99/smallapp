const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser')

app.set("view engine", "ejs") // set the structure 


app.use(express.urlencoded({ extended: true })); //body parser for post requst
app.use(cookieParser());

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


const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  }
};

//return username by given email.
const getUserByEmail = (email) => {
  let userId = "";
  for (let user in users) {
    if (users[user]['email'] === email) {
      userId = user;
    } else {
      userId = "wrong";
    }
  }
  return userId;
}

app.get("/urls.json",(req, res) => {
   res.json(urlDatabase);
});


app.get("/urls",(req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: users[req.cookies.user_id]
  }
  res.render("urls_index", templateVars); 
});

//new
app.get("/urls/new",(req, res) => {
  const templateVars = {
    username: users[req.cookies.user_id]
  }
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let id = generateRandomString();
  urlDatabase[id] = req.body['longURL'];
  res.redirect(`/urls/${id}`)
});
//从urls—new.ejs 里面的form输入long-url后点submit，由于form的action是/urls
//所以会post（create）把数据送到/urls页面，在这个end point来action，
//action：“用function生成的shortid，添加到urldatabase，然后完成post到/url界面这个action以后直接跳转
//跳转到/urls/：id 界面，而不是停留在/url界面。但是数据更新在了/url界面。”
//下面的更准确，上面的待证实
//action的url要跟app。post上的url一致。
// 就算action上的url是abc，只要app.post上也是abc，就还是能完成更新
//因为通过function把database更新了，就是会显示到/urls。
//new

app.get("/urls/:id",(req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars); 
})//like /urls/b2xVn2 in the browser. 
//Further, the value of req.params.id would be b2xVn2.
app.post("/urls/:id", (req, res) => {
  let id = req.params.id
  urlDatabase[id] = req.body['longURL'];
  res.redirect("/urls")
})

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



//delete
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id]
  res.redirect("/urls")
});
//从 /urls 页面 （urls—index。ejs）点击 delete（del在form里） 
//来trigger post action，action的url要跟app。post上的url一致。
// 完成delete 以后redirect到/urls页面。
//因为没有数据要传输，所以跟上边的例子不一样

//edit
app.post("/urls/:id/edit", (req, res) => {
  let id = req.params.id

  res.redirect(`/urls/${id}`)
})

//login
app.get("/login", (req, res) => {
  const templateVars = {
    username: users[req.cookies.user_id]
  }
  if (req.cookies.user_id){
    res.redirect("/urls")
  } else {
    res.render('urls_login', templateVars)
  }
})

app.post("/login", (req, res) => {
  let email = req.body.email;
  let id = getUserByEmail(email);
  let password = req.body.password;
  if (!email||!password) {
    return res.status(400).send('Sorry! Your entry is either empty or invalid.')
  }
/* if(){
  return res.status(400).send("either email or password not correct")
} */
   if(id === 'wrong'||users[id].password !== password) {
      return res.status(400).send("either email or password not correct")
    } else {
      res.cookie("user_id", id) //只需要传id到cookie就行，因为其他get端是用这个id来提取信息
      //或者直接传id object到cookie也行， 但是其他get端要改成直接提取cookie信息就行。
    res.redirect("/urls")
  }

 
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id"); // clear cookie
  res.redirect('/login')
})

//logout


app.get("/register", (req, res) => {
  
  const templateVars = {
    username: users[req.cookies.user_id]
  }
  if (req.cookies.user_id){
    res.redirect('/urls')
    /* res.render("urls_register", templateVars) */
  } else {
    res.render("urls_register", templateVars)
  }
});




app.post("/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  if (!email||!password) {
    return res.status(400).send('Sorry! Your entry is either empty or invalid.')
  }

   if(users[getUserByEmail(email)]) {
      return res.status(400).send(`${email} already registered`)
  }

  users[id] = {
    id: id,
    email: email,
    password: password,
  }

  console.log("users",users)
/*   res.cookie("user_id", id) */
  res.redirect("/login")
});














app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});









