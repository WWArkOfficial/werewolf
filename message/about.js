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
                      "https://66.media.tumblr.com/0812d10ca3eb980375d7d27468f4fd97/c4891b01d71f6ca4-0f/s1280x1920/95a5bd72f35f81905dea9a8c93316875e0088474.png",
                    size: "full",
                    aspectMode: "cover",
                    aspectRatio: "900:517",
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
  