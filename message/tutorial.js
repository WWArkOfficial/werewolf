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
                      "https://66.media.tumblr.com/4dcb721e986330f1ec2a769a74ea2271/3e95744603ffdc10-2d/s1280x1920/d2c36acabfbdbd96fc376e539835be0bc7dd3c56.png",
                    size: "full",
                    aspectMode: "cover",
                    aspectRatio: "1:2",
                    gravity: "top"
                    }
                ],
                paddingAll: "0px"
              }
            },
            {
              type: "bubble",
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "image",
                    url:
                      "https://66.media.tumblr.com/1c2497eaa989b6838734d59d2942cd27/3e95744603ffdc10-be/s1280x1920/6f767f1ef05086ac997015027468378f85a849b2.png",
                    size: "full",
                    aspectMode: "cover",
                    aspectRatio: "1:2",
                    gravity: "top"
                    }
                ],
                paddingAll: "0px"
              }
            },
            {
              type: "bubble",
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "image",
                    url:
                      "https://66.media.tumblr.com/2a7ee9d3896ae87b4694f41ff51df54e/3e95744603ffdc10-f6/s1280x1920/0fd57f666f3aefe2873172aab21752b1c5d4da99.png",
                    size: "full",
                    aspectMode: "cover",
                    aspectRatio: "1:2",
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
  