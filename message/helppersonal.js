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
                      "https://66.media.tumblr.com/0a44c7c78875bbda3a082817bfebdd72/fe8bf8be36e161a0-15/s540x810/de2f28ebc90b6e6423759c15f51b7c5bffc9f311.png",
                    size: "full",
                    aspectMode: "cover",
                    aspectRatio: "900:438",
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
  