module.exports = {
  receive: function(client, event, args, user_session, group_session) {
    this.client = client;
    this.event = event;
    this.args = args;
    this.user_session = user_session;
    this.group_session = group_session;
    
    let flex_msg = {
      type: "flex",
      altText: "📣 ada pesan untuk kamu",
      contents: {
        type: "carousel",
        contents: [
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url:
                    "https://66.media.tumblr.com/8b00a8694918e247c3d3102ec9b87f2b/5b390a54ecbda1c1-15/s640x960/368caa4771393c05bb9a57b8d689084f3c446704.png",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "900:650",
                  gravity: "top"
                  }
              ],
              paddingAll: "0px"
            }
          }
        ]
      }
    };

    return this.client
      .replyMessage(this.event.replyToken, flex_msg)
      .catch(err => {
        console.log(JSON.stringify(flex_msg.contents, null, 2));
      });
  }
};
