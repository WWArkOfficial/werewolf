const fs = require("fs");
const helper = require("/app/helper");
const attackedMsg = require("/app/message/attack");
const peaceMsg = require("/app/message/peace");
const punishment = require("/app/message/punishment");

module.exports = {
  receive: function(client, event, args, rawArgs, user_session, group_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.rawArgs = rawArgs;
    this.user_session = user_session;
    this.group_session = group_session;

    if (!this.rawArgs.startsWith("/")) {
      let time = this.group_session.time;
      let state = this.group_session.state;

      if (state !== "idle") {
        if (state !== "new") {
          if (time <= 10 && time > 0) {
            if (this.group_session.deadlineCheckChance === 0) {
              return Promise.resolve(null);
            } else {
              this.group_session.deadlineCheckChance--;
            }
            let reminder = "💡 Waktu tersisa " + time;
            reminder += " detik lagi, nanti ketik '/cek' ";
            reminder += "saat waktu sudah habis untuk lanjutkan proses";
            return this.replyText(reminder);
          } else if (time === 0) {
            if (this.indexOfPlayer() !== -1) {
              return this.checkCommand();
            }
          }
        } else {
          if (this.group_session.deadlineCheckChance === 0) {
            return Promise.resolve(null);
          }

          let playersLength = this.group_session.players.length;

          if (playersLength < 5) {
            if (time <= 40 && time > 0) {
              this.group_session.deadlineCheckChance--;
              let reminder = "💡 Waktu tersisa " + time;
              reminder +=
                " detik lagi. Jika tidak ada yang join, game akan dihentikan";
              return this.replyText(reminder);
            }
          }
        }
      }
      return Promise.resolve(null);
    }

    switch (this.args[0]) {
      case "/new":
      case "/buat":
      case "/main":
      case "/play":
        return this.newCommand();
      case "/join":
      case "/j":
        return this.joinCommand();
      case "/cancel":
      case "/out":
      case "/quit":
      case "/keluar":
      case "/left":
        return this.cancelCommand();
      case "/start":
      case "/mulai":
      case "/gas":
        return this.startCommand();
      case "/stop":
        return this.stopCommand();
      case "/cmd":
        return this.commandCommand();
      case "/help":
        return this.helpCommand();
      case "/players":
      case "/player":
      case "/pemain":
      case "/p":
        return this.playersCommand();
      case "/check":
      case "/cek":
      case "/c":
      case "/cok":
        return this.checkCommand();
      case "/tutorial":
        return this.tutorialCommand();
      case "/vote":
        return this.voteCommand();
      case "/about":
        return this.aboutCommand();
      case "/stat":
      case "/stats":
      case "/rank":
      case "/me":
      case "/status":
        return this.statCommand();
      case "/info":
        return this.infoCommand();
      case "/role1":
      case "/roles1":
        return this.info1Command();
      case "/role2":
      case "/roles2":
        return this.info2Command();
      case "/mr":
      case "/news":
        return this.personalCommand();
      case "/skip":
        if (this.user_session.id === process.env.DEV_ID) {
          this.group_session.time = 0;
          this.checkCommand();
        } else {
          return this.replyText(
            "mo ngapain lu " + this.user_session.name + "?"
          );
        }
        break;
      case "/revoke":
        return this.revokeCommand();
      case "/extend":
        return this.extendCommand();
      case "/kick":
        return this.kickCommand();
      default:
        return this.invalidCommand();
    }
  },

  kickCommand: function() {
    let groupId = this.group_session.groupId;
    let text = "👋 Selamat tinggal!";
    this.replyText(text);
    if (this.event.source.type === "group") {
      this.client.leaveGroup(groupId);
    } else {
      this.client.leaveRoom(groupId);
    }
  },

  extendCommand: function() {
    if (this.group_session.state !== "new") {
      let text = "";
      if (this.group_session.state === "idle") {
        text = "💡 Belum ada game yang dibuat, ketik '/new' untuk buat";
      } else {
        text = "💡 Waktu gak bisa ditambahkan saat game sudah berjalan";
      }
      return this.replyText(text);
    }

    this.group_session.time += 60;

    let remind = "⏳ Waktu berhasil di tambah 1 menit. ";
    remind += "Sisa waktu ";

    if (this.group_session.time > 90) {
      let minute = Math.round(this.group_session.time / 60);
      remind += minute + " menit lagi";
    } else {
      remind += this.group_session.time + " detik lagi";
    }

    return this.replyText(remind);
  },

  info1Command: function() {
    const rataratasnmFlex = require("/app/message/roles1");
    return rataratasnmFlex.receive(
      this.client,
      this.event,
      this.args,
      this.user_session,
      this.group_session
    );
  },

  info2Command: function() {
    const rataratasnmFlex = require("/app/message/roles2");
    return rataratasnmFlex.receive(
      this.client,
      this.event,
      this.args,
      this.user_session,
      this.group_session
    );
  },

  personalCommand: function() {
    let text = "💡 " + this.user_session.name + ", perintah ";
    text += this.args[0] + " harusnya digunakan di personal chat bot";
    return this.replyText(text);
  },

  infoCommand: function() {
    const roles = require("/app/roles/rolesInfo");
    return roles.receive(this.client, this.event, this.args);
  },

  tutorialCommand: function() {
    const rataratasnmFlex = require("/app/message/tutorial");
    return rataratasnmFlex.receive(
      this.client,
      this.event,
      this.args,
      this.user_session,
      this.group_session
    );
  },

  helpCommand: function() {
    const rataratasnmFlex = require("/app/message/helps");
    return rataratasnmFlex.receive(
      this.client,
      this.event,
      this.args,
      this.user_session,
      this.group_session
    );
  },

  statCommand: function() {
    if (this.group_session.state !== "idle") {
      let text = "💡 Cek stat bisa dilakukan di pc bot atau ";
      text += "disaat sedang tidak ada room game yang aktif";
      return this.replyText(text);
    }

    const stats = require("/app/src/stats");
    stats.receive(this.client, this.event, this.args);
  },

  aboutCommand: function() {
    const rataratasnmFlex = require("/app/message/about");
    return rataratasnmFlex.receive(
      this.client,
      this.event,
      this.args,
      this.user_session,
      this.group_session
    );
  },

  revokeCommand: function() {
    let state = this.group_session.state;
    if (state !== "vote") {
      let text = "";
      if (state === "idle") {
        text = "💡 " + this.user_session.name;
        text += ", belum ada game yang dibuat, ketik '/new'";
      } else {
        text = "💡 " + this.user_session.name + ", belum saatnya voting";
      }
      return this.replyText(text);
    }

    let index = this.indexOfPlayer();

    if (index === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    let players = this.group_session.players;

    if (players[index].status !== "alive") {
      let text = "💡 " + this.user_session.name + ", kamu sudah mati";
      return this.replyText(text);
    }

    if (players[index].targetVoteIndex === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum vote siapa - siapa";
      return this.replyText(text);
    }

    let pastTargetVoteName = players[players[index].targetVoteIndex].name;

    this.group_session.players[index].targetVoteIndex = -1;

    let text = "💡 " + this.user_session.name;
    text += " batal vote " + pastTargetVoteName;
    return this.replyText(text);
  },

  newCommand: function() {
    if (this.group_session.state !== "idle") {
      let text = "";
      if (this.group_session.state === "new") {
        text += "💡 " + this.user_session.name;
        text += ", sudah ada game yang dibuat di grup ini";
      } else {
        text += "💡 " + this.user_session.name + ", game sedang berjalan";
      }
      return this.replyText(text);
    }

    this.group_session.state = "new";
    this.group_session.players.length = 0;
    this.group_session.nightCounter = 0;
    this.group_session.roomHostId = "";
    this.group_session.time = 600;
    this.group_session.deadlineCheckChance = 1;
    this.group_session.checkChance = 1;
    this.group_session.lynched = null;

    let flex_text = {
      header: {
        text: "📣 Game Baru"
      },
      body: {
        text: "🎮 Game baru telah dibuat!"
      },
      footer: {
        buttons: [
          {
            action: "postback",
            label: "join",
            data: "/join"
          }
        ]
      }
    };

    let remindText = "⏳ Jika jumlah pemain kurang dari 5 dalam 10 menit, ";
    remindText += "game akan diberhentikan";

    /// nambah user auto
    if (this.user_session.state === "inactive") {
      this.group_session.roomHostId = this.user_session.id;
      this.user_session.state = "active";
      this.user_session.groupId = this.group_session.groupId;

      // for (let i = 0; i < 6; i++) {
      let newPlayer = this.createNewPlayer(this.user_session);
      this.addPlayer(newPlayer);
      // }

      let text = "💡 " + this.user_session.name + " berhasil bergabung!";
      return this.replyFlex(flex_text, [text, remindText]);
    } else {
      return this.replyFlex(flex_text, remindText);
    }
  },

  joinCommand: function() {
    if (this.group_session.state !== "new") {
      let text = "";
      if (this.group_session.state === "idle") {
        text += "💡 " + this.user_session.name;
        text += ", belum ada game yang dibuat, ketik '/new'";
      } else {
        text += "💡 " + this.user_session.name + ", game sedang berjalan";
      }
      return this.replyText(text);
    }

    if (this.user_session.state === "active") {
      let text = "";
      if (this.user_session.groupId === this.group_session.groupId) {
        text += "💡 " + this.user_session.name;
        text += ", kamu sudah bergabung kedalam game";
      } else {
        text += "💡 " + this.user_session.name;
        text += ", kamu masih berada didalam game grup lain";
      }
      return this.replyText(text);
    }

    if (this.group_session.players.length === 0) {
      this.group_session.roomHostId = this.user_session.id;
    }

    this.user_session.state = "active";
    this.user_session.groupId = this.group_session.groupId;

    let newPlayer = this.createNewPlayer(this.user_session);

    this.addPlayer(newPlayer);

    let reminder = "⏳ Sisa waktu ";

    if (this.group_session.time > 90) {
      let minute = Math.round(this.group_session.time / 60);
      reminder += minute + " menit lagi";
    } else {
      reminder += this.group_session.time + " detik lagi";
    }

    let text =
      "💡 " + this.user_session.name + " berhasil bergabung!" + "\n" + reminder;

    if (this.group_session.players.length >= 5) {
      text += "\n" + "📣 Sudah cukup pemain, game bisa dimulai";
    }

    return this.replyText(text);
  },

  playersCommand: function() {
    if (this.group_session.state === "idle") {
      return this.replyText("💡 Belum ada game yang dibuat, ketik '/new'");
    }

    let players = this.group_session.players;
    if (players.length === 0) {
      return this.replyText("💡 Belum ada pemain, ketik '/join' utk bergabung");
    }

    let flex_text = {
      header: {
        text: "🐺 Daftar Pemain 👨‍🌾"
      },
      table: {
        header: {
          addon: ""
        },
        body: []
      }
    };

    let table_body = {};

    let num = 1;

    players.forEach((item, index) => {
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
            flex: 3,
            wrap: true
          },
          {
            type: "text",
            text: "",
            flex: 1,
            align: "center"
          }
        ],
        margin: "sm"
      };

      table_body[index].contents[0].text += num + ".";
      table_body[index].contents[1].text += item.name;

      if (item.status === "death") {
        table_body[index].contents[2].text += "💀";
      } else {
        table_body[index].contents[2].text += "😃";
      }

      if (this.group_session.state !== "new") {
        flex_text.table.header.addon = "Role";

        let role = {
          type: "text",
          text: "???",
          flex: 2,
          align: "center",
          wrap: true
        };

        if (item.status === "death") {
          role.text = item.role.name;
        }

        table_body[index].contents.push(role);
      }

      num++;

      flex_text.table.body.push(table_body[index]);
    });

    if (this.group_session.state === "new") {
      flex_text.footer = {
        buttons: [
          {
            action: "postback",
            label: "join",
            data: "/join"
          }
        ]
      };
    }

    return this.replyFlex(flex_text);
  },

  cancelCommand: function() {
    if (this.group_session.state !== "new") {
      let text = "";
      if (this.group_session.state === "idle") {
        text += "💡 Belum ada game yang dibuat, ketik '/new'";
      } else {
        text += "💡 " + this.user_session.name + ", game sedang berjalan. ";
      }
      return this.replyText(text);
    }

    let index = this.indexOfPlayer();

    if (index === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    this.cutFromArray(this.group_session.players, index);

    let text = "💡 " + this.user_session.name + " telah meninggalkan game. ";

    if (this.group_session.players.length === 0) {
      this.group_session.state = "idle";
      text += "\n" + "💡 Game di stop karena tidak ada pemain";
    } else {
      if (this.group_session.roomHostId === this.user_session.id) {
        let randomPlayer = helper.random(this.group_session.players);
        this.group_session.roomHostId = randomPlayer.id;
        text += "\n" + "👑 " + randomPlayer.name;
        text += " menjadi host baru dalam room ini. ";
      }
    }

    this.resetUser();

    return this.replyText(text);
  },

  stopCommand: function() {
    if (this.group_session.state === "idle") {
      return this.replyText("💡 Belum ada game yang dibuat, ketik '/new'");
    }

    let index = this.indexOfPlayer();

    if (index === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    if (this.user_session.id !== this.group_session.roomHostId) {
      let currentRoomHostId = this.group_session.roomHostId;
      let roomHostIndex = this.getPlayerIndexById(currentRoomHostId);
      let players = this.group_session.players;
      let text = "💡 Yang bisa stop game hanya Host Room saja. ";
      text += "👑 Host Room : " + players[roomHostIndex].name;
      return this.replyText(text);
    }

    this.group_session.state = "idle";
    this.group_session.time = 300; // reset to initial time

    this.resetAllPlayers();

    let text = "💡 Game telah di stop " + this.user_session.name;
    return this.replyText(text);
  },

  startCommand: function() {
    if (this.group_session.state !== "new") {
      let text = "";
      if (this.group_session.state === "idle") {
        text += "💡 Belum ada game yang dibuat, ketik '/new'";
      } else {
        text += "💡 " + this.user_session.name + ", game sudah berjalan";
      }
      return this.replyText(text);
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    if (index === -1) {
      let text = "💡 " + this.user_session.name;
      text += ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    if (players.length < 5) {
      let text = "💡 Game belum bisa dimulai, minimal memiliki 5 pemain";
      return this.replyText(text);
    }

    this.group_session.punishment = helper.random(punishment);

    this.randomRoles();
  },

  randomRoles: function() {
    ///werewolf harus selalu ada
    this.group_session.players = helper.shuffleArray(
      this.group_session.players
    );
    let players = this.group_session.players;
    let playersLength = players.length;
    let roles = this.getRandomRoleSet(playersLength);

    this.group_session.players.forEach((item, index) => {
      if (index <= roles.length - 1) {
        item.role.name = roles[index];
      }

      item.role = this.getRoleData(item.role.name);

      /// init private prop special role

      switch (item.role.name) {
        case "vampire":
          item.role.age = 0;
          break;

        case "retributionist":
          item.role.revive = 1;
          break;

        case "veteran":
          item.role.alert = 3;
          break;

        case "doctor":
          item.role.selfHeal = 1;
          break;

        case "vigilante":
          item.role.bullet = 3;
          item.role.isLoadBullet = true;
          break;
      }

      // disini bagi role pake pushMessage
      // if (this.group_session.groupId === process.env.TEST_GROUP) {
      //   // this.client.pushMessage();
      // }
    });

    this.group_session.players = helper.shuffleArray(
      this.group_session.players
    );

    /// untuk role yang berubah-berubah

    // to werewolf cub
    this.checkMorphingRole("consort", "werewolf-cub", "werewolf-cub");
    this.checkMorphingRole("sorcerer", "werewolf-cub", "werewolf-cub");

    // vampire hunter to vigi
    this.checkMorphingRole("vampire-hunter", "vampire", "vigilante");

    // set roles list
    this.group_session.roles = this.getRoleList();

    this.night(null);
  },

  night: function(flex_texts) {
    this.group_session.nightCounter++;

    this.group_session.state = "night";

    /// special role chat
    this.group_session.werewolfChat = [];
    this.group_session.vampireChat = [];

    this.group_session.players.forEach((item, index) => {
      if (item.status === "alive") {
        item.target = {
          index: -1,
          value: 1
        };
        item.message = "";
        item.attacked = false;
        item.healed = false;
        item.targetVoteIndex = -1;
        item.vampireBited = false;
        item.visitors = [];
        item.blocked = false;
        item.attackers = [];
        item.intercepted = false;
        item.addonMessage = "";

        //special role (vampire)
        if (item.role.team === "vampire") {
          item.role.age++;
        }

        if (item.role.name === "vigilante") {
          if (this.group_session.nightCounter > 1 && item.role.isLoadBullet) {
            item.role.isLoadBullet = false;
          }
        }
      }
    });

    /// untuk role yang berubah-berubah

    // to werewolf
    this.checkMorphingRole("werewolf-cub", "werewolf", "werewolf");

    // to werewolf cub
    this.checkMorphingRole("consort", "werewolf-cub", "werewolf-cub");
    this.checkMorphingRole("sorcerer", "werewolf-cub", "werewolf-cub");

    // vampire hunter to vigi
    this.checkMorphingRole("vampire-hunter", "vampire", "vigilante");

    let alivePlayersCount = this.getAlivePlayersCount();
    this.group_session.time_default = this.getTimeDefault(alivePlayersCount);
    this.group_session.time = this.group_session.time_default;

    //tell available role
    let announcement = "";
    if (this.group_session.players.length > 6) {
      let roles = this.group_session.roles;
      announcement += "📣 Role yang ada di game ini : ";
      announcement += roles.join(", ") + "\n\n";
    }

    announcement +=
      "💡 Jangan lupa ketik '/role' di pc bot untuk menggunakan skill" + "\n\n";

    if (this.group_session.nightCounter === 1) {
      const firstDayNaration = require("/app/message/firstDay");
      announcement += firstDayNaration + "\n\n";
    } else {
      announcement +=
        "🏘️ 🛏️ Setiap warga kembali kerumah masing-masing" + "\n\n";
    }

    announcement +=
      "⏳ Waktu yang diberikan " + this.group_session.time_default + " detik";

    let newFlex_text = this.getNightStateFlex(announcement);

    this.runTimer();

    if (flex_texts) {
      return this.replyFlex(flex_texts, null, newFlex_text);
    } else {
      return this.replyFlex(newFlex_text);
    }
  },

  checkCommand: function() {
    let state = this.group_session.state;
    let time = this.group_session.time;
    let name = this.user_session.name;

    if (state !== "idle" && state !== "new") {
      if (this.indexOfPlayer() === -1) {
        let text = "💡 " + name + ", kamu belum join kedalam game";
        return this.replyText(text);
      }

      if (time > 0) {
        if (this.group_session.checkChance === 0) {
          return Promise.resolve(null);
        } else {
          this.group_session.checkChance--;
        }
      }
    }

    console.log("state sebelumnya : " + state);

    switch (state) {
      case "night":
        if (time > 0) {
          let remindText =
            "⏳ Sisa waktu " + time + " detik lagi untuk menyambut mentari. ";
          remindText +=
            "💡 Kesempatan check : " + this.group_session.checkChance;
          return this.replyText(remindText);
        } else {
          return this.day();
        }
        break;

      case "day":
        return this.votingCommand();

      case "vote":
        if (time > 0) {
          //munculin button player-player sama kasih tau waktu tersisa berapa detik
          return this.votingCommand();
        } else {
          return this.autoVote();
        }
        break;

      case "lynch":
        if (time === 0) {
          return this.postLynch();
        }
        break;

      case "new":
        let text = "⏳ " + name + ", sisa waktu ";
        if (time > 90) {
          let minute = Math.round(time / 60);
          text += minute + " menit lagi ";
        } else {
          text += time + " detik lagi ";
        }
        text += "untuk memulai game";
        return this.replyText(text);

      default:
        return this.replyText(
          "💡 " + name + ", belum ada game yang dibuat, ketik '/new'"
        );
    }
  },

  autoVote: function() {
    let players = this.group_session.players;
    let voteNeeded = Math.round(this.getAlivePlayersCount() / 2);

    let headerText = "";
    let text = "";
    let flex_text = {
      header: {
        text: ""
      },
      body: {
        text: ""
      }
    };

    this.group_session.players.forEach(item => {
      if (item.status === "alive") {
        if (item.targetVoteIndex === -1) {
          item.afkCounter++;
        } else {
          item.afkCounter = 0;
        }
      }
    });

    if (!this.proceedVote(voteNeeded)) {
      headerText = "📣 Penghukuman ditunda";
      text =
        "💬 Waktu habis dan warga belum menentukan siapa yang akan di" +
        this.group_session.punishment;
    } else {
      headerText = "📣 Voting";
    }

    let alivePlayers = this.getAlivePlayers();
    let playerListFlex = this.getTableFlex(alivePlayers, null, headerText);

    if (!this.proceedVote(voteNeeded)) {
      this.group_session.state = "lynch";
      this.group_session.time = 8;
      this.resetCheckChance();

      flex_text.header.text = headerText;
      flex_text.body.text = text;
      return this.replyFlex([flex_text, playerListFlex]);
    } else {
      flex_text.header.text = headerText;
      return this.lynch([flex_text, playerListFlex]);
    }
  },

  day: function() {
    /// BUAT MASING" SYSTEM UNTUK DAY FUNC
    let flex_texts = [];
    this.group_session.state = "day";
    let players = this.group_session.players;

    this.group_session.players.forEach(item => {
      if (item.status === "alive") {
        // reset alive player message
        if (item.message) {
          item.message = "";
        }

        // check afk
        let noSkillRoles = ["villager", "tanner"];
        if (!noSkillRoles.includes(item.role.name)) {
          if (item.target.index === -1) {
            item.afkCounter++;
          } else {
            item.afkCounter = 0;
          }
        }
      }
    });

    let allAnnouncement = "";
    let vampireAnnouncement = "";
    let werewolfAnnouncement = "";
    // emoji 🐺 💉 🔮 🤵 🚬

    /// Veteran targetIndexes
    let veteranTargetIndexes = [];

    /// Doctor Index
    let doctorIndex = -1;

    /// vigilante check existences
    let vigilanteExists = this.checkExistsRole("vigilante");

    /// Vampire Action
    // search the vampire that responsible to bite
    // note: the youngest
    let vampireExists = this.checkExistsRole("vampire");
    let vampires = [];
    let vampireDoerIndex = -1;

    if (vampireExists) {
      players.forEach((item, index) => {
        if (item.role.team === "vampire" && item.status === "alive") {
          let vampire = {
            index: index,
            age: item.role.age
          };
          vampires.push(vampire);
        }
      });

      let tmp = vampires[0].age;
      vampireDoerIndex = vampires[0].index;

      for (let i = 0; i < vampires.length; i++) {
        if (vampires[i].age < tmp) {
          tmp = vampires[i].age;
          vampireDoerIndex = vampires[i].index;
        }
      }

      let vampireCandidates = [];
      players.forEach(item => {
        if (
          item.role.name === "vampire" &&
          item.status === "alive" &&
          item.target.index !== -1
        ) {
          vampireCandidates.push(item.target.index);
          if (item.target.value > 1) {
            vampireCandidates.push(item.target.index);
          }
        }
      });

      if (vampireCandidates.length > 0) {
        let vampireChosenTarget = helper.getMostFrequent(vampireCandidates);

        if (vampireCandidates.length === 1) {
          vampireChosenTarget = {
            index: vampireCandidates[0]
          };
        } else {
          if (vampireChosenTarget.index === undefined) {
            helper.shuffleArray(vampireCandidates);
            vampireChosenTarget = {
              index: vampireCandidates[0]
            };
            vampireAnnouncement +=
              "Para Vampire memiliki target yang berbeda, sehingga random pilih" +
              "\n";
          }
        }

        this.group_session.players[vampireDoerIndex].target.index =
          vampireChosenTarget.index;
      } else {
        this.group_session.players[vampireDoerIndex].target.index = -1;
      }
    }

    /// Werewolf Action
    // search the werewolf that responsible to bite
    // note: the werewolf-cub if possible, if there is none, werewolf itself
    let werewolfKillingExists =
      this.checkExistsRole("werewolf") || this.checkExistsRole("werewolf-cub");
    let werewolfDoerIndex = -1;

    // ini biasa werewolf langsung, soalnya bisa aja ww-cub di block / MATI
    let werewolfDoerBackupIndex = -1;

    // isUseSkill for ww
    let isMainWerewolfUseSkill = false;
    let isBackupWerewolfUseSkill = false;

    if (werewolfKillingExists) {
      for (let i = 0; i < players.length; i++) {
        let doer = players[i];
        let status = doer.status;
        let roleName = doer.role.name;
        if (roleName === "werewolf-cub" && status === "alive") {
          werewolfDoerIndex = i;
          if (doer.target.index !== -1) {
            isMainWerewolfUseSkill = true;
          }
          break;
        }
      }

      for (let i = 0; i < players.length; i++) {
        let doer = players[i];
        let status = doer.status;
        let roleName = doer.role.name;
        if (roleName === "werewolf" && status === "alive") {
          werewolfDoerBackupIndex = i;
          if (doer.target.index !== -1) {
            isBackupWerewolfUseSkill = true;
          }
          break;
        }
      }

      // check skill nya dipake atau engga
      if (isBackupWerewolfUseSkill && werewolfDoerIndex === -1) {
        werewolfDoerIndex = werewolfDoerBackupIndex;
      }

      if (!isMainWerewolfUseSkill && !isBackupWerewolfUseSkill) {
        for (let i = 0; i < players.length; i++) {
          let doer = players[i];
          let roleName = doer.role.name;
          if (roleName === "werewolf-cub" || roleName === "werewolf") {
            this.group_session.players[i].message +=
              "💡 Kamu tidak menggunakan skill mu" + "\n\n";
          }
        }
      } else {
        let werewolfCandidates = [];
        players.forEach(item => {
          if (
            item.status === "alive" &&
            (item.role.name === "werewolf" ||
              item.role.name === "werewolf-cub") &&
            item.target.index !== -1
          ) {
            werewolfCandidates.push(item.target.index);
            if (item.target.value > 1) {
              werewolfCandidates.push(item.target.index);
            }
          }
        });

        if (werewolfCandidates.length > 0) {
          let werewolfChosenTarget = helper.getMostFrequent(werewolfCandidates);

          if (werewolfCandidates.length === 1) {
            werewolfChosenTarget = {
              index: werewolfCandidates[0]
            };
          } else {
            if (werewolfChosenTarget.index === undefined) {
              helper.shuffleArray(werewolfCandidates);
              werewolfChosenTarget = {
                index: werewolfCandidates[0]
              };
              werewolfAnnouncement +=
                "Para Werewolf memiliki target yang berbeda, sehingga random pilih" +
                "\n";
            }
          }

          this.group_session.players[werewolfDoerIndex].target.index =
            werewolfChosenTarget.index;

          let doer = players[werewolfDoerIndex];
          let target = players[werewolfChosenTarget.index];
          werewolfAnnouncement +=
            "🐺 Target Werewolf adalah : " + target.name + "\n\n";
        }
      }
    }

    /// Escort Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "escort" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            if (target.role.name === "serial-killer") {
              this.group_session.players[i].message +=
                "💡 Target kamu immune!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang berusaha role block kamu!" + "\n\n";

              this.group_session.players[targetIndex].intercepted = true;

              this.group_session.players[targetIndex].target.index = i;
            } else if (
              target.role.name === "consort" ||
              target.role.name === "veteran"
            ) {
              this.group_session.players[i].message +=
                "💡 Target kamu immune!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang berusaha role block kamu!" + "\n\n";
            } else {
              this.group_session.players[targetIndex].blocked = true;

              /// langsung kasih pesannya aja
              if (targetIndex === werewolfDoerIndex) {
                if (isBackupWerewolfUseSkill) {
                  this.group_session.players[werewolfDoerIndex].message +=
                    "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
                    "\n\n";
                }
              }
            }
          }
        }
      }
    }

    /// Consort Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "consort" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            if (target.role.name === "serial-killer") {
              this.group_session.players[i].message +=
                "💡 Target kamu immune!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang berusaha role block kamu!" + "\n\n";

              this.group_session.players[targetIndex].intercepted = true;

              this.group_session.players[targetIndex].target.index = i;
            } else if (
              target.role.name === "escort" ||
              target.role.name === "veteran"
            ) {
              this.group_session.players[i].message +=
                "💡 Target kamu immune!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "💡 Ada yang berusaha role block kamu!" + "\n\n";
            } else {
              this.group_session.players[targetIndex].blocked = true;

              /// langsung kasih pesannya aja
              if (targetIndex === werewolfDoerIndex) {
                if (isBackupWerewolfUseSkill) {
                  this.group_session.players[werewolfDoerIndex].message +=
                    "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
                    "\n\n";
                }
              }
            }
          }
        }
      }
    }

    /// Werewolf blocking checker
    if (isMainWerewolfUseSkill || isBackupWerewolfUseSkill) {
      let wasWerewolfDoer = players[werewolfDoerIndex];
      if (wasWerewolfDoer.blocked) {
        let pastTargetIndex = wasWerewolfDoer.target.index;
        let pastTarget = players[pastTargetIndex];

        if (isBackupWerewolfUseSkill && werewolfDoerBackupIndex !== -1) {
          werewolfDoerIndex = werewolfDoerBackupIndex;
          this.group_session.players[
            werewolfDoerIndex
          ].target.index = pastTargetIndex;
        }
      }
    }

    /// Vampire Action
    for (let i = 0; i < players.length; i++) {
      if (vampireDoerIndex === i) {
        let doer = players[i];
        let roleName = doer.role.name;
        let status = doer.status;
        let targetIndex = doer.target.index;

        if (
          roleName === "vampire" &&
          status === "alive" &&
          targetIndex !== -1
        ) {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            break;
          } else if (!doer.attacked) {
            let target = players[targetIndex];

            // hax for check if the target was veteran
            if (target.role.name === "veteran" && target.target.index !== -1) {
              break;
            }

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            vampireAnnouncement +=
              "🧛 Target Vampire adalah : " + target.name + "\n\n";

            // hax for vampire if it only one vampire
            if (vampires.length === 1) {
              this.group_session.players[i].message +=
                "👣 Kamu ke rumah " + target.name + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "👣 Kamu disuruh ke rumah " + target.name + "\n\n";
            }

            vampireAnnouncement +=
              "👣 " + doer.name + " mengunjungi rumah " + target.name + "\n\n";

            this.group_session.players[targetIndex].message +=
              "🧛 Kamu didatangi Vampire!" + "\n\n";

            let targetRoleName = target.role.name;
            let targetRoleTeam = target.role.team;

            let immuneToVampireBite = [
              "werewolf",
              "vampire-hunter",
              "serial-killer",
              "arsonist"
            ];

            let canAttacked = ["werewolf-cub", "sorcerer", "consort"];

            if (canAttacked.includes(targetRoleName)) {
              this.group_session.players[i].message +=
                "💡 Kamu menyerang " + target.name + "\n\n";

              this.group_session.players[targetIndex].message +=
                "🧛 Kamu diserang " + doer.role.name + "!" + "\n\n";

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
                index: i,
                name: doer.name,
                role: doer.role,
                deathNote: doer.deathNote
              };

              this.group_session.players[targetIndex].attackers.push(attacker);
            } else if (immuneToVampireBite.includes(targetRoleName)) {
              this.group_session.players[i].message +=
                "💡 Target kamu kebal dari gigitan!" + "\n\n";

              if (targetRoleName === "vampire-hunter") {
                this.group_session.players[targetIndex].intercepted = true;

                this.group_session.players[targetIndex].target.index = i;
              }
            } else {
              this.group_session.players[i].message +=
                "💡 Kamu gigit " + target.name + "\n\n";
              this.group_session.players[targetIndex].vampireBited = true;
            }

            break;
          }
        }
      }
    }

    /// Veteran Visitor fetch
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.status === "alive" && doer.target.index !== -1) {
        if (parseInt(doer.target.index) !== parseInt(i)) {
          let targetIndex = doer.target.index;
          let target = players[targetIndex];

          if (doer.blocked) {
            continue;
          }

          if (target.role.name === "veteran") {
            if (doer.role.name === "werewolf") {
              if (werewolfDoerIndex !== i) {
                continue;
              }
            }

            veteranTargetIndexes.push({
              index: i,
              isVisitor: true
            });
          }
        }
      }
    }

    /// Veteran Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let roleName = doer.role.name;
      let status = doer.status;
      let isUseSkill = false;
      if (doer.target.index !== -1) {
        isUseSkill = true;
      }

      if (roleName === "veteran" && status === "alive") {
        if (!isUseSkill) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          break;
        } else {
          let targetIndexes = veteranTargetIndexes;

          this.group_session.players[i].role.alert--;

          for (let u = 0; u < targetIndexes.length; u++) {
            let targetIndex = targetIndexes[u].index;
            let target = players[targetIndex];
            let targetRoleName = target.role.name;
            let isVisitor = targetIndexes[u].isVisitor;

            if (isVisitor) {
              this.group_session.players[i].message +=
                "💡 Ada yang datang mengunjungi kamu!" + "\n\n";

              if (targetRoleName !== "escort" || targetRoleName !== "consort") {
                this.group_session.players[targetIndex].message +=
                  "👣 Kamu ke rumah " + doer.name + "\n\n";

                let visitor = {
                  name: target.name,
                  role: target.role
                };
                this.group_session.players[i].visitors.push(visitor);
              }
            }

            this.group_session.players[targetIndex].message +=
              "💥 Kamu diserang " + roleName + " yang kamu kunjungi!" + "\n\n";

            this.group_session.players[targetIndex].attacked = true;

            let attacker = {
              index: i,
              name: doer.name,
              role: doer.role,
              deathNote: doer.deathNote
            };

            this.group_session.players[targetIndex].attackers.push(attacker);
          }

          break;
        }
      }
    }

    /// Arsonist Douse Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let roleName = doer.role.name;
      let status = doer.status;
      let targetIndex = doer.target.index;

      if (roleName === "arsonist" && status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else if (parseInt(targetIndex) !== parseInt(i)) {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let target = players[targetIndex];

            this.group_session.players[targetIndex].doused = true;

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "⛽ Kamu diam diam menyiram gas ke rumah " + target.name + "\n\n";
          }
        }
      }
    }

    /// Retributionist Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "retributionist" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].role.revive--;

            this.group_session.players[targetIndex].status = "alive";
            this.group_session.players[targetIndex].attacked = false;
            this.group_session.players[targetIndex].attackers = [];
            this.group_session.players[targetIndex].vampireBited = false;
            this.group_session.players[targetIndex].message = "";
            this.group_session.players[targetIndex].healed = false;
            this.group_session.players[targetIndex].visitors = [];
            this.group_session.players[targetIndex].blocked = false;
            this.group_session.players[targetIndex].targetVoteIndex = -1;
            this.group_session.players[targetIndex].intercepted = false;
            this.group_session.players[targetIndex].target = {
              index: -1,
              value: 1
            };
            this.group_session.players[targetIndex].willSuicide = false;

            this.group_session.players[i].message +=
              "⚰️ Kamu berhasil membangkitkan " +
              target.name +
              " (" +
              target.role.name +
              ")" +
              "\n\n";

            this.group_session.players[targetIndex].message +=
              "⚰️ Kamu berhasil dibangkitkan Retributionist!" + "\n\n";

            allAnnouncement +=
              "⚰️ " +
              target.name +
              " (" +
              target.role.name +
              ") bangkit dari kematian!" +
              "\n\n";
          }
        }
      }
    }

    /// Doctor Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "doctor" && doer.status === "alive") {
        doctorIndex = i;

        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          break;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            break;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];
            let targetName = target.name;

            if (parseInt(targetIndex) === parseInt(i)) {
              targetName = "diri sendiri";

              this.group_session.players[i].message +=
                "🏠 Kamu memilih diam di rumah dan jaga-jaga" + "\n\n";

              this.group_session.players[i].role.selfHeal--;
            } else {
              let visitor = {
                name: doer.name,
                role: doer.role
              };

              this.group_session.players[targetIndex].visitors.push(visitor);

              this.group_session.players[i].message +=
                "👣 Kamu ke rumah " + target.name + "\n\n";
            }

            this.group_session.players[targetIndex].healed = true;
          }

          break;
        }
      }
    }

    /// Vampire hunter Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "vampire-hunter" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            if (doer.intercepted) {
              this.group_session.players[i].message +=
                "💡 Kamu tercegat oleh " + target.role.name + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "👣 Kamu ke rumah " + target.name + "\n\n";

              let visitor = {
                name: doer.name,
                role: doer.role
              };
              this.group_session.players[targetIndex].visitors.push(visitor);
            }

            if (target.role.team === "vampire") {
              this.group_session.players[i].message +=
                "🗡️ " + target.name + " adalah seorang Vampire!" + "\n\n";

              this.group_session.players[targetIndex].message +=
                "🗡️ Kamu diserang " + doer.role.name + "!" + "\n\n";

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
                index: i,
                name: doer.name,
                role: doer.role,
                deathNote: doer.deathNote
              };

              this.group_session.players[targetIndex].attackers.push(attacker);
            } else {
              this.group_session.players[i].message +=
                "💡 " + target.name + " bukan seorang Vampire" + "\n\n";
            }
          }
        }
      }
    }

    /// Vigilante Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "vigilante" && doer.status === "alive") {
        if (doer.willSuicide) {
          continue;
        }

        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            this.group_session.players[i].role.bullet--;

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            let immuneToBasicAttack = ["serial-killer", "arsonist", "werewolf"];

            if (immuneToBasicAttack.includes(target.role.name)) {
              this.group_session.players[i].message +=
                "💡 Target kamu immune dari serangan!" + "\n\n";
              this.group_session.players[targetIndex].message +=
                "💡 Ada yang menyerang kamu tapi kamu immune dari serangan!" +
                "\n\n";
            } else {
              this.group_session.players[i].message +=
                "💡 Kamu menyerang " + target.name + "\n\n";

              this.group_session.players[targetIndex].message +=
                "🔫 Kamu diserang " + doer.role.name + "!" + "\n\n";

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
                index: i,
                name: doer.name,
                role: doer.role,
                deathNote: doer.deathNote
              };

              this.group_session.players[targetIndex].attackers.push(attacker);
            }
          }
        }
      }
    }

    /// Serial Killer Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "serial-killer" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (!doer.attacked) {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            if (doer.intercepted) {
              this.group_session.players[i].message +=
                "💡 Kamu tercegat oleh " + target.name + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "👣 Kamu ke rumah " + target.name + "\n\n";

              let visitor = {
                name: doer.name,
                role: doer.role
              };
              this.group_session.players[targetIndex].visitors.push(visitor);
            }

            let immuneToBasicAttack = ["serial-killer", "arsonist", "werewolf"];

            if (immuneToBasicAttack.includes(target.role.name)) {
              this.group_session.players[i].message +=
                "💡 Target kamu immune dari serangan!" + "\n\n";
              this.group_session.players[targetIndex].message +=
                "💡 Ada yang menyerang kamu tapi kamu immune dari serangan!" +
                "\n\n";
            } else {
              this.group_session.players[i].message +=
                "💡 Kamu menyerang " + target.name + "\n\n";

              if (doer.intercepted) {
                this.group_session.players[targetIndex].message +=
                  "🔪 Kamu diserang " +
                  doer.role.name +
                  " yang kamu kunjungi!" +
                  "\n\n";
              } else {
                this.group_session.players[targetIndex].message +=
                  "🔪 Kamu diserang " + doer.role.name + "!" + "\n\n";
              }

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
                index: i,
                name: doer.name,
                role: doer.role,
                deathNote: doer.deathNote
              };

              this.group_session.players[targetIndex].attackers.push(attacker);
            }
          }
        }
      }
    }

    /// Arsonist Ignite Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];
      let roleName = doer.role.name;
      let status = doer.status;
      let targetIndex = doer.target.index;

      if (roleName === "arsonist" && status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else if (parseInt(targetIndex) === parseInt(i)) {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else if (!doer.attacked) {
            let targetIndexes = players.map((p, idx) => {
              if (p.doused && p.status === "alive") {
                return idx;
              }
            });

            for (let u = 0; u < targetIndexes.length; u++) {
              let targetIndex = targetIndexes[u];

              if (targetIndex === undefined) {
                continue;
              }

              let target = players[targetIndex];

              this.group_session.players[i].message +=
                "💡 Kamu bakar rumah " + target.name + "\n\n";

              this.group_session.players[targetIndex].message +=
                "🔥 Rumah kamu dibakar " + doer.role.name + "!" + "\n\n";

              this.group_session.players[targetIndex].burned = true;

              this.group_session.players[targetIndex].attacked = true;

              let attacker = {
                index: i,
                name: doer.name,
                role: doer.role,
                deathNote: doer.deathNote
              };

              this.group_session.players[targetIndex].attackers.push(attacker);
            }
          }
        }
      }
    }

    /// Werewolf Killing Action
    if (isMainWerewolfUseSkill || isBackupWerewolfUseSkill) {
      let wasWerewolfDoer = players[werewolfDoerIndex];
      if (wasWerewolfDoer.attacked) {
        let pastTargetIndex = wasWerewolfDoer.target.index;
        let pastTarget = players[pastTargetIndex];

        if (pastTarget && pastTarget.role.name !== "veteran") {
          if (isBackupWerewolfUseSkill && werewolfDoerBackupIndex !== -1) {
            werewolfDoerIndex = werewolfDoerBackupIndex;
            this.group_session.players[
              werewolfDoerIndex
            ].target.index = pastTargetIndex;
          }
        }
      }

      for (let i = 0; i < players.length; i++) {
        if (werewolfDoerIndex === i) {
          let doer = players[i];
          let status = doer.status;
          let targetIndex = doer.target.index;

          if (status === "alive" && targetIndex !== -1) {
            if (doer.blocked === true) {
              this.group_session.players[i].message +=
                "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
                "\n\n";

              break;
            } else if (!doer.attacked) {
              let target = players[targetIndex];

              let visitor = {
                name: doer.name,
                role: doer.role
              };
              this.group_session.players[targetIndex].visitors.push(visitor);

              if (doer.role.name === "werewolf") {
                this.group_session.players[i].message +=
                  "👣 Kamu ke rumah " + target.name + "\n\n";
              } else {
                this.group_session.players[i].message +=
                  "👣 Kamu disuruh ke rumah " + target.name + "\n\n";
              }

              werewolfAnnouncement +=
                "👣 " +
                doer.name +
                " mengunjungi rumah " +
                target.name +
                "\n\n";

              let immuneToBasicAttack = ["serial-killer", "arsonist"];

              if (immuneToBasicAttack.includes(target.role.name)) {
                this.group_session.players[i].message +=
                  "💡 Target kamu immune dari serangan!" + "\n\n";
                this.group_session.players[targetIndex].message +=
                  "💡 Ada yang menyerang kamu tapi kamu immune dari serangan!" +
                  "\n\n";
              } else {
                this.group_session.players[i].message +=
                  "💡 Kamu menyerang " + target.name + "\n\n";

                this.group_session.players[targetIndex].message +=
                  "🐺 Kamu diserang " + doer.role.team + "!" + "\n\n";

                this.group_session.players[targetIndex].attacked = true;

                let attacker = {
                  index: i,
                  name: doer.name,
                  role: doer.role,
                  deathNote: doer.deathNote
                };

                this.group_session.players[targetIndex].attackers.push(
                  attacker
                );
              }

              break;
            }
          }
        }
      }
    }

    /// Death Action
    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "alive") {
        let isAttacked = players[i].attacked;
        let isVampireBited = players[i].vampireBited;
        let isHealed = players[i].healed;
        let attackerLength = players[i].attackers.length;
        let isBurned = players[i].burned;

        if (isAttacked || isVampireBited) {
          if (isHealed) {
            this.group_session.players[i].message +=
              "💉 Ada yang datang berusaha menyelamatkanmu!" + "\n\n";

            this.group_session.players[doctorIndex].message +=
              "💡 " + players[i].name + " diserang semalam!" + "\n\n";

            if (attackerLength > 1 || isBurned) {
              this.group_session.players[i].message +=
                "💡 Tetapi nyawa kamu tidak berhasil diselamatkan!" + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "🤕 Nyawa kamu berhasil diselamatkan!" + "\n\n";

              // purge from vampire bite
              if (isVampireBited) {
                this.group_session.players[i].vampireBited = false;
              }

              allAnnouncement +=
                "💉 Dokter semalam berhasil melindungi seseorang!" + "\n\n";
              continue;
            }
          }

          if (!isAttacked) continue;

          this.group_session.players[i].status = "death";

          let attackersRole = players[i].attackers.map(atkr => {
            return atkr.role.name;
          });

          let attackedAnnouncement = attackedMsg.getAttackResponse(
            attackersRole,
            players[i].name,
            false
          );

          allAnnouncement += attackedAnnouncement + "\n";

          allAnnouncement +=
            "✉️ Role nya adalah " + players[i].role.name + "\n\n";

          //Thanks to
          //https://stackoverflow.com/questions/24806772/how-to-skip-over-an-element-in-map/24806827
          let attackersDeathNote = players[i].attackers
            .filter(atkr => {
              if (!atkr.deathNote) {
                return false;
              }
              return true;
            })
            .map((atkr, idx) => {
              let note = atkr.deathNote + "\n\n";

              if (atkr.role.name === "werewolf-cub") {
                note += "- werewolf";
              } else {
                note += "- " + atkr.role.name;
              }

              return note;
            })
            .join("\n\n");

          ///kalau uda ada will note victim, munculin dulu note victim dulu
          let victimName = players[i].name;
          if (attackersDeathNote) {
            let deathFlex_text = {
              header: {
                text: "📝💀 Death Note " + victimName
              },
              body: {
                text: attackersDeathNote
              }
            };

            flex_texts.push(deathFlex_text);
          }
        } else if (players[i].afkCounter >= 6) {
          this.group_session.players[i].status = "death";

          let attackedAnnouncement = attackedMsg.getAttackResponse(
            [],
            players[i].name,
            false,
            true
          );

          allAnnouncement += attackedAnnouncement + "\n";

          allAnnouncement +=
            "✉️ Role nya adalah " + players[i].role.name + "\n\n";
        } else if (players[i].willSuicide) {
          this.group_session.players[i].status = "death";

          let attackedAnnouncement = attackedMsg.getAttackResponse(
            [],
            players[i].name,
            true
          );

          allAnnouncement += attackedAnnouncement + "\n";

          allAnnouncement +=
            "✉️ Role nya adalah " + players[i].role.name + "\n\n";
        }
      }
    }

    /// Sheriff Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "sheriff" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let visitor = {
              name: doer.name,
              role: doer.role
            };

            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let suspiciousList = [
              "werewolf-cub",
              "sorcerer",
              "consort",
              "serial-killer"
            ];

            if (suspiciousList.includes(target.role.name)) {
              this.group_session.players[i].message +=
                "👮 " + target.name + " mencurigakan" + "\n\n";
            } else {
              this.group_session.players[i].message +=
                "👮 Kamu tidak menemukan bukti kesalahan target. Tampaknya " +
                target.name +
                " tidak bersalah" +
                "\n\n";
            }
          }
        }
      }
    }

    /// Seer Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "seer" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let visitor = {
              name: doer.name,
              role: doer.role
            };

            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            this.group_session.players[i].message +=
              "🔮 Role " + target.name + " adalah " + target.role.name + "\n\n";

            this.group_session.players[i].message +=
              "Kamu bisa cek info role dengan ketik '/info " +
              target.role.name +
              "'" +
              "\n\n";
          }
        }
      }
    }

    /// Sorcerer Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "sorcerer" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];

            let visitor = {
              name: doer.name,
              role: doer.role
            };

            this.group_session.players[targetIndex].visitors.push(visitor);

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            this.group_session.players[i].message +=
              "🧙 Role " + target.name + " adalah " + target.role.name + "\n\n";

            // info role kasih tau ke ww announcement atau engga?

            this.group_session.players[i].message +=
              "Kamu bisa cek info role dengan ketik '/info " +
              target.role.name +
              "'" +
              "\n\n";
          }
        }
      }
    }

    /// Lookout Action
    for (let i = 0; i < players.length; i++) {
      let doer = players[i];

      if (doer.role.name === "lookout" && doer.status === "alive") {
        if (doer.target.index === -1) {
          this.group_session.players[i].message +=
            "💡 Kamu tidak menggunakan skill mu" + "\n\n";

          continue;
        } else {
          if (doer.blocked === true) {
            this.group_session.players[i].message +=
              "💡 Kamu di role block! Kamu tidak bisa menggunakan skillmu." +
              "\n\n";

            continue;
          } else {
            let targetIndex = doer.target.index;
            let target = players[targetIndex];
            let targetName = target.name;

            this.group_session.players[i].message +=
              "👣 Kamu ke rumah " + target.name + "\n\n";

            let visitor = {
              name: doer.name,
              role: doer.role
            };
            this.group_session.players[targetIndex].visitors.push(visitor);

            if (target.visitors.length > 1) {
              let targetVisitors = "";
              let visitors = target.visitors.map(v => {
                return v.name;
              });

              for (let i = 0; i < visitors.length; i++) {
                if (visitors[i] === doer.name) {
                  visitors.splice(i, 1);
                }
              }

              targetVisitors = visitors.join(", ");

              this.group_session.players[i].message +=
                "👀 Rumah " +
                players[targetIndex].name +
                " dikunjungi " +
                targetVisitors +
                " semalam" +
                "\n\n";
            } else {
              // pasti ada 1 visitor, yaitu lookout sndiri
              this.group_session.players[i].message +=
                "👀 Rumah " +
                players[targetIndex].name +
                " tidak didatangi siapa siapa" +
                "\n\n";
            }
          }
        }
      }
    }

    /// Vampire convertion Action
    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "alive" && players[i].willSuicide === false) {
        if (players[i].vampireBited === true && players[i].healed === false) {
          let roleData = this.getRoleData("vampire");

          this.group_session.players[i].role = roleData;
          this.group_session.players[i].role.age = 0;

          this.group_session.players[i].message +=
            "🧛 " + "Kamu berhasil diubah menjadi Vampire" + "\n\n";

          vampireAnnouncement +=
            "🧛 " + players[i].name + " berhasil menjadi Vampire!" + "\n\n";

          break;
        }
      }
    }

    /// Post Vigilante check the target
    if (vigilanteExists) {
      for (let i = 0; i < players.length; i++) {
        let doer = players[i];
        if (doer.role.name === "vigilante" && doer.status === "alive") {
          let vigiTargetIndex = doer.target.index;
          if (vigiTargetIndex !== -1) {
            let vigiTarget = players[vigiTargetIndex];

            if (vigiTarget.role.team !== "villager") {
              continue;
            }

            let vigiTargetAttackersIndex = vigiTarget.attackers.map(atkr => {
              return atkr.index;
            });

            if (vigiTargetAttackersIndex.includes(i)) {
              if (vigiTarget.status === "death") {
                this.group_session.players[i].willSuicide = true;
                this.group_session.players[i].message +=
                  "💡 Kamu membunuh warga!" + "\n\n";
              }
            }
          }
        }
      }
    }

    /// untuk announcement certain role
    this.group_session.players.forEach((item, index) => {
      /// Vampire Announcement
      if (item.role.team === "vampire" && item.status === "alive") {
        item.message += vampireAnnouncement;
      }

      /// Werewolf Announcement
      if (item.role.team === "werewolf" && item.status === "alive") {
        item.message += werewolfAnnouncement;
      }

      /// journal , keep this below any special Announcement
      if (item.status === "alive" && item.message !== "") {
        let journal = {
          nightCounter: this.group_session.nightCounter,
          content: item.message.trim()
        };
        item.journals.push(journal);
      }
    });

    if (!allAnnouncement) {
      let peaceText = helper.random(peaceMsg);
      allAnnouncement += peaceText + "\n\n";
    }

    let flex_text = {
      header: {
        text: "⛅ Day"
      },
      body: {
        text: allAnnouncement
      }
    };

    ///check victory
    let someoneWin = this.checkVictory();

    if (someoneWin) {
      flex_texts.unshift(flex_text);
      return this.endGame(flex_texts, someoneWin);
    } else {
      let alivePlayersCount = this.getAlivePlayersCount();
      this.group_session.time_default = this.getTimeDefault(alivePlayersCount);
      this.group_session.time = this.group_session.time_default;

      let timerText =
        "💬 Warga diberi waktu diskusi selama " +
        this.group_session.time_default +
        " detik" +
        "\n";

      timerText += "💀 Siapa yang mau di" + this.group_session.punishment;

      flex_text.body.text += timerText;

      flex_text.body.text +=
        "\n\n" +
        "💡 Pengguna Skill jangan lupa gunakan commands '/news' di pc bot";

      flex_text.footer = {
        buttons: [
          {
            action: "uri",
            label: "✉️ News",
            data: "line://oaMessage/@786pweuq/?/news"
          },
          {
            action: "postback",
            label: "📣 Voting!",
            data: "/check"
          }
        ]
      };

      this.runTimer();

      flex_texts.unshift(flex_text);
      return this.replyFlex(flex_texts);
    }
  },

  votingCommand: function() {
    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    let text = "";
    let pendingMemberText = "";
    let time = this.group_session.time;

    if (this.group_session.state === "day") {
      if (time > 0) {
        let remindText =
          "💡 " + this.user_session.name + ", belum saatnya voting" + "\n";
        remindText +=
          "⏳ Sisa waktu " + time + " detik lagi untuk voting" + "\n";
        remindText += "💡 Kesempatan check : " + this.group_session.checkChance;
        return this.replyText(remindText);
      } else {
        // ini pertama kali votingCommand dipakai
        this.group_session.state = "vote";
        this.group_session.lynched = null;

        this.runTimer();

        let default_time = this.group_session.time_default;
        text += "⏳ Waktu yang diberikan " + default_time + " detik" + "\n";
      }
    }

    let voteNeeded = Math.round(this.getAlivePlayersCount() / 2);
    let voteNeededText = "\n" + "💡 Dibutuhkan " + voteNeeded;
    voteNeededText += " vote untuk " + this.group_session.punishment + " orang";

    let flexBodyText =
      "💀 Pilih siapa yang mau di" + this.group_session.punishment + "\n";
    flexBodyText += text + pendingMemberText + voteNeededText;
    let flex_texts = [];
    let flex_text = {
      header: {
        text: "📣 Voting"
      },
      body: {
        text: flexBodyText
      },
      footer: {
        buttons: []
      }
    };

    let button = {};
    players.forEach((item, index) => {
      if (item.status === "alive") {
        button[index] = {
          action: "postback",
          label: item.name,
          data: "/vote " + index
        };

        flex_text.footer.buttons.push(button[index]);
      }
    });
    flex_texts.push(flex_text);

    let alivePlayers = this.getAlivePlayers();
    let playerListFlex = this.getTableFlex(alivePlayers, null, "📣 Voting");
    flex_texts.push(playerListFlex);

    return this.replyFlex(flex_texts);
  },

  voteCommand: function() {
    if (this.group_session.state !== "vote") {
      return Promise.resolve(null);
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    if (index === -1) {
      let text =
        "💡 " + this.user_session.name + ", kamu belum join kedalam game";
      return this.replyText(text);
    }

    if (players[index].status !== "alive") {
      let text = "💡 " + this.user_session.name + ", kamu sudah mati";
      return this.replyText(text);
    }

    if (!this.args[1]) {
      return this.votingCommand();
    }

    let targetIndex = this.args[1];

    if (parseInt(targetIndex) === parseInt(index)) {
      let text =
        "💡 " + this.user_session.name + ", gak bisa vote diri sendiri";
      return this.replyText(text);
    }

    if (!players[targetIndex]) {
      return this.replyText("💡 " + this.user_session.name + ", invalid vote");
    }

    let text = "☝️ " + this.user_session.name;

    if (players[index].targetVoteIndex !== -1) {
      text += " mengganti vote ke ";
    } else {
      text += " vote ";
    }

    this.group_session.players[index].targetVoteIndex = targetIndex;

    text +=
      players[targetIndex].name + " untuk di" + this.group_session.punishment;

    let voteNeeded = Math.round(this.getAlivePlayersCount() / 2);

    let headerText = "📣 Voting";

    let time = this.group_session.time;

    if (!this.proceedVote(voteNeeded)) {
      let voteFlex = "💡 Ketik '/cek' untuk munculin flex vote. ";

      if (time > 15) {
        voteFlex +=
          "⏳ Waktu tersisa " + this.group_session.time + " detik lagi";
      }

      text += "\n" + voteFlex;
      return this.replyText(text);
    } else {
      let flex_text = {
        header: {
          text: headerText
        },
        body: {
          text: text
        }
      };

      let alivePlayers = this.getAlivePlayers();
      let playerListFlex = this.getTableFlex(alivePlayers, null, headerText);
      return this.lynch([flex_text, playerListFlex]);
    }
  },

  lynch: function(flex_texts) {
    let players = this.group_session.players;
    let lynchTarget = {};
    let candidates = this.getVoteCandidates();
    lynchTarget = helper.getMostFrequent(candidates);
    let roleName = players[lynchTarget.index].role.name;

    this.group_session.players[lynchTarget.index].status = "death";

    let lynchedName = players[lynchTarget.index].name;
    let announcement =
      "💀 Warga memutuskan untuk " + this.group_session.punishment + " ";
    announcement +=
      lynchedName + " dengan jumlah " + lynchTarget.count + " vote";

    announcement +=
      "\n\n" + "✉️ Role nya adalah " + players[lynchTarget.index].role.name;

    if (!flex_texts[0].body) {
      flex_texts[0].body = {
        text: announcement
      };
    } else {
      flex_texts[0].body.text += "\n\n" + announcement;
    }

    this.group_session.state = "lynch";
    this.group_session.lynched = players[lynchTarget.index];
    this.group_session.time = 8;
    this.resetCheckChance();

    return this.replyFlex(flex_texts);
  },

  postLynch: function() {
    let lynched = this.group_session.lynched;
    if (!lynched) {
      return this.night(null);
    } else {
      if (lynched.role.name === "tanner") {
        return this.endGame(null, "tanner");
      }

      let someoneWin = this.checkVictory();
      if (someoneWin) {
        return this.endGame(null, someoneWin);
      } else {
        return this.night(null);
      }
    }
  },

  endGame: function(flex_texts, whoWin) {
    console.log("whoWin: " + whoWin);
    let players = this.group_session.players;

    let emoji = this.getRoleTeamEmoji(whoWin) + " ";

    let newFlex_text = {
      header: {
        text: "🎉 " + emoji + whoWin.toUpperCase() + " win! 🎉"
      },
      footer: {
        buttons: [
          {
            action: "postback",
            label: "main lagii",
            data: "/new"
          }
        ]
      },
      table: {
        header: {
          addon: "Role"
        },
        body: []
      }
    };

    let table_body = {};

    let num = 1;
    players.forEach((item, index) => {
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
            flex: 3,
            wrap: true
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

      if (item.status === "death") {
        table_body[index].contents[2].text += "💀";
      } else {
        table_body[index].contents[2].text += "😃";
      }

      table_body[index].contents[3].text += item.role.name;
      num++;

      newFlex_text.table.body.push(table_body[index]);
    });

    //give point
    players.forEach((item, index) => {
      let roleTeam = item.role.team;
      if (roleTeam === whoWin) {
        this.increaseWinRate(index, roleTeam);
      } else {
        this.decreaseWinRate(index, roleTeam);
      }
    });

    this.group_session.time = 300; // reset to init time
    this.group_session.state = "idle";

    this.resetAllPlayers();

    if (!flex_texts) {
      return this.replyFlex(newFlex_text);
    } else {
      return this.replyFlex(flex_texts, null, newFlex_text);
    }
  },

  commandCommand: function() {
    const rataratasnmFlex = require("/app/message/helps");
    return rataratasnmFlex.receive(
      this.client,
      this.event,
      this.args,
      this.user_session,
      this.group_session
    );
  },

  invalidCommand: function() {
    const invalid = require("/app/message/invalid");
    let text = invalid.getResponse(this.args, this.user_session.name);
    return this.replyText(text);
  },

  /** helper func **/

  resetCheckChance: function() {
    this.group_session.checkChance = 2;
    this.group_session.deadlineCheckChance = 1;
  },

  getVoteCandidates: function() {
    let candidates = [];
    this.group_session.players.forEach(item => {
      if (item.status === "alive" && item.targetVoteIndex !== -1) {
        candidates.push(item.targetVoteIndex);
      }
    });
    return candidates;
  },

  getRoleList: function() {
    let roles = this.group_session.players.map(player => {
      return player.role.name;
    });
    helper.shuffleArray(roles);
    return roles;
  },

  parseToText: function(arr) {
    let text = "";
    arr.forEach(function(item, index) {
      if (index !== 0) {
        //ini untuk tidak parse text command '/command'
        if (index !== 1) {
          text += " ";
        }
        text += item;
      }
    });
    return text;
  },

  createNewPlayer: function(user_session) {
    let newPlayer = {
      id: user_session.id,
      name: user_session.name,
      points: user_session.points,
      villagerStats: user_session.villagerStats,
      werewolfStats: user_session.werewolfStats,
      vampireStats: user_session.vampireStats,
      tannerStats: user_session.tannerStats,
      serialKillerStats: user_session.serialKillerStats,
      arsonistStats: user_session.arsonistStats,
      role: {
        name: "villager"
      },
      status: "alive",
      message: "",
      attacked: false,
      healed: false,
      targetIndex: -1,
      targetVoteIndex: -1,
      afkCounter: 0,
      visitors: [],
      blocked: false,
      attackers: [],
      intercepted: false,
      journals: [],
      deathNote: "",
      willSuicide: false,
      doused: false,
      burned: false
    };
    return newPlayer;
  },

  addPlayer: function(player) {
    this.group_session.players.push(player);
  },

  getGroupId: function() {
    let groupId = "";
    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
    }
    return groupId;
  },

  canSelfTarget: function(roleName) {
    let can = false;

    let cantTargetItSelf = [
      "werewolf",
      "seer",
      "vampire",
      "vampire-hunter",
      "vigilante",
      "escort",
      "serial-killer",
      "retributionist"
    ];

    if (cantTargetItSelf.includes(roleName)) {
      return can;
    } else {
      can = true;
      return can;
    }
  },

  proceedVote: function(voteNeeded) {
    let proceed = false;
    let notVote = this.getNotVotePlayers();
    let players = this.group_session.players;

    if (this.group_session.time === 0 || notVote.length === 0) {
      let candidates = this.getVoteCandidates();

      let lynchTarget = helper.getMostFrequent(candidates);

      if (players[lynchTarget.index] && lynchTarget.count >= voteNeeded) {
        proceed = true;
        return proceed;
      }
    }

    return proceed;
  },

  increaseWinRate: function(index, roleTeam) {
    switch (roleTeam) {
      case "villager":
        this.group_session.players[index].villagerStats.win++;
        break;
      case "werewolf":
        this.group_session.players[index].werewolfStats.win++;
        break;
      case "tanner":
        this.group_session.players[index].tannerStats.win++;
        break;
      case "vampire":
        this.group_session.players[index].vampireStats.win++;
        break;
      case "serial-killer":
        this.group_session.players[index].serialKillerStats.win++;
        break;
      case "arsonist":
        this.group_session.players[index].arsonistStats.win++;
        break;
    }
    this.group_session.players[index].points += 5;
  },

  decreaseWinRate: function(index, roleTeam) {
    switch (roleTeam) {
      case "villager":
        this.group_session.players[index].villagerStats.lose++;
        break;
      case "werewolf":
        this.group_session.players[index].werewolfStats.lose++;
        break;
      case "tanner":
        this.group_session.players[index].tannerStats.lose++;
        break;
      case "vampire":
        this.group_session.players[index].vampireStats.lose++;
        break;
      case "serial-killer":
        this.group_session.players[index].serialKillerStats.lose++;
        break;
      case "arsonist":
        this.group_session.players[index].arsonistStats.lose++;
        break;
    }
    this.group_session.players[index].points += 1;
  },

  getRandomRoleSet: function(playersLength) {
    let roles = [];
    let townNeedCount = Math.round(playersLength / 2) + 1;
    let badNeedCount = playersLength - townNeedCount;

    let teams = helper.getRandomTeams();
    let townTeam = teams.town;

    if (playersLength !== 6) {
      roles = this.getRoleSet(townNeedCount, badNeedCount);
    } else {
      // bad practice, but who cares?
      townTeam.length = townNeedCount;
      townTeam.forEach(item => {
        roles.push(item);
      });
      let badRole = helper.random(["werewolf", "serial-killer"]);
      roles.push(badRole, "tanner");
    }

    roles = helper.shuffleArray(roles);

    console.log(`roles di room ${this.group_session.groupId} : ${roles}`);

    return roles;
  },

  getRoleSet: function(townNeedCount, badNeedCount) {
    /* 
      bisa juga untuk tandain berapa jumlah role yg sudah ditambahkan
      kalau index nya 2, berarti uda 2 role dideploy
      yaitu index 0, sama index 1 
    */
    let roles = [];
    let neutralIndex = 0;
    let werewolfIndex = 0;

    let teams = helper.getRandomTeams();
    let townTeam = teams.town;
    let werewolfTeam = teams.werewolf;
    let neutralTeam = teams.neutral;

    // jumlah ww dibatasin 75% dari badNeedCount Quota
    let werewolfNeedCount = Math.round((75 / 100) * badNeedCount);
    let neutralNeedCount = badNeedCount - werewolfNeedCount;
    let needSheriff = false;

    roles.push("werewolf");

    werewolfNeedCount--;

    /// bad guy generator

    // ww team
    while (werewolfNeedCount) {
      // check apakah ww role sudah habis ato engga
      // kalau habis, randomkan saja
      if (werewolfIndex > werewolfTeam.length - 1) {
        let maxIndex = werewolfTeam.length - 1;
        let randomWerewolfIndex = helper.getRandomInt(0, maxIndex);
        roles.push(neutralTeam[randomWerewolfIndex]);
      } else {
        roles.push(werewolfTeam[werewolfIndex]);
        if (helper.trueOrFalse()) {
          needSheriff = true;
        } else {
          if (!roles.includes("vigilante")) {
            roles.push("vigilante");
            townNeedCount--;
          }
        }
        werewolfIndex++;
      }

      werewolfNeedCount--;
    }

    // neutral team
    while (neutralNeedCount) {
      // check apakah neutral role sudah habis ato engga
      // kalau habis, randomkan saja
      if (neutralIndex > neutralTeam.length - 1) {
        let randomNeutralIndex = helper.getRandomInt(0, neutralTeam.length - 1);
        roles.push(neutralTeam[randomNeutralIndex]);
      } else {
        roles.push(neutralTeam[neutralIndex]);
        if (neutralTeam[neutralIndex] === "vampire") {
          if (!roles.includes("vampire-hunter")) {
            roles.push("vampire-hunter");
            townNeedCount--;
          }
        } else if (neutralTeam[neutralIndex] === "serial-killer") {
          needSheriff = true;
        } else if (neutralTeam[neutralIndex] === "tanner") {
          if (!roles.includes("vigilante")) {
            roles.push("vigilante");
            townNeedCount--;
          }
        }
        neutralIndex++;
      }

      neutralNeedCount--;
    }

    if (needSheriff && !roles.includes("sheriff")) {
      roles.push("sheriff");
      townNeedCount--;
    }

    townTeam.length = townNeedCount;
    townTeam.forEach(item => {
      roles.push(item);
    });

    return roles;
  },

  getTimeDefault: function(playersLength) {
    let time = 0;

    if (playersLength === 3) {
      time = 45;
    } else if (playersLength > 10) {
      time = 100;
    } else {
      // 4 - 9 players logic
      let temp = playersLength;
      while (temp) {
        time += 0.95;
        temp--;
      }
      time = Math.round(time) * 10;
    }

    return time;
  },

  getNightStateFlex: function(text) {
    //set flex
    let flex_text = {
      header: {
        text: "🌙 Malam - " + this.group_session.nightCounter
      },
      body: {
        text: text
      },
      footer: {
        buttons: [
          {
            action: "uri",
            label: "💡 Role",
            data: "line://oaMessage/@786pweuq/?/mr"
          },
          {
            action: "postback",
            label: "💡 Check",
            data: "/check"
          }
        ]
      }
    };

    return flex_text;
  },

  getDayStateFlex: function() {
    let time = this.group_session.time;
    let timerText =
      "💬 Sisa waktu untuk warga diskusi sisa " + time + " detik lagi" + "\n";

    let flex_text = {
      header: {
        text: "☀️ Day"
      },
      body: {
        text: timerText
      },
      footer: {
        buttons: [
          {
            action: "uri",
            label: "✉️ Cek berita",
            data: "line://oaMessage/@786pweuq/?/news"
          },
          {
            action: "postback",
            label: "📣 Voting!",
            data: "/check"
          }
        ]
      }
    };
    return flex_text;
  },

  checkVictory: function() {
    let someoneWin = "";
    let players = this.group_session.players;
    let alivePeople = 0;

    // group
    let villagerCount = 0;
    let werewolfCount = 0;
    let vampireCount = 0;

    // solo
    let neutralsKilling = ["serial-killer", "arsonist"];
    let neutralsKillingCount = 0;

    players.forEach(item => {
      if (item.status === "alive") {
        alivePeople++;
        if (item.role.team === "werewolf") {
          werewolfCount++;
        } else if (item.role.team === "vampire") {
          vampireCount++;
        } else if (item.role.team === "villager") {
          villagerCount++;
        } else if (neutralsKilling.includes(item.role.team)) {
          neutralsKillingCount++;
        }
      }
    });

    // TODO draw condition
    // no plus or minus point
    if (alivePeople === 0) {
      someoneWin = "villager";
    }

    /// werewolf win

    if (werewolfCount > 0) {
      if (villagerCount <= 1 && !vampireCount && !neutralsKillingCount) {
        someoneWin = "werewolf";
      }
    }

    if (werewolfCount > 0) {
      if (!villagerCount && vampireCount <= 1 && !neutralsKillingCount) {
        someoneWin = "werewolf";
      }
    }

    /// Vampire win

    if (vampireCount > 0) {
      if (!werewolfCount && villagerCount <= 1 && !neutralsKillingCount) {
        someoneWin = "vampire";
      }
    }

    /// Villager win

    if (villagerCount > 0) {
      if (!werewolfCount && !vampireCount && !neutralsKillingCount) {
        someoneWin = "villager";
      }
    }

    /// neutralsKilling win
    if (neutralsKillingCount) {
      let neutralKillingRole = [];

      for (let i = 0; i < players.length; i++) {
        if (players[i].status === "alive") {
          if (neutralsKilling.includes(players[i].role.team)) {
            let killingRole = {
              teamName: players[i].role.team,
              priority: 0
            };

            if (players[i].role.team === "arsonist") {
              killingRole.priority = 3;
            } else if (players[i].role.team === "serial-killer") {
              killingRole.priority = 2;
            }

            neutralKillingRole.push(killingRole);
          }
        }
      }

      let otherFactionCount = werewolfCount + vampireCount + villagerCount;

      if (otherFactionCount <= 1 && neutralsKillingCount === 1) {
        someoneWin = neutralKillingRole[0].teamName;
      } else if (!otherFactionCount && neutralsKillingCount === 2) {
        let sortedNeutrals = neutralKillingRole.sort(
          (a, b) => b.priority - a.priority
        );
        someoneWin = sortedNeutrals[0].teamName;
      }
    }

    return someoneWin;
  },

  checkMorphingRole: function(fromMorphRole, triggerRole, toMorphRole) {
    /*
      fromMorphRole, role yang mau di cek, ini yang mau di ubah
      triggerRole, role yang jika tak ada, maka fromMoprhRole menjadi toMorphRole
      toMorphRole, role baru untuk fromMorphRole
    */
    if (this.checkExistsRole(fromMorphRole)) {
      if (!this.checkExistsRole(triggerRole)) {
        let willMorph = this.getPlayerIdByRole(fromMorphRole);
        let index = this.getPlayerIndexById(willMorph);

        let roleData = this.getRoleData(toMorphRole);

        this.group_session.players[index].role = roleData;

        // special role morphing
        if (this.group_session.players[index].role.name === "vigilante") {
          this.group_session.players[index].role.bullet = 1;
        }

        this.group_session.players[index].addonMessage +=
          "💡 Role kamu menjadi " +
          toMorphRole +
          " karena sudah tidak ada " +
          triggerRole;
      }
    }
  },

  getNamesByTeam: function(teamName) {
    let names = [];
    this.group_session.players.forEach((item, index) => {
      if (item.role.team === teamName) {
        names.push(item.name);
      }
    });
    return names.join(", ");
  },

  getRoleData: function(roleName) {
    const roles = require("/app/roles/rolesData");

    let roleData = {};

    for (let i = 0; i < roles.length; i++) {
      if (roleName === roles[i].name) {
        roleData = {
          name: roles[i].name,
          team: roles[i].team,
          description: roles[i].description,
          canKill: roles[i].canKill,
          cmdText: roles[i].cmdText
        };
        return roleData;
      }
    }
  },

  getTableFlex: function(alivePlayers, text, headerText, opt_buttons) {
    let players = this.group_session.players;
    let flex_text = {
      header: {
        text: headerText
      }
    };

    if (text) {
      flex_text.body = {
        text: text + "\n"
      };
    }

    if (opt_buttons) {
      flex_text.footer = {
        buttons: []
      };
      opt_buttons.forEach((item, index) => {
        flex_text.footer.buttons.push(item);
      });
    }

    flex_text.table = {
      header: {
        addon: "Vote"
      },
      body: []
    };

    let table_body = {};

    let num = 1;
    alivePlayers.forEach((voter, index) => {
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
            flex: 2
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
      table_body[index].contents[1].text += voter.name;

      if (voter.targetVoteIndex === -1) {
        table_body[index].contents[2].text += "pending";
        table_body[index].contents[3].text += "-";
      } else {
        table_body[index].contents[2].text += "done";
        table_body[index].contents[3].text +=
          players[voter.targetVoteIndex].name;
      }

      num++;

      flex_text.table.body.push(table_body[index]);
    });

    return flex_text;
  },

  getNotVotePlayers: function() {
    let notVote = [];
    this.group_session.players.forEach(item => {
      if (item.status === "alive" && item.targetVoteIndex === -1) {
        notVote.push(item);
      }
    });
    return notVote;
  },

  getAlivePlayers: function() {
    let alivePlayers = [];
    this.group_session.players.forEach(item => {
      if (item.status === "alive") {
        alivePlayers.push(item);
      }
    });
    return alivePlayers;
  },

  getAlivePlayersCount: function() {
    let count = 0;
    this.group_session.players.forEach(item => {
      if (item.status === "alive") {
        count++;
      }
    });
    return count;
  },

  checkExistsRole: function(roleName) {
    let found = false;
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (
        this.group_session.players[i].role.name === roleName &&
        this.group_session.players[i].status === "alive"
      ) {
        found = true;
        return found;
      }
    }
    return found;
  },

  getPlayerIdByRole: function(roleName) {
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (this.group_session.players[i].role.name === roleName) {
        return this.group_session.players[i].id;
      }
    }
  },

  getPlayerIndexById: function(id) {
    let targetIndex = -1;
    for (let i = 0; i < this.group_session.players.length; i++) {
      if (id === this.group_session.players[i].id) {
        targetIndex = i;
        return targetIndex;
      }
    }
    return targetIndex;
  },

  getPlayerIndexByRole: function(roleName) {
    let targetIndex = -1;
    let players = this.group_session.players;
    for (let i = 0; i < players.length; i++) {
      if (roleName === players[i].role.name && players[i].status === "alive") {
        targetIndex = i;
        return targetIndex;
      }
    }
    return targetIndex;
  },

  cutFromArray: function(array, index) {
    for (let i = index; i < array.length - 1; i++) {
      array[i] = array[parseInt(i) + 1];
    }
    array.pop();
    return array;
  },

  indexOfPlayer: function() {
    let found = -1;
    for (let i in this.group_session.players) {
      if (this.group_session.players[i].id === this.user_session.id) {
        found = i;
      }
    }

    return found;
  },

  runTimer: function() {
    /// set time default
    this.group_session.time = this.group_session.time_default;
    //this.group_session.time = 20;

    this.resetCheckChance();
  },

  getRoleTeamEmoji: function(team) {
    const roles = require("/app/roles/rolesData");
    for (let i = 0; i < roles.length; i++) {
      if (team === roles[i].team) {
        return roles[i].emoji;
      }
    }
  },

  /** message func **/

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

    let state = this.group_session.state;
    let time = this.group_session.time;

    if (state !== "idle" && state !== "new") {
      if (time < 15) {
        let reminder = "💡 ";

        if (time < 1) {
          reminder +=
            "Waktu sudah habis, ketik '/check' untuk lanjutkan proses";
        } else {
          reminder +=
            "Waktu tersisa " +
            time +
            " detik lagi, nanti ketik '/check' untuk lanjutkan proses";
        }

        let reminder_text = {
          type: "text",
          text: reminder
        };

        opt_texts.push(reminder_text);
      }
    }

    const flex = require("/app/message/flex");
    return flex.receive(
      this.client,
      this.event,
      flex_texts,
      opt_texts,
      newFlex_texts
    );
  },

  replyText: function(texts = []) {
    let state = this.group_session.state;
    let time = this.group_session.time;
    texts = Array.isArray(texts) ? texts : [texts];

    return this.client
      .replyMessage(
        this.event.replyToken,
        texts.map(text => ({ type: "text", text: text.trim() }))
      )
      .catch(err => {
        console.log("err di replyText", err.originalError.response.data);
      });
  },

  /** save data func **/

  resetUser: function() {
    const data = require("/app/src/data");
    data.resetUser(this.user_session.id);
  },

  resetAllPlayers: function() {
    const data = require("/app/src/data");
    data.resetAllPlayers(
      this.group_session.players,
      this.group_session.groupId
    );
  }
};
