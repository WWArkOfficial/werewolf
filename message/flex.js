const helper = require("/app/helper");

let color = helper.getFlexColor();

module.exports = {
  receive: function(client, event, flex_texts, opt_texts, newFlex_texts, stat) {
    this.client = client;
    this.event = event;

    this.checkFlex(flex_texts, opt_texts, newFlex_texts, stat);
  },

  /*
  let flex_text = {
      header: {
        text: "📣 Voting"
      },
      body: {
        text: ""
      },
      // footer: {
      //   buttons: [
      //     {
      //       action: "postback",
      //       label: "bangun tidur",
      //       data: "/awake"
      //     }
      //   ]
      // },
      // table: {
      //   header: {
      //     addon: "Voting"
      //   },
      //   body: []
      // }
    };
  */

  checkFlex: function(flex_texts, opt_texts, newFlex_texts, stat) {
    //console.log(flex_texts[0]);
    let flex_msg = {
      type: "flex",
      altText: "📣 ada pesan untuk kamu!",
      contents: {
        type: "carousel",
        contents: []
      }
    };

    let bubble = {};

    flex_texts.forEach((item, index) => {
      bubble[index] = {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: item.header.text,
              color: "#ffffff",
              size: "xl",
              weight: "bold",
              style: "normal",
              decoration: "none",
              align: "center",
              wrap: true
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: []
        },
        styles: {
          header: {
            backgroundColor: color.main
          },
          body: {
            backgroundColor: color.background
          },
          footer: {
            backgroundColor: color.background,
            separator: false
          }
        }
      };

      if (item.body) {
        bubble[index].body.contents.push({
          type: "text",
          size: "lg",
          text: item.body.text.trim(),
          wrap: true,
          color: color.text
        });
      }

      if (item.table) {
        //make table
        let table_header = {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "No. ",
              weight: "bold",
              color: color.text
            },
            {
              type: "text",
              text: "Name",
              flex: 3,
              weight: "bold",
              wrap: true,
              color: color.text
            },
            {
              type: "text",
              text: "Status",
              flex: 2,
              weight: "bold",
              align: "center",
              color: color.text
            }
          ]
        };

        if (stat) {
          table_header.contents[2].text = "Points";
        }

        if (item.table.header.addon !== "") {
          table_header.contents.push({
            type: "text",
            text: item.table.header.addon,
            flex: 2,
            align: "center",
            weight: "bold",
            color: color.text
          });
        }

        let separator = {
          type: "separator",
          color: color.secondary,
          margin: "sm"
        };

        bubble[index].body.contents.push(table_header, separator);

        let table_body = item.table.body;

        //iterate data
        table_body.forEach(t => {
          t.contents.forEach(txt => {
            txt.color = color.text;
          });

          //push to contents
          bubble[index].body.contents.push(t);
        });
      }

      if (item.footer && item.footer.buttons.length > 0) {
        bubble[index].footer = {
          type: "box",
          layout: "vertical",
          contents: [],
          spacing: "md"
        };

        let buttons = item.footer.buttons;

        let opt_button = {};
        let data_button = {};

        let temp = 1;

        for (let i = 0; i < buttons.length; i++) {
          opt_button[i] = {
            type: "box",
            layout: "horizontal",
            contents: [],
            spacing: "md"
          };

          data_button[i] = {
            type: "button",
            action: {},
            style: "primary",
            color: color.secondary
          };

          if (buttons[i].action === "postback") {
            data_button[i].action = {
              type: buttons[i].action,
              label: buttons[i].label,
              data: buttons[i].data
            };
          } else if (buttons[i].action === "uri") {
            data_button[i].action = {
              type: buttons[i].action,
              label: buttons[i].label,
              uri: buttons[i].data
            };
          }

          //another magic, need refactor
          opt_button[i].contents.push(data_button[i]);

          if ((parseInt(i) + 1) % 2 === 0) {
            bubble[index].footer.contents[parseInt(i) - temp].contents.push(
              data_button[i]
            );
            temp++;
          } else {
            bubble[index].footer.contents.push(opt_button[i]);
          }
        }
      }

      flex_msg.contents.contents.push(bubble[index]);
    });

    let msg = [flex_msg];

    if (opt_texts.length > 0) {
      msg = msg.concat(opt_texts);
    }

    if (newFlex_texts) {
      msg.push(this.addNewFlexMsg(newFlex_texts));
    }

    //console.log(msg);

    return this.client.replyMessage(this.event.replyToken, msg).catch(err => {
      console.log(JSON.stringify(flex_msg.contents, null, 2));
    });
  },

  addNewFlexMsg: function(newFlex_texts) {
    let flex_msg = {
      type: "flex",
      altText: "📣 ada pesan untuk kamu",
      contents: {
        type: "carousel",
        contents: []
      }
    };

    let bubble = {};

    newFlex_texts.forEach((item, index) => {
      bubble[index] = {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: item.header.text,
              color: "#ffffff",
              size: "xl",
              weight: "bold",
              style: "normal",
              decoration: "none",
              align: "center",
              wrap: true
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: []
        },
        styles: {
          header: {
            backgroundColor: color.main
          },
          body: {
            backgroundColor: color.background
          },
          footer: {
            backgroundColor: color.background,
            separator: false
          }
        }
      };

      if (item.body) {
        bubble[index].body.contents.push({
          type: "text",
          size: "lg",
          text: item.body.text.trim(),
          wrap: true,
          color: color.text
        });
      }

      if (item.table) {
        //make table
        let table_header = {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "No. ",
              weight: "bold",
              color: color.text
            },
            {
              type: "text",
              text: "Name",
              flex: 3,
              weight: "bold",
              wrap: true,
              color: color.text
            },
            {
              type: "text",
              text: "Status",
              flex: 2,
              weight: "bold",
              align: "center",
              color: color.text
            }
          ]
        };

        if (item.table.header.addon !== "") {
          table_header.contents.push({
            type: "text",
            text: item.table.header.addon,
            flex: 2,
            align: "center",
            weight: "bold",
            color: color.text
          });
        }

        let separator = {
          type: "separator",
          color: color.secondary,
          margin: "sm"
        };

        bubble[index].body.contents.push(table_header, separator);

        let table_body = item.table.body;

        //iterate data
        table_body.forEach(t => {
          t.contents.forEach(txt => {
            txt.color = color.text;
          });

          //push to contents
          bubble[index].body.contents.push(t);
        });
      }

      if (item.footer && item.footer.buttons.length > 0) {
        bubble[index].footer = {
          type: "box",
          layout: "vertical",
          contents: [],
          spacing: "md"
        };

        let buttons = item.footer.buttons;

        let opt_button = {};
        let data_button = {};

        let temp = 1;

        for (let i = 0; i < buttons.length; i++) {
          opt_button[i] = {
            type: "box",
            layout: "horizontal",
            contents: [],
            spacing: "md"
          };

          data_button[i] = {
            type: "button",
            action: {},
            style: "primary",
            color: color.secondary
          };

          if (buttons[i].action === "postback") {
            data_button[i].action = {
              type: buttons[i].action,
              label: buttons[i].label,
              data: buttons[i].data
            };
          } else if (buttons[i].action === "uri") {
            data_button[i].action = {
              type: buttons[i].action,
              label: buttons[i].label,
              uri: buttons[i].data
            };
          }

          //another magic, need refactor
          opt_button[i].contents.push(data_button[i]);

          if ((parseInt(i) + 1) % 2 === 0) {
            bubble[index].footer.contents[parseInt(i) - temp].contents.push(
              data_button[i]
            );
            temp++;
          } else {
            bubble[index].footer.contents.push(opt_button[i]);
          }
        }
      }

      flex_msg.contents.contents.push(bubble[index]);
    });

    return flex_msg;
  }
};
