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
                    "https://66.media.tumblr.com/7d997546ad5e4933f50cbe21c08e8c35/2686ff2305f3cd7f-be/s540x810/dad6f5dc6f973d473277b2adf4a56bb7405faa16.png",
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
                    "https://i.imgur.com/F8c8fXl.png",
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
                    "https://i.imgur.com/TEQhg36.png",
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
                    "https://i.imgur.com/OM2sWaf.png",
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
                    "https://i.imgur.com/nwq6g80.png",
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
                    "https://i.imgur.com/IXa2Coh.png",
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
                    "https://i.imgur.com/LXvqZcM.png",
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
                    "https://i.imgur.com/LXvqZcM.png",
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
                    "https://i.imgur.com/LXvqZcM.png",
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
                    "https://i.imgur.com/LXvqZcM.png",
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
                    "https://i.imgur.com/LXvqZcM.png",
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
                    "https://i.imgur.com/LXvqZcM.png",
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
                    "https://i.imgur.com/LXvqZcM.png",
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
                    "https://i.imgur.com/LXvqZcM.png",
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
                    "https://i.imgur.com/QSGkqD4.png",
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
                    "https://i.imgur.com/SeE7oAG.png",
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
                    "https://i.imgur.com/LXvqZcM.png",
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
                    "https://i.imgur.com/Qy35Fqs.png",
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
