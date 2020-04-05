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
                    "https://66.media.tumblr.com/6a347d8c4e6ba411173f21f0f73a959a/2686ff2305f3cd7f-dd/s540x810/83d76a69c1294c58d5ae7396a3f6790c9613ea78.png",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "1:1",
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
                    "https://66.media.tumblr.com/abc9ee0f2ae34660a248d157fdcd24a1/2686ff2305f3cd7f-a5/s540x810/f240e72f0f3fc9c6d82b52ed92c82da26a30fb76.png",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "1:1",
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
                    "https://66.media.tumblr.com/522d6afb1e458f6338aaca9abae52047/bcf149cc20bc974f-da/s540x810/0b984e2078280560f0218d91b3d6c75e1a8e5c0e.png",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "1:1",
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
                    "https://66.media.tumblr.com/5e47f22488a74050463005529057e9fe/bcf149cc20bc974f-1c/s540x810/1f19b8534aadc5277036fd6e6064ae0c44bd9d7a.png",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "1:1",
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
                    "https://66.media.tumblr.com/04bd760f3cbf6f3a2d9c35af78777aca/2686ff2305f3cd7f-3d/s540x810/27a364aba90566163192bc9438cfa53b2af74093.png",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "1:1",
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
                    "https://66.media.tumblr.com/3797169196c1a8be757d738994d155ec/2686ff2305f3cd7f-a5/s540x810/498c5d81e7bfa979382d5def4182294c48549403.png",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "1:1",
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
                    "https://66.media.tumblr.com/8cbef2c5f6a9230fb403c5f53aa47676/bcf149cc20bc974f-4d/s540x810/bf97a8b79dff216fcb5a964351d8e3259101a8c5.png",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "1:1",
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
                    "https://66.media.tumblr.com/47aa1f8a93811ad9efc97629a7f748db/f89bb7e0de439536-bf/s1280x1920/a1207b159d121f92ca973a5262fb32f668e23842.png",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "1:1",
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
