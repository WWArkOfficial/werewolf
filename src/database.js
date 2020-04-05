const baseUserPath = "/app/.data/users/";
const fs = require("fs");

function getAllUserData(team, cb) {
  const users = [];
  let pending = 0;
  fs.readdir(baseUserPath, (err, list) => {
    if (err) throw err;
    pending = list.length;
    list.forEach((item, index) => {
      if (item.includes("user")) {
        fs.readFile(baseUserPath + item, (err, data) => {
          let rawUser = JSON.parse(data);

          let stats = {
            villager: rawUser.villagerStats,
            werewolf: rawUser.werewolfStats,
            vampire: rawUser.vampireStats,
            tanner: rawUser.tannerStats,
            serialKiller: rawUser.serialKillerStats,
            arsonist: rawUser.arsonistStats
          };

          let result = calculateWinLose(team, stats);
          let totalGame = result.win + result.lose;
          let winRate = Math.floor((result.win / totalGame) * 100);
          if (isNaN(winRate)) {
            winRate = 0;
          }

          let user = {
            id: rawUser.id,
            name: rawUser.name,
            points: rawUser.points,
            totalGame: totalGame,
            winRate: winRate + "%"
          };
          
          if (team) {
            let points = (result.win * 5) + result.lose;
            user.points = points;
          }

          users.push(user);
          if (pending === index + 1) {
            cb(users);
          }
        });
      }
    });
  });
}

function calculateWinLose(team, stats) {
  let win = 0;
  let lose = 0;
  switch (team) {
    case "villager":
      win = stats.villager.win;
      lose = stats.villager.lose;
      break;

    case "werewolf":
      win = stats.werewolf.win;
      lose = stats.werewolf.lose;
      break;

    case "tanner":
      win = stats.tanner.win;
      lose = stats.tanner.lose;
      break;

    case "vampire":
      win = stats.vampire.win;
      lose = stats.vampire.lose;
      break;

    case "serial-killer":
      win = stats.serialKiller.win;
      lose = stats.serialKiller.lose;
      break;

    case "arsonist":
      win = stats.arsonist.win;
      lose = stats.arsonist.lose;
      break;

    default:
      /// calculate total all game play,
      // calculate all win & lose from each team
      Object.keys(stats).forEach(key => {
        let stat = stats[key];
        win += stat.win;
        lose += stat.lose;
      });
  }

  let result = {
    win: win,
    lose: lose
  };
  
  return result;
}

module.exports = {
  getAllUser: getAllUserData
};
