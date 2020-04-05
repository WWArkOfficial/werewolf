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
                      "https://66.media.tumblr.com/6dbdce0e76f0fffd84501836e51860a9/fe8bf8be36e161a0-47/s540x810/2a83d0992b20e7fcbc3316f419bf1d3a56c463bd.png",
                    size: "full",
                    aspectMode: "cover",
                    aspectRatio: "900:383",
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
  