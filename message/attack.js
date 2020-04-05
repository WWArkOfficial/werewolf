module.exports = {
  /*
    attackersRoleName array
    victimName string
    isDieFromGuilt bool
  */
  getAttackResponse: function(
    attackersRoleName,
    victimName,
    isDieFromGuilt,
    isAfk
  ) {
    let text = "💀 " + victimName + " ditemukan mati ";

    let attackersCount = attackersRoleName.length;

    if (attackersCount > 1) {
      if (attackersCount > 2) {
        // 3 atau lebih
        text += "dibunuh dengan brutal. ";
      } else {
        // 2
        text += "dibantai. ";
      }
    } else if (attackersCount === 1) {
      // 1
      text += "dibunuh. ";
    } else if (isDieFromGuilt) {
      text += "bunuh diri karena perasaan bersalah. ";
    } else if (isAfk) {
      text += "bunuh diri di rumahnya (AFK). ";
    }

    attackersRoleName.forEach((item, index) => {
      switch (item) {
        case "werewolf":
        case "werewolf-cub":
          text += "🐺 Dia sebelumnya tercakar werewolf. ";
          break;
        case "vigilante":
        case "veteran":
          text += "💥 Dia sebelumnya tertembak " + item + ". ";
          break;
        case "serial-killer":
        case "vampire-hunter":
          text += "🔪 Dia sebelumnya di tikam " + item + ". ";
          break;
        case "arsonist":
          text += "🔥 Dia sebelumnya dibakar " + item + ". ";
          break;
        case "vampire":
          text += "🧛 Dia sebelumnya digigit vampire. ";
          break;
      }
    });

    return text;
  }
};
