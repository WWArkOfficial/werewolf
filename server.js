// server.js
// where your node app starts

// init project
const line = require("@line/bot-sdk");
const express = require("express");
const app = express();
const CronJob = require("cron").CronJob;

// line config
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};
const client = new line.Client(config);

// for update rank once a week, on thursday
// Thanks https://crontab.guru/examples.html
const updateRankJob = new CronJob("0 0 * * */4", function() {
  const reset = require("/app/src/reset");
  reset.usersPoint();
});
updateRankJob.start();

app.use("/callback", line.middleware(config));

app.get("/", (req, res) => res.sendStatus(200));

app.post("/callback", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error("error di app.post", err);
    });
});

async function handleEvent(event) {
  //Note: should return! So Promise.all could catch the error
  if (event.type === "postback") {
    let rawArgs = event.postback.data;
    const data = require("/app/src/data");
    return data.receive(client, event, rawArgs);
  }

  if (event.type !== "message" || event.message.type !== "text") {
    let otherEvents = ["join", "follow", "leave", "memberJoined", "memberLeft"];
    if (otherEvents.includes(event.type)) {
      const other = require("/app/src/other");
      return other.receive(client, event);
    }
    return Promise.resolve(null);
  }

  let rawArgs = event.message.text;
  const data = require("/app/src/data");
  return data.receive(client, event, rawArgs);
}

// listen for requests :)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
