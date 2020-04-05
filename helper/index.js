module.exports = {
  resetRoom: function(group_sessions, key) {
    group_sessions[key] = null;
  },

  resetUser: function(user_sessions, key) {
    user_sessions[key] = null;
  },

  resetAllUsers: function(group_sessions, user_sessions, key) {
    group_sessions[key].players.forEach(item => {
      this.resetUser(user_sessions, item.id);
    });
    this.resetRoom(group_sessions, key);
  },
  
  getRandomTeams: function() {
    let teams = {
      town: [],
      werewolf: [],
      neutral: []
    }
    let townTeam = [
      "seer",
      "doctor",
      "escort",
      "veteran",
      "lookout",
      "retributionist"
    ];
    let werewolfTeam = ["werewolf-cub", "sorcerer", "consort"];
    let neutralTeam = ["serial-killer", "arsonist", "tanner", "vampire"];
    teams.town = this.shuffleArray(townTeam);
    teams.werewolf = this.shuffleArray(werewolfTeam);
    teams.neutral = this.shuffleArray(neutralTeam);
    return teams;
  },

  getFlexColor: function() {
    let color = {};
    let today = new Date().toLocaleTimeString("id-ID", {
      timeZone: "Asia/Bangkok",
      hour12: false
    });
    let timestamp = {
      dawn: {
        from: "00:00:00",
        to: "03:59:59",
        color: {
          main: "#6e1313",
          secondary: "#6e1313",
          background: "#ffffff",
          text: "#000000"
        }
      },
      morning: {
        from: "04:00:00",
        to: "08:59:59",
        color: {
          main: "#6e1313",
          secondary: "#6e1313",
          background: "#ffffff",
          text: "#000000"
        }
      },
      noon: {
        from: "09:00:00",
        to: "14:59:59",
        color: {
          main: "#6e1313",
          secondary: "#6e1313",
          background: "#ffffff",
          text: "#000000"
        }
      },
      evening: {
        from: "15:00:00",
        to: "18:29:59",
        color: {
          main: "#6e1313",
          secondary: "#6e1313",
          background: "#ffffff",
          text: "#000000"
        }
      },
      night: {
        from: "18:30:00",
        to: "23:59:59",
        color: {
          main: "#6e1313",
          secondary: "#6e1313",
          background: "#ffffff",
          text: "#000000"
        }
      }
    };

    let times = Object.keys(timestamp);

    for (let i = 0; i < times.length; i++) {
      let time = timestamp[times[i]];
      if (today >= time.from && today <= time.to) {
        color = time.color;
        return color;
      }
    }
  },

  getRandomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffleArray: function(array) {
    // Thanks to
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },

  random: function(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  trueOrFalse: function() {
    let trueOrFalse = this.random([true, false]);
    return trueOrFalse;
  },

  getMostFrequent: function(array) {
    ///source : https://stackoverflow.com/questions/31227687/find-the-most-frequent-item-of-an-array-not-just-strings
    let mf = 1; //default maximum frequency
    let m = 0; //counter
    let item; //to store item with maximum frequency
    let obj = {}; //object to return
    for (
      let i = 0;
      i < array.length;
      i++ //select element (current element)
    ) {
      for (
        let j = i;
        j < array.length;
        j++ //loop through next elements in array to compare calculate frequency of current element
      ) {
        if (array[i] == array[j])
          //see if element occurs again in the array
          m++; //increment counter if it does
        if (mf < m) {
          //compare current items frequency with maximum frequency
          mf = m; //if m>mf store m in mf for upcoming elements
          item = array[i]; // store the current element.
        }
      }
      m = 0; // make counter 0 for next element.
    }

    //jika ada yang sama, maka akan pilih yang di pertama kali diisi di variable 'item'
    obj = {
      index: item,
      count: mf
    };

    return obj;
  }
};