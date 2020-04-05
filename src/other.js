module.exports = {
  receive: function(client, event) {
    this.client = client;
    this.event = event;

    let groupId = "";
    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
    }

    switch (this.event.type) {
      case "follow":
        return this.followResponse();
      case "join":
        return this.joinResponse(groupId);
      case "leave":
        return this.leaveResponse(groupId);
      case "memberJoined":
        return this.memberJoinedResponse(groupId);
      case "memberLeft":
        return this.memberLeftResponse();
    }
  },

  memberLeftResponse: function() {
    let userId = this.event.left.members[0].userId;
    const data = require("/app/src/data");
    data.handleLeftUser(userId);
  },

  followResponse: function() {
    let flex_text = {
      header: {
        text: "👋 Hai"
      },
      body: {
        text:
          "Thanks udah add bot ini 😃, undang bot ini ke group kamu untuk bermain!\n📚 Untuk bantuan bisa ketik '/help' atau '/cmd'"
      }
    };
    return this.replyFlex(flex_text);
  },

  joinResponse: function(groupId) {
    let flex_text = {
      header: {
        text: "👋 Hai semuaa"
      },
      body: {
        text:
          "Thanks udah undang bot ini 😃, ketik '/help' atau '/cmd' untuk bantuan"
      }
    };
    return this.replyFlex(flex_text);
  },

  leaveResponse: function(groupId) {
    const data = require("/app/src/data");
    data.resetAllUsers(groupId);
  },

  memberJoinedResponse: async function(groupId) {
    let newMemberId = this.event.joined.members[0].userId;
    let text = "👋 Selamat datang ";

    if (this.event.source.type === "group") {
      let profile = await this.client.getGroupMemberProfile(
        groupId,
        newMemberId
      );
      text += profile.displayName;
    } else if (this.event.source.type === "room") {
      let profile = await this.client.getRoomMemberProfile(
        groupId,
        newMemberId
      );
      text += profile.displayName;
    }
    text += ", maen Werewolf yok";

    return this.replyText(text);
  },

  /** message func **/

  replyFlex: function(flex_raws) {
    flex_raws = Array.isArray(flex_raws) ? flex_raws : [flex_raws];
    let flex_texts = flex_raws.map(flex_raw => ({
      header: flex_raw.header,
      body: flex_raw.body,
      footer: flex_raw.footer,
      table: flex_raw.table
    }));

    const flex = require("/app/message/flex");
    return flex.receive(this.client, this.event, flex_texts, [], null);
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
};
