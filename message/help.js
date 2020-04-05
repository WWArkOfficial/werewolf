module.exports = {
  getHelp: function(state) {
    let header = "";
    let body = "";

    switch (state) {
      case "idle":
        header += "🚪 Buat room game";
        body += "Buat room game dengan perintah '/new'. ";
        body += "Di butuhkan minimal 5 pemain untuk memulai game. ";
        body += "Ketik '/help' lagi untuk bantuan.";
        break;
        
      case "new":
        header += "✋ Join ke dalam game";
        body += "Gunakan perintah '/join' untuk bergabung kedalam game. ";
        body += "Pemain yang telah join ke suatu room game tidak dapat join ";
        body += "ke room game tempat lain. ";
        body += "Ketik '/help' lagi untuk bantuan.";
        break;
        
      case "day":
        header += "⛅ Diskusi";
        body += "Jangan lupa pc bot '/news' untuk mengetahui berita hasil skill. ";
        body += "Diskusilah siapa yang akan di vote. ";
        body += "Ketik '/help' lagi untuk bantuan.";
        break;
        
      case "night":
        header += "🌙 Gunakan skill";
        body += "Gunakan skill dengan klik button 'role' di flex bot atau ";
        body += "pc bot dengan perintah '/role'. ";
        body += "Jika bingung info peran, bisa gunakan perintah '/info <nama-role>'. " + "\n";
        body += "Contoh : /info serial-killer. ";
        body += "Ketik '/help' lagi untuk bantuan.";
        break;
        
      case "vote":
        header += "☝️ Vote pemain";
        body += "Pilih pemain yang ingin digantung. ";
        body += "Voting akan selesai jika waktu yang diberikan telah habis. ";
        body += "Ketik '/help' lagi untuk bantuan.";
        break;

      default:
        header += "🎮 Undang Bot";
        body += "Undang bot ke group / room chat kamu untuk bermain. ";
        body += "Di butuhkan minimal 5 pemain";
    }

    let helpMessage = {
      headerText: header,
      bodyText: body
    };

    return helpMessage;
  }
};
