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






module.exports = {getUserByEmail, }