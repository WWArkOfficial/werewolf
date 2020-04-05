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
                      "https://66.media.tumblr.com/c8be9d971c75b58cc8eed71c3800d8ad/bcf149cc20bc974f-56/s540x810/98e7b02bb40846db9b11ebc47d21f15f5e943dac.png",
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
                      "https://66.media.tumblr.com/96a4680b604ebd0ed5aec1db61f22bf9/bcf149cc20bc974f-9f/s540x810/3b96fd00c42123cc53816423b96ee8b4e8741b91.png",
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
                      "https://66.media.tumblr.com/90fc808ea9ba13b61e3f61eda841ae7a/2686ff2305f3cd7f-77/s540x810/157f9b26772e04d63fb60bc45f7a307d697e149c.png",
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
                      "https://66.media.tumblr.com/a1bf91eb9cb2c93775a7785c07a3e6d7/2686ff2305f3cd7f-a9/s540x810/0f6c61d5bb7dbca731d7d3723f8b54a0caade754.png",
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
                      "https://66.media.tumblr.com/13b1fb7efd62edec0e92af9d2316e26a/bcf149cc20bc974f-c6/s540x810/bc95c5847c500bdd58ef74645f570d124a1f016b.png",
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
                      "https://66.media.tumblr.com/8922522d6bb1c6084e108e751855d179/bcf149cc20bc974f-c3/s540x810/027ea8b9450e824163f54265c8597e6b24ad79a4.png",
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
                      "https://66.media.tumblr.com/399c0fb3dea65834b104af29072c98b1/bcf149cc20bc974f-fe/s540x810/ccb5a7f0157ee0d36a2251536562f04f6ca3c5e3.png",
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
                      "https://66.media.tumblr.com/c654aacb5ce5fad12b4f1e41125a4534/bcf149cc20bc974f-3c/s540x810/8134d7b6ce18942f1c5c21180611a3b57ca62cf2.png",
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
                      "https://66.media.tumblr.com/44b167fa6ff11532fa05155cf1c03f22/2686ff2305f3cd7f-b7/s540x810/9c1808cc76fcc35367bf506a8cad82f235e4b195.png",
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
  