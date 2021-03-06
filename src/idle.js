module.exports = {
  receive: function(client, event, args, rawArgs, user_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.rawArgs = rawArgs;
    this.user_session = user_session;

    if (!this.rawArgs.startsWith("/")) {
      return Promise.resolve(null);
    }

    switch (this.args[0]) {
      case "/help":
        return this.helpCommand();
      case "/cmd":
        return this.commandCommand();
      case "/about":
        return this.aboutCommand();
      case "/role1":
      case "/roles1":
        return this.info1Command();
      case "/role2":
      case "/roles2":
        return this.info2Command();
      case "/rank":
      case "/me":
      case "/status":
      case "/stat":
      case "/stats":
      case "/reset":
        return this.statCommand();
      case "/mr":
      case "/news":
      case "/jurnal":
      case "/r":
      case "/c":
      case "/skill":
        return this.notInGameCommand();
      default:
        return this.invalidCommand();
    }
  },

  statCommand: function() {
    const stats = require("/app/src/stats");
    stats.receive(this.client, this.event, this.args);
  },

  notInGameCommand: function() {
    let text = "💡 Kamu tidak ada join kedalam game";
    return this.replyText(text);
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

  commandCommand: function() {
    const rataratasnmFlex = require("/app/message/helpother");
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

  helpCommand: function() {
    const rataratasnmFlex = require("/app/message/helpother");
    return rataratasnmFlex.receive(
      this.client,
      this.event,
      this.args,
      this.user_session,
      this.group_session
    );
  },

  /** message func **/

  replyFlex: function(flex_raws, text_raws) {
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

    const flex = require("/app/message/flex");
    return flex.receive(this.client, this.event, flex_texts, opt_texts);
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
};
