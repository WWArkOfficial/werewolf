const baseUserPath = "/app/.data/users/";
const fs = require("fs");

// Reset User Points
function resetUsersPoint() {
  fs.readdir(baseUserPath, (err, data) => {
    if (err) throw err;
    getUserPath(data);
  });
}

function getUserPath(list) {
  list.map((item, index) => {
    if (item.includes("user")) {
      getUserData(baseUserPath + item);
    }
  });
}

function getUserData(path) {
  fs.readFile(path, (err, data) => {
    let user = JSON.parse(data);
    user.points = 0;
    let editedUser = JSON.stringify(user, null, 2);
    updateUserData(path, editedUser);
  });
}

function updateUserData(path, editedUser) {
  fs.writeFile(path, editedUser, err => {
    if (err) throw err;
  });
}

module.exports = {
  usersPoint: resetUsersPoint
};
