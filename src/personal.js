const skillText = require("/app/message/skill");
const helper = require("/app/helper");

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

      if (state !== "idle" && state !== "new") {
        if (time < 15) {
          return this.replyText();
        }
      }
      return Promise.resolve(null);
    }

    switch (this.args[0]) {
      case "/role":
        return this.roleCommand();
      case "/announce":
      case "/news":
        return this.announceCommand();
      case "/help":
        return this.helpCommand();
      case "/cmd":
        return this.commandCommand();
      case "/info":
        return this.infoCommand();
      case "/skill":
        return this.targetCommand();
      case "/revoke":
        return this.revokeCommand();
      case "/alert":
        return this.alertCommand();
      case "/rank":
      case "/me":
      case "/stat":
      case "/status":
        return this.statCommand();
      case "/dnote":
      case "/dn":
        return this.deathNoteCommand();
      case "/journal":
      case "/jurnal":
        return this.journalCommand();
      case "/r":
      case "/refresh":
        return this.refreshCommand();
      case "/c":
      case "/chat":
        return this.chatCommand();
      case "/cancel":
        return this.cancelCommand();
      default:
        return this.invalidCommand();
    }
  },

  cancelCommand: function() {
    if (this.group_session.state !== "new") {
      return this.replyText("💡 Game sedang berjalan. ");
    }

    let index = this.indexOfPlayer();

    this.cutFromArray(this.group_session.players, index);

    let text = "💡 Kamu telah meninggalkan game. ";

    if (this.group_session.players.length === 0) {
      this.group_session.state = "idle";
      text += "\n" + "💡 Game di stop karena tidak ada pemain";
    } else {
      if (this.group_session.roomHostId === this.user_session.id) {
        let randomPlayer = helper.random(this.group_session.players);
        this.group_session.roomHostId = randomPlayer.id;
        text +=
          "\n" +
          "👑 " +
          randomPlayer.name +
          " menjadi host baru dalam room ini. ";
      }
    }

    const data = require("/app/src/data");
    data.resetUser(this.user_session.id);

    return this.replyText(text);
  },

  statCommand: function() {
    const stats = require("/app/src/stats");
    stats.receive(this.client, this.event, this.args);
  },

  notIdleCommand: function() {
    let text = "";

    if (this.group_session.state === "new") {
      text +=
        "💡 Perintah " +
        this.args[0] +
        " tidak bisa dilakukan, keluar dari room game ";
      text += "untuk melakukan perintah";
    } else {
      text +=
        "💡 Perintah " +
        this.args[0] +
        " tidak bisa dilakukan, tunggu game yang berjalan selesai";
    }

    return this.replyText(text);
  },

  revokeCommand: function() {
    let state = this.group_session.state;
    if (state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();

    let players = this.group_session.players;

    if (players[index].status !== "alive") {
      return this.replyText(
        "💡 " + this.user_session.name + ", kamu sudah mati"
      );
    }

    if (players[index].target.index === -1) {
      return this.replyText("💡 Kamu belum menggunakan skill");
    }

    this.group_session.players[index].target.index = -1;

    return this.replyText("💡 Kamu batal menggunakan skill");
  },

  deathNoteCommand: function() {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    if (players[index].status === "death") {
      return this.replyText("💡 Kamu sudah mati");
    }

    if (!players[index].role.canKill) {
      return this.replyText("💡 Kamu gak bisa bunuh-bunuh di role ini");
    }

    if (this.args.length < 2) {
      return this.replyText(
        "💡 isi death note dengan '/dnote <kata-kata nya>'"
      );
    }

    if (this.args.length > 60) {
      return this.replyText("💡 Death notenya kepanjangan! Max 60 kata");
    }

    let deathNote = this.parseToText(this.args);
    let text = "";

    this.group_session.players[index].deathNote = deathNote;

    text += "💡 Kamu berhasil membuat 📝 Death Note dengan isi : " + "\n\n";
    text += "'" + deathNote + "'";

    return this.replyText(text);
  },

  targetCommand: function() {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }
    
    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let state = this.group_session.state;

    if (state === "day") {
      return this.replyText("💡 Bukan saatnya menggunakan skill");
    }

    let roleName = players[index].role.name;
    let roleTeam = players[index].role.team;

    let prohibited = ["villager", "tanner", "veteran"];

    if (prohibited.includes(roleName)) {
      return this.replyText("💡 Jangan pernah kau coba untuk");
    }

    if (players[index].status === "death") {
      return this.replyText("💡 Kamu sudah mati");
    }

    if (players[index].willSuicide) {
      return this.replyText(
        "💡 Kamu sudah tak ada semangat menggunakan skill lagi"
      );
    }

    let targetIndex = this.args[1];
    
    if (targetIndex === undefined) {
      return this.roleCommand();
    }

    /// special role with private prop
    if (roleName === "retributionist") {
      if (players[index].role.revive === 0) {
        return this.replyText(
          "💡 Kamu hanya bisa bangkitkan orang mati 1 kali"
        );
      }

      if (players[targetIndex].status === "alive") {
        return this.replyText("💡 Targetmu masih hidup");
      }
    }

    if (roleName === "vigilante") {
      if (players[index].role.bullet === 0) {
        return this.replyText(
          "💡 Kamu sudah tidak memiliki peluru yang tersisa"
        );
      }
    }

    if (parseInt(targetIndex) === parseInt(index)) {
      // hax arsonist want to ignite
      // but check is any doused player
      if (roleName === "arsonist") {
        let dousedCount = 0;
        players.forEach(item => {
          if (item.doused && item.status === "alive") {
            dousedCount++;
          }
        });
        if (!dousedCount) {
          return this.replyText(
            "💡 Kamu belum bisa bakar-bakar, karena belum menyiram bensin ke siapa-siapa. "
          );
        }
      }

      /// role yg limited to self target
      if (roleName === "doctor") {
        if (!players[index].role.selfHeal) {
          return this.replyText(
            "💡 Kamu sudah tidak bisa melindungi diri sendiri"
          );
        }
      }

      if (!this.canSelfTarget(roleName)) {
        return this.replyText(
          "💡 Kamu tidak bisa pilih diri sendiri di role ini"
        );
      }
    }

    //need system for it
    if (roleTeam === "vampire" || roleTeam === "werewolf") {
      if (players[targetIndex].role.team === roleTeam) {
        return this.replyText(
          "💡 Target yang kamu pilih adalah sesama team " + roleTeam
        );
      }
    }

    let text = "";
    let msg = [];
    let broadcastMessage;

    let targetName = players[targetIndex].name;

    if (players[index].target.index === -1) {
      if (targetIndex === index) {
        text = skillText.response(roleName, targetName, null, true);
      } else {
        text = skillText.response(roleName, targetName, null, null);
        broadcastMessage = skillText.response(roleName, targetName, null, null);
      }
    } else {
      if (targetIndex === index) {
        text = skillText.response(roleName, targetName, true, true);
      } else {
        text = skillText.response(roleName, targetName, true, null);
        broadcastMessage = skillText.response(roleName, targetName, true, null);
      }
    }

    this.group_session.players[index].target = {
      index: targetIndex,
      value: 1
    };

    if (roleName === "werewolf") {
      this.group_session.players[index].target.value++;
    }

    /// Special role communication
    if (roleTeam === "werewolf" || roleTeam === "vampire") {
      let chatBox = [];

      let message = {
        name: players[index].name,
        text: "📣 Saya menggunakan skill ke " + targetName
      };

      if (roleTeam === "werewolf") {
        chatBox = this.group_session.werewolfChat;
        this.group_session.werewolfChat.push(message);
      } else if (roleTeam === "vampire") {
        chatBox = this.group_session.vampireChat;
        this.group_session.vampireChat.push(message);
      }
    }

    msg = [text];
    if (players[index].role.canKill && players[index].deathNote === "") {
      msg.push("💡 Kamu belum buat death note, ketik '/dnote' <isi note kamu>");
    }

    return this.replyText(msg);
  },

  roleSkill: function(flex_text, index, text) {
    let players = this.group_session.players;
    let role = players[index].role;
    let skillText = this.getRoleSkillText(role.name);

    let cmdText = this.getRoleCmdText(role.name);
    let canSelfTarget = this.canSelfTarget(role.name);

    flex_text.body.text += "\n\n" + skillText;

    flex_text.footer = {
      buttons: []
    };

    let button = {};
    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "alive") {
        if (!canSelfTarget && parseInt(index) === parseInt(i)) {
          continue;
        }

        button[i] = {
          action: "postback",
          label: players[i].name,
          data: cmdText + " " + i
        };

        flex_text.footer.buttons.push(button[i]);
      }
    }

    if (text) {
      return this.replyFlex(flex_text, text);
    } else {
      return this.replyFlex(flex_text);
    }
  },

  roleCommand: function() {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let player = players[index];
    let state = this.group_session.state;
    let roleName = player.role.name;
    let roleTeam = player.role.team;
    let roleDesc = player.role.description;

    let flex_text = {
      header: {
        text: roleName.toUpperCase()
      },
      body: {
        text: roleDesc
      }
    };

    if (roleTeam === "werewolf" || roleTeam === "vampire") {
      let nightNews =
        "\n\n" + "📣 Yang berada di team " + roleTeam + " : " + "\n";
      nightNews += this.getNamesByTeam(roleTeam) + "\n";
      flex_text.body.text += nightNews;
    }

    if (player.status === "death" || player.willSuicide) {
      return this.replyFlex(flex_text);
    }

    if (state !== "day" && state !== "vote") {
      let text = "";
      /// Special Role Personal chat reminder
      if (roleTeam === "werewolf" || roleTeam === "vampire") {
        text +=
          "💡 Kamu bisa chat sama sesama team dengan cmd '/c <kata-yang ingin disampaikan>'" +
          "\n";
        text += "Gunakan cmd '/r' untuk load chat dari team";
      } else if (roleName === "vampire-hunter") {
        text +=
          "💡 Kamu bisa dengar vampire chat-an, gunakan cmd '/r' secara berkala";
      }

      let noNightSkill = ["villager", "tanner"];

      if (noNightSkill.includes(roleName)) {
        return this.replyFlex(flex_text, text);
      }

      // morphed role message
      if (players[index].addonMessage) {
        text += players[index].addonMessage + "\n";
      }

      /// special role skill
      if (roleName === "retributionist") {
        if (player.role.revive > 0 && this.isSomeoneDeath()) {
          return this.retributionistSkill(flex_text);
        } else {
          return this.replyFlex(flex_text);
        }
      } else if (roleName === "veteran") {
        if (player.role.alert > 0) {
          return this.veteranSkill(flex_text);
        } else {
          return this.replyFlex(flex_text);
        }
      } else if (roleName === "vigilante") {
        if (player.role.isLoadBullet) {
          text += "🧳 Kamu masih menyiapkan senjata mu";
          return this.replyFlex(flex_text, text);
        }
      }

      // special role private role prop reminder
      if (roleName === "doctor") {
        text +=
          "💉 Kamu memiliki " + players[index].role.selfHeal + " self heal";
      } else if (roleName === "vigilante") {
        text += "🔫 Kamu memiliki " + players[index].role.bullet + " peluru";
      }

      return this.roleSkill(flex_text, index, text);
    } else {
      // state yang pagi tapi ga ada skill pagi
      return this.replyFlex(flex_text);
    }
  },

  retributionistSkill: function(flex_text) {
    let skillText = this.getRoleSkillText("retributionist");
    let players = this.group_session.players;
    let cmdText = this.getRoleCmdText("retributionist");

    flex_text.body.text += "\n\n" + skillText;

    flex_text.footer = {
      buttons: []
    };

    let button = {};
    players.forEach((item, index) => {
      if (item.status === "death") {
        button[index] = {
          action: "postback",
          label: item.name,
          data: cmdText + " " + index
        };

        flex_text.footer.buttons.push(button[index]);
      }
    });

    return this.replyFlex(flex_text);
  },

  veteranSkill: function(flex_text) {
    let skillText = this.getRoleSkillText("veteran");
    let players = this.group_session.players;
    let cmdText = this.getRoleCmdText("veteran");
    let index = this.indexOfPlayer();

    flex_text.body.text += "\n\n" + skillText + "\n\n";

    flex_text.body.text += "Alertmu sisa " + players[index].role.alert;

    flex_text.footer = {
      buttons: [
        {
          action: "postback",
          label: "Alert!",
          data: cmdText
        }
      ]
    };

    return this.replyFlex(flex_text);
  },

  alertCommand: function() {
    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let state = this.group_session.state;

    if (state === "day") {
      return this.replyText("💡 Bukan saatnya menggunakan skill");
    }

    let roleName = players[index].role.name;

    if (roleName !== "veteran") {
      return this.replyText("💡 Role mu bukan Veteran");
    }

    if (players[index].status === "death") {
      return this.replyText("💡 Kamu sudah mati");
    }

    if (players[index].willSuicide) {
      return this.replyText(
        "💡 Kamu sudah tak ada semangat menggunakan skill lagi"
      );
    }

    if (players[index].role.alert === 0) {
      return this.replyText("💡 Kamu sudah tidak memiliki alert yang tersisa");
    }

    this.group_session.players[index].target.index = index;

    let text = "";
    let msg = [];

    text = skillText.response(roleName, null, null, true);
    msg = [text];

    if (players[index].role.canKill && players[index].deathNote === "") {
      let dnoteText =
        "💡 Kamu belum buat death note, ketik '/dnote' <isi note kamu>";
      msg.push(dnoteText);
    }

    return this.replyText(msg);
  },

  announceCommand: function() {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    if (this.group_session.state === "night") {
      return this.journalCommand();
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;

    let message = "🛏️ Kamu tidak diganggu semalam";

    if (players[index].message !== "") {
      message = players[index].message;
    }

    let flex_texts = [
      {
        header: {
          text: "🌙 Berita Malam ke - " + this.group_session.nightCounter
        },
        body: {
          text: message
        }
      }
    ];

    if (players[index].status === "alive") {
      flex_texts.push({
        header: {
          text: "📣 Info"
        },
        body: {
          text: "☝️ Kembali ke group chat untuk voting"
        }
      });
    }

    let journals = players[index].journals;

    if (journals.length === 2) {
      return this.replyFlex(
        flex_texts,
        "📓 Kamu bisa cek journal kamu dengan '/jurnal'"
      );
    } else {
      return this.replyFlex(flex_texts);
    }
  },

  journalCommand: function() {
    if (this.group_session.state === "new") {
      return this.replyText("💡 Game belum dimulai");
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let journals = players[index].journals;

    if (journals.length === 0) {
      return this.replyText("💡 Kamu belum memiliki jurnal");
    }

    let flex_texts = [];
    let flex_text = {};

    journals.forEach((item, idx) => {
      flex_text[idx] = {
        header: {
          text: "📓 Malam - " + item.nightCounter
        },
        body: {
          text: item.content
        }
      };
      flex_texts.push(flex_text[idx]);
    });

    return this.replyFlex(flex_texts);
  },

  refreshCommand: function() {
    if (this.group_session.state !== "night") {
      if (this.group_session.state === "new") {
        return this.replyText("💡 Game belum dimulai");
      } else {
        return this.replyText("💡 Belum saatnya chatting");
      }
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let roleName = players[index].role.name;
    let roleTeam = players[index].role.team;

    if (players[index].status === "death") {
      return this.replyText("💡 Kamu sudah mati");
    }

    if (roleTeam !== "werewolf" && roleTeam !== "vampire") {
      if (roleName !== "vampire-hunter") {
        return this.replyText(
          "💡 Team " + roleTeam + " gak ada komunikasi malam"
        );
      }
    }

    let chatBox = [];

    if (roleTeam === "werewolf") {
      chatBox = this.group_session.werewolfChat;
    } else if (roleTeam === "vampire") {
      chatBox = this.group_session.vampireChat;
    } else if (roleName === "vampire-hunter") {
      chatBox = this.group_session.vampireChat.map(v => {
        return { name: "vampire", text: v.text };
      });
    }

    if (chatBox.length === 0) {
      let noChat = "💡 Belum ada chat, ";
      noChat += "ketik '/r' lagi nanti untuk cek lagi";
      return this.replyText(noChat);
    }

    if (roleName === "vampire-hunter") {
      roleTeam = "vampire";
    }

    let text = "💬 " + roleTeam.toUpperCase() + " Chat" + "\n\n";

    chatBox.forEach((item, index) => {
      text += item.name + " : " + item.text + "\n";
    });

    return this.replyText(text);
  },

  chatCommand: function() {
    if (this.group_session.state !== "night") {
      if (this.group_session.state === "new") {
        return this.replyText("💡 Game belum dimulai");
      } else {
        return this.replyText("💡 Belum saatnya chatting");
      }
    }

    let index = this.indexOfPlayer();
    let players = this.group_session.players;
    let roleTeam = players[index].role.team;
    let roleName = players[index].role.name;

    if (roleTeam !== "werewolf" && roleTeam !== "vampire") {
      return this.replyText("💡 " + roleTeam + " gak ada komunikasi malam");
    }

    if (players[index].status === "death") {
      return this.replyText(
        "💡 Sudah mati, gak bisa chat dengan yang beda dunia"
      );
    }

    if (this.args.length < 2) {
      return this.replyText("💡 isi chat kamu dengan '/c <kata-kata nya>'");
    }

    let chatBox = [];

    let message = {
      name: players[index].name,
      text: this.parseToText(this.args)
    };

    if (roleTeam === "werewolf") {
      chatBox = this.group_session.werewolfChat;
      this.group_session.werewolfChat.push(message);
    } else if (roleTeam === "vampire") {
      chatBox = this.group_session.vampireChat;
      this.group_session.vampireChat.push(message);
    }

    if (chatBox.length < 3) {
      return this.replyText("💡 Pesan terkirim! Check chat dengan '/r'");
    }
  },

  infoCommand: function() {
    const roles = require("/app/roles/rolesInfo");
    return roles.receive(this.client, this.event, this.args);
  },

  invalidCommand: function() {
    const invalid = require("/app/message/invalid");
    let text = invalid.getResponse(this.args, this.user_session.name);
    return this.replyText(text);
  },

  helpCommand: function() {
    const helpFlex = require("/app/message/help");
    let state = this.group_session.state;
    let help = helpFlex.getHelp(state);

    let flex_text = {
      header: {
        text: help.headerText
      },
      body: {
        text: help.bodyText
      }
    };

    return this.replyFlex(flex_text);
  },

  commandCommand: function() {
    let text = "";
    let cmds = [
      "/news : cek berita (malam dibunuh siapa, dll)",
      "/role : cek role",
      "/info : list role",
      "/help : bantuan game",
      "/journal : cek journal kamu",
      "/revoke: untuk batal menggunakan skill"
    ];

    cmds.forEach((item, index) => {
      text += "- " + item;
      if (index !== cmds.length - 1) {
        text += "\n";
      }
    });

    let flex_text = {
      header: {
        text: "📚 Daftar Perintah"
      },
      body: {
        text: text
      }
    };
    return this.replyFlex(flex_text);
  },

  /** helper func **/

  canSelfTarget: function(roleName) {
    let can = false;

    let cantTargetItSelf = [
      "werewolf",
      "werewolf-cub",
      "escort",
      "sorcerer",
      "seer",
      "vampire",
      "vampire-hunter",
      "vigilante",
      "escort",
      "serial-killer",
      "retributionist",
      "lookout",
      "sheriff"
    ];

    if (cantTargetItSelf.includes(roleName)) {
      return can;
    } else {
      can = true;
      return can;
    }
  },

  isSomeoneDeath: function() {
    let found = false;
    let players = this.group_session.players;
    for (let i = 0; i < players.length; i++) {
      if (players[i].status === "death") {
        found = true;
        return found;
      }
    }
    return found;
  },

  getNamesByTeam: function(teamName) {
    let names = [];
    this.group_session.players.forEach((item, index) => {
      if (item.status === "alive" && item.role.team === teamName) {
        names.push(item.name);
      }
    });
    return names.join(", ");
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

  getRoleSkillText: function(roleName) {
    const roles = require("/app/roles/rolesData");
    for (let i = 0; i < roles.length; i++) {
      if (roleName === roles[i].name) {
        return roles[i].skillText;
      }
    }
  },

  getRoleCmdText: function(roleName) {
    const roles = require("/app/roles/rolesData");
    for (let i = 0; i < roles.length; i++) {
      if (roleName === roles[i].name) {
        return roles[i].cmdText;
      }
    }
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

  /** message func **/

  /* 
  flex_raws dan newFlexRaws sama aja
  text_raws sama seperti param di replyText func
  */
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
            "Waktu sudah habis, ketik '/check' di group untuk lanjutkan proses";
        } else {
          reminder +=
            "Waktu tersisa " +
            time +
            " detik lagi, nanti ketik '/check' di group untuk lanjutkan proses";
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
    texts = Array.isArray(texts) ? texts : [texts];

    let time = this.group_session.time;
    let state = this.group_session.state;

    if (state !== "new" && state !== "idle") {
      if (time < 15) {
        let reminder = "💡 ";

        if (time < 1) {
          reminder +=
            "Waktu sudah habis, ketik '/check' di group untuk lanjutkan proses";
        } else {
          reminder +=
            "Waktu tersisa " +
            time +
            " detik lagi, nanti ketik '/check' di group untuk lanjutkan proses";
        }

        texts.push(reminder);
      }
    }

    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text: text.trim() }))
    );
  }
};
