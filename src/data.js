const fs = require("fs");
const helper = require("/app/helper");
const CronJob = require("cron").CronJob;

// game storage
const group_sessions = {};
const user_sessions = {};

// Update session
const updateSessionJob = new CronJob("* * * * * *", function() {
  for (let key in group_sessions) {
    if (group_sessions[key]) {
      if (group_sessions[key].time > 0) {
        group_sessions[key].time--;
      } else {
        let state = group_sessions[key].state;
        let playersLength = group_sessions[key].players.length;
        if (playersLength < 5 && state === "new") {
          helper.resetAllUsers(group_sessions, user_sessions, key);
        } else if (state === "idle") {
          if (group_sessions[key].groupId !== process.env.TEST_GROUP) {
            group_sessions[key].state = "inactive";
          }
        }
      }
    }
  }
});

updateSessionJob.start();

module.exports = {
  receive: function(client, event, rawArgs) {
    this.client = client;
    this.event = event;
    this.rawArgs = rawArgs;

    if (!this.event.source.hasOwnProperty("userId")) {
      if (!this.rawArgs.startsWith("/")) {
        return Promise.resolve(null);
      } else {
        return this.replyText(
          "💡 This bot only support LINE version 7.5.0 or higher.\nTry updating, block, and re-add this bot."
        );
      }
    }

    this.args = this.rawArgs.split(" ");
    this.searchUser(this.event.source.userId);
  },

  searchUser: async function(id) {
    if (!user_sessions[id]) {
      let newUser = {
        id: id,
        name: "",
        state: "inactive",
        groupId: "",
        points: 0,
        villagerStats: {
          win: 0,
          lose: 0
        },
        werewolfStats: {
          win: 0,
          lose: 0
        },
        vampireStats: {
          win: 0,
          lose: 0
        },
        tannerStats: {
          win: 0,
          lose: 0
        },
        serialKillerStats: {
          win: 0,
          lose: 0
        },
        arsonistStats: {
          win: 0,
          lose: 0
        }
      };
      user_sessions[id] = newUser;
    }

    let userData = user_sessions[id];

    if (userData.name === "") {
      try {
        let profile = await this.client.getProfile(userData.id);
        userData.name = profile.displayName;
        return this.searchUserCallback(userData);
      } catch (err) {
        if (!this.rawArgs.startsWith("/")) {
          return Promise.resolve(null);
        }
        return this.notAddError(userData.id);
      }
    } else {
      return this.searchUserCallback(user_sessions[id]);
    }
  },

  searchUserCallback: function(userData) {
    if (this.event.source.type === "group") {
      return this.searchGroup(userData, this.event.source.groupId);
    } else if (this.event.source.type === "room") {
      return this.searchGroup(userData, this.event.source.roomId);
    } else if (userData.state === "active") {
      return this.searchGroup(userData, userData.groupId);
    } else {
      const idle = require("/app/src/idle");
      return idle.receive(
        this.client,
        this.event,
        this.args,
        this.rawArgs,
        userData
      );
    }
  },

  searchGroup: function(user_session, groupId) {
    /// for maintenance
    if (this.rawArgs.startsWith("/")) {
      // logging
      let logText = user_session.name + " // ";
      logText += groupId + " : ";
      logText += this.args;
      console.log(logText);
      if (user_session.id !== process.env.DEV_ID) {
        // semua grup ga bisa
        //return this.maintenanceRespond();

        // buat khusus test grup aja
        if (groupId !== process.env.TEST_GROUP) {
          //return this.maintenanceRespond();
        }
      }
    }

    if (!group_sessions[groupId]) {
      let newGroup = {
        groupId: groupId,
        state: "idle",
        time_default: 0,
        time: 300,
        players: []
      };
      group_sessions[groupId] = newGroup;
    }

    if (group_sessions[groupId].state === "inactive") {
      let text = "👋 Sistem mendeteksi tidak ada permainan dalam 5 menit. ";
      text += "Undang kembali jika mau main ya!";
      this.client
        .replyMessage(this.event.replyToken, {
          type: "text",
          text: text
        })
        .then(() => {
          if (this.event.source.type === "group") {
            this.client.leaveGroup(groupId);
          } else {
            this.client.leaveRoom(groupId);
          }
        });
    } else {
      this.searchGroupCallback(user_session, group_sessions[groupId]);
    }
  },

  searchGroupCallback: function(user_session, group_session) {
    return this.forwardProcess(user_session, group_session);
  },

  forwardProcess: function(user_session, group_session) {
    if (this.event.source.type === "user") {
      const personal = require("/app/src/personal");
      return personal.receive(
        this.client,
        this.event,
        this.args,
        this.rawArgs,
        user_session,
        group_session
      );
    } else {
      const werewolf = require("/app/src/werewolf");
      return werewolf.receive(
        this.client,
        this.event,
        this.args,
        this.rawArgs,
        user_session,
        group_session
      );
    }
  },

  /** message func **/

  notAddError: async function(userId) {
    let text = "";
    try {
      if (this.event.source.type === "group") {
        let groupId = this.event.source.groupId;
        let profile = await this.client.getGroupMemberProfile(groupId, userId);
        text += "💡 " + profile.displayName;
      } else if (this.event.source.type === "room") {
        let groupId = this.event.source.roomId;
        let profile = await this.client.getRoomMemberProfile(groupId, userId);
        text += "💡 " + profile.displayName;
      }
      text += " gagal bergabung kedalam game, add dulu botnya" + "\n";
      text += "https://line.me/ti/p/" + process.env.BOT_ID;
      return this.replyText(text);
    } catch (err) {
      console.log("notAddError error", err.originalError.response.data);
    }
  },

  maintenanceRespond: async function() {
    let groupId = "";
    let userId = this.event.source.userId;
    let text = "👋 Sorry ";
    let addonText =
      "💡 Untuk info lebih lanjut bisa cek di http://bit.ly/openchatww";
    try {
      if (this.event.source.type === "group") {
        let groupId = this.event.source.groupId;
        let profile = await this.client.getGroupMemberProfile(groupId, userId);
        text += profile.displayName;
      } else if (this.event.source.type === "room") {
        let groupId = this.event.source.roomId;
        let profile = await this.client.getRoomMemberProfile(groupId, userId);
        text += profile.displayName;
      }
      text += ", botnya sedang maintenance. " + addonText;
      return this.replyText(text);
    } catch (err) {
      console.log("maintenanceRespond error", err.originalError.response.data);
    }
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client
      .replyMessage(
        this.event.replyToken,
        texts.map(text => ({ type: "text", text }))
      )
      .catch(err => {
        console.log(err.originalError.response.data);
      });
  },

  /** save data func **/

  saveUserData: function(user_session) {
    let path = "/app/.data/users/" + user_session.id + "_user.json";
    let data = JSON.stringify(user_session, null, 2);
    fs.writeFile(path, data, err => {
      if (err) throw err;
      this.resetUser(user_session.id);
    });
  },

  getUserData: function(id, newUserData) {
    const baseUserPath = "/app/.data/users/";
    let userPath = baseUserPath + id + "_user.json";
    let user_session = {};
    fs.readFile(userPath, "utf8", (err, data) => {
      if (err) {
        // use the apa adanya user_session
        this.saveUserData(newUserData);
      } else {
        user_session = JSON.parse(data);
        this.updateUserData(user_session, newUserData);
      }
    });
  },

  updateUserData: function(oldUserData, newUserData) {
    oldUserData.name = newUserData.name;

    oldUserData.points += newUserData.points;
    if (oldUserData.points < 0) {
      oldUserData.points = 0;
    }

    oldUserData.villagerStats.win += newUserData.villagerStats.win;
    oldUserData.villagerStats.lose += newUserData.villagerStats.lose;

    oldUserData.werewolfStats.win += newUserData.werewolfStats.win;
    oldUserData.werewolfStats.lose += newUserData.werewolfStats.lose;

    oldUserData.vampireStats.win += newUserData.vampireStats.win;
    oldUserData.vampireStats.lose += newUserData.vampireStats.lose;

    oldUserData.tannerStats.win += newUserData.tannerStats.win;
    oldUserData.tannerStats.lose += newUserData.tannerStats.lose;

    oldUserData.serialKillerStats.win += newUserData.serialKillerStats.win;
    oldUserData.serialKillerStats.lose += newUserData.serialKillerStats.lose;

    oldUserData.arsonistStats.win += newUserData.arsonistStats.win;
    oldUserData.arsonistStats.lose += newUserData.arsonistStats.lose;

    this.saveUserData(oldUserData);
  },

  resetAllPlayers: function(players, groupId) {
    players.forEach(item => {
      let reset_player = {
        id: item.id,
        name: item.name,
        points: item.points,
        villagerStats: item.villagerStats,
        werewolfStats: item.werewolfStats,
        vampireStats: item.vampireStats,
        tannerStats: item.tannerStats,
        serialKillerStats: item.serialKillerStats,
        arsonistStats: item.arsonistStats
      };

      this.getUserData(item.id, reset_player);
    });

    this.resetRoom(groupId);
  },

  resetRoom: function(groupId) {
    group_sessions[groupId] = null;
  },

  resetUser: function(userId) {
    user_sessions[userId] = null;
  },

  resetAllUsers: function(groupId) {
    if (group_sessions[groupId]) {
      group_sessions[groupId].players.forEach(item => {
        this.resetUser(item.id);
      });
      this.resetRoom(groupId);
    }
  },

  /** helper func **/

  handleLeftUser: function(userId) {
    if (user_sessions[userId] && user_sessions[userId].state === "inactive") {
      this.resetUser(userId);
    }
  },

  getOnlineUsers: function() {
    let onlineUsersCount = 0;
    Object.keys(user_sessions).forEach(key => {
      let user = user_sessions[key];
      if (user && user.state === "active") {
        onlineUsersCount++;
      }
    });
    return onlineUsersCount;
  },

  getOnlineGroups: function() {
    let onlineGroupsCount = 0;
    Object.keys(group_sessions).forEach(key => {
      let group = group_sessions[key];
      if (group && group.state !== "idle" && group.state !== "inactive") {
        onlineGroupsCount++;
      }
    });
    return onlineGroupsCount;
  }
};
