module.exports = {
  response: function(roleName, targetName, isChangeTarget, isSelfTarget) {
    let text = "";
    switch (roleName) {
      case "werewolf":
      case "werewolf-cub":
        if (isChangeTarget) {
          text +=
            "🐺 Kamu berubah pikiran dan memutuskan untuk membunuh " +
            targetName +
            " saja malam ini";
        } else {
          text += "🐺 Kamu memilih untuk membunuh " + targetName + " malam ini";
        }
        break;

      case "seer":
      case "sorcerer":
        if (isChangeTarget) {
          text +=
            "🔮 Kamu berubah pikiran dan berencana untuk menerawang " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🔮 Kamu berencana untuk menerawang " + targetName + " malam ini";
        }
        break;

      case "escort":
      case "consort":
        if (isChangeTarget) {
          text +=
            "🚷 Kamu berubah pikiran dan berencana untuk me-roleblock " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🚷 Kamu berencana untuk me-roleblock " + targetName + " malam ini";
        }
        break;

      case "vigilante":
        if (isChangeTarget) {
          text +=
            "🔫 Kamu berubah pikiran dan berencana untuk membunuh " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🔫 Kamu berencana untuk membunuh " + targetName + " malam ini";
        }
        break;

      case "veteran":
        text += "💥 Kamu memutuskan untuk berjaga-jaga di rumah mu";
        break;

      case "serial-killer":
        if (isChangeTarget) {
          text +=
            "🔪 Kamu berubah pikiran dan berencana untuk membunuh " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "🔪 Kamu berencana untuk membunuh " + targetName + " malam ini";
        }
        break;

      case "arsonist":
        if (isChangeTarget) {
          if (isSelfTarget) {
            text +=
              "🔥 Kamu berubah pikiran dan memutuskan untuk membakar rumah target yg telah disirami bensin";
          } else {
            text +=
              "⛽ Kamu berubah pikiran dan memutuskan untuk me nyirami rumah " +
              targetName +
              " saja dengan bensin";
          }
        } else {
          if (isSelfTarget) {
            text +=
              "🔥 Kamu memutuskan untuk membakar rumah target yg telah disirami bensin";
          } else {
            text +=
              "⛽ Kamu memutuskan untuk me nyirami rumah " +
              targetName +
              " dengan bensin";
          }
        }
        break;

      case "doctor":
        if (isChangeTarget) {
          if (isSelfTarget) {
            text +=
              "💉 Kamu berubah pikiran dan memutuskan untuk melindungi diri mu sendiri saja malam ini";
          } else {
            text +=
              "💉 Kamu berubah pikiran dan memutuskan untuk berkunjung ke rumah " +
              targetName +
              " saja dan merawatnya jika dia terkena serangan";
          }
        } else {
          if (isSelfTarget) {
            text +=
              "💉 Kamu memutuskan untuk berjaga-jaga untuk melindungi diri mu sendiri malam ini";
          } else {
            text +=
              "💉 Kamu memutuskan untuk berkunjung ke rumah " +
              targetName +
              " dan merawatnya jika dia terkena serangan";
          }
        }
        break;

      case "retributionist":
        if (isChangeTarget) {
          text +=
            "⚰️ Kamu berubah pikiran dan memutuskan untuk ke makam " +
            targetName +
            " saja dan membangkitkan nya dari kematian";
        } else {
          text +=
            "⚰️ Kamu memutuskan untuk ke makam " +
            targetName +
            " dan membangkitkan nya dari kematian";
        }
        break;

      case "vampire":
        if (isChangeTarget) {
          text +=
            "🦇 Kamu berubah pikiran dan memilih " +
            targetName +
            " saja untuk dijadikan vampire";
        } else {
          text += "🦇 Kamu memilih " + targetName + " untuk dijadikan vampire";
        }
        break;

      case "vampire-hunter":
        if (isChangeTarget) {
          text +=
            "🗡️ Kamu berubah pikiran dan memutuskan untuk cek " +
            targetName +
            " apakah dia vampire atau bukan";
        } else {
          text +=
            "🗡️ Kamu memutuskan untuk cek " +
            targetName +
            " apakah dia vampire atau bukan";
        }
        break;

      case "lookout":
        if (isChangeTarget) {
          text +=
            "👀 Kamu berubah pikiran dan memutuskan untuk mengawasi " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "👀 Kamu memutuskan untuk mengawasi " + targetName + " malam ini";
        }
        break;

      case "sheriff":
        if (isChangeTarget) {
          text +=
            "👮 Kamu berubah pikiran dan memutuskan untuk interogasi " +
            targetName +
            " saja malam ini";
        } else {
          text +=
            "👮 Kamu memutuskan untuk interogasi " + targetName + " malam ini";
        }
        break;
    }
    
    return text;
  }
};
