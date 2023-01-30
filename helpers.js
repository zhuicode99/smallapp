
const urlDatabase = {};
const users = {};

//return username by given email.
const getUserByEmail = (email, users) => {
  let userId = "";
  for (let user in users) {
    if (users[user].email === email) {
      userId = user;
    } 
  }
  return userId;
}


const generateRandomString = () => {
  let randomStr = "";
  let calc = (Math.random()).toString(36).substring(2, 8);
  randomStr += calc;
  return randomStr;
};

const urlsForUser = (id) => {
  const newUrlDatabase = {};
  const keys = Object.keys(urlDatabase);
  for (let key of keys) {
    const urls = urlDatabase[key]
    if (urls.userID === id){
      newUrlDatabase[key] = urls
    } 
  }
  return newUrlDatabase;
}



module.exports = {getUserByEmail, generateRandomString, urlsForUser, urlDatabase, users,}