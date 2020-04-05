const fs = require("fs");
const baseUserPath = "/app/.data/users/";
const database = require("/app/src/database");

// const datas = require("/app/src/data");

module.exports = {
  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    switch (this.args[0]) {
      case "/me":
      case "/stats":
      case "/stat":
        return this.meCommand();
      case "/rank":
        return this.rankCommand();
      case "/status":
        // game online ada berapa
        return this.statusCommand();
      case "/reset":
        return this.resetAllCommand();
    }
  },

  meCommand: function() {
    let team = this.args[1];

    let flex_text = {
      header: {
        text: "📜 "
      },
      body: {
        text: ""
      }
    };

    let whatStat = " Summary Stat";
    if (team) {
      let availableTeam = [
        "werewolf",
        "villager",
        "vampire",
        "tanner",
        "serial-killer",
        "arsonist"
      ];
      if (!availableTeam.includes(team)) {
        let text = "💡 Tidak ada ditemukan team '" + team + "', ";
        text += "team yang ada : " + availableTeam.join(", ");
        return this.replyText(text);
      }
      whatStat = " " + team.toUpperCase() + " Stat";
    }

    database.getAllUser(team, users => {
      users = this.rank_sort(users);
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === this.event.source.userId) {
          let whatRank = i + 1;
          let totalGame = users[i].totalGame;
          let winRate = users[i].winRate;

          let text = "⭐ Points : " + users[i].points + " ";
          text += "📊 WR : " + winRate + "\n";
          text += "🎮 Game : " + totalGame + " ";
          text += "🏆 Rank : " + whatRank;

          flex_text.header.text += users[i].name;
          flex_text.header.text += "\n" + whatStat;
          flex_text.body.text += text;

          return this.replyFlex(flex_text);
        }
      }
      return this.replyText(
        "💡 Belum ada data user nya, minimal main 1 game dulu"
      );
    });
  },

  rankCommand: function() {
    let headerText = "🏆 ";
    let team = this.args[1];
    let availableTeam = [
      "villager",
      "werewolf",
      "tanner",
      "serial-killer",
      "arsonist",
      "vampire"
    ];
    if (this.args[1] && !availableTeam.includes(team)) {
      let text =
        "💡 Tidak ada team " +
        team +
        ", team yang ada : " +
        availableTeam.join(", ");
      return this.replyText(text);
    }

    let whatStat = " Global Rank";
    if (team) {
      whatStat = team.toUpperCase() + " Rank";
    }
    headerText += whatStat;

    database.getAllUser(team, users => {
      if (users.length === 0) {
        return this.replyText("💡 Belum ada data usernya");
      }

      users = this.rank_sort(users);
      users.length = 10;

      let flex_text = this.getTableFlex(users, headerText, team);
      return this.replyFlex(flex_text);
    });
  },

  statusCommand: function() {
    const data = require("/app/src/data");
    let usersOnlineCount = data.getOnlineUsers();
    let groupsOnlineCount = data.getOnlineGroups();

    let statusText = "";

    let userText = "";
    if (usersOnlineCount) {
      userText = "Ada " + usersOnlineCount + " user(s) sedang online";
    } else {
      userText = "Semua user sedang offline";
    }

    let groupText = "";
    if (groupsOnlineCount) {
      groupText = "Ada " + groupsOnlineCount + " group(s) sedang online";
    } else {
      groupText = "Semua group sedang offline";
    }

    if (!groupsOnlineCount && !usersOnlineCount) {
      statusText = "Server nganggur, gak ada yang online";
    } else {
      statusText = userText + "\n\n" + groupText;
    }

    let flex_text = {
      header: {
        text: "🌐 Status"
      },
      body: {
        text: statusText
      }
    };
    return this.replyFlex(flex_text);
  },

  /* Helper Func */

  rank_sort: function(array) {
    //Thanks to
    //https://coderwall.com/p/ebqhca/javascript-sort-by-two-fields

    // descending
    return array.sort((person1, person2) => {
      let person1_winRate = person1.winRate.match(/\d+/);
      let person2_winRate = person2.winRate.match(/\d+/);
      return (
        person2.points - person1.points || person2_winRate - person1_winRate
      );
    });
  },

  getTableFlex: function(users, headerText, team) {
    let flex_text = {
      header: {
        text: headerText
      }
    };

    flex_text.table = {
      header: {
        addon: "Win Rate"
      },
      body: []
    };

    let table_body = {};

    let num = 1;
    users.forEach((item, index) => {
      table_body[index] = {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: ""
          },
          {
            type: "text",
            text: "",
            flex: 3
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center"
          },
          {
            type: "text",
            text: "",
            flex: 2,
            align: "center",
            wrap: true
          }
        ],
        margin: "sm"
      };

      table_body[index].contents[0].text += num + ".";
      table_body[index].contents[1].text += item.name;
      table_body[index].contents[2].text += item.points;
      table_body[index].contents[3].text += item.winRate;

      num++;

      flex_text.table.body.push(table_body[index]);
    });

    return flex_text;
  },

  /* Message Func */

  replyFlex: function(flex_raws, text_raws, newFlex_raws) {
    flex_raws = Array.isArray(flex_raws) ? flex_raws : [flex_raws];
    let flex_texts = flex_raws.map(flex_raw => ({
      header: flex_raw.header,
      body: flex_raw.body,
      footer: flex_raw.footer,
      table: flex_raw.table
    }));

    let opt_texts = [];
    if (text_raws) {
      text_raws = Array.isArray(text_raws) ? text_raws : [text_raws];
      opt_texts = text_raws.map(text => {
        return { type: "text", text: text };
      });
    }

    let newFlex_texts = null;
    if (newFlex_raws) {
      newFlex_raws = Array.isArray(newFlex_raws)
        ? newFlex_raws
        : [newFlex_raws];
      newFlex_texts = newFlex_raws.map(newFlex_raw => ({
        header: newFlex_raw.header,
        body: newFlex_raw.body,
        footer: newFlex_raw.footer,
        table: newFlex_raw.table
      }));
    }

    const flex = require("/app/message/flex");
    return flex.receive(
      this.client,
      this.event,
      flex_texts,
      opt_texts,
      newFlex_texts,
      "stat"
    );
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];

    return this.client
      .replyMessage(
        this.event.replyToken,
        texts.map(text => ({ type: "text", text: text.trim() }))
      )
      .catch(err => {
        console.log(err.originalError.response.data);
      });
  }
};
