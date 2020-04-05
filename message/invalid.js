const helper = require("/app/helper");

module.exports = {
  getResponse: function(args, name) {
    let addonText = "cek daftar perintah yang benar di '/cmd'";
    let invalidText = args.join(" ");
    invalidText = invalidText.substring(1);

    if (!invalidText) {
      let text = "ngetik apaan. ";
      text += addonText;
      return text;
    }

    invalidText = "'" + invalidText + "'";
    const response = [
      "🤨 kamu kira aku bakal ngerti " + invalidText + "? ",
      "😕 apa sih. ",
      "🙄 aku gak ngerti cmd " + invalidText + ". ",
      "🤔 maksudnya " + invalidText + " apaan? ",
      "😑 au ah gelap. Gak ngerti aku cmd " + invalidText + ". ",
      "😐 tolong ya, aku gak ngerti " + invalidText + " artinya apaan. ",
      "😒 i don't what is " + invalidText + " means. ",
      "😕 aku ga ngerti " + invalidText + ", mungkin yang lain tau. ",
      "🙄 gak paham. ",
      "🤔 eyy " + name + ", aku gak ngerti " + invalidText + " artinya apa. ",
      "🤨 " + name + " itu ngetik apaan sih? ",
      "😒 bro/sis " + name + ", ini text " + invalidText + " typo ya? ",
      "😐 typo tuh, aku gak ngerti " + invalidText + " apaan. ",
      "😑 ketik yang bener dong, " + name + ". aku tak ngerti. "
    ];

    let text = helper.random(response);
    text += addonText;
    return text;
  }
};
