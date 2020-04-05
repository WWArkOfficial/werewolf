module.exports = {
  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    let flex_text = {
      header: {
        text: ""
      },
      body: {
        text: ""
      }
    };

    if (!this.args[1]) {
      let roles = require("/app/roles/rolesData").map(role => {
        return role.name;
      });

      flex_text.header.text = "🐺 Role List 🔮";
      flex_text.body.text = roles.join(", ");
      flex_text.body.text +=
        "\n\n" +
        "Cth: '/info vampire-hunter' untuk mengetahui detail role Vampire-Hunter";
      return this.replyFlex(flex_text);
    }

    let roleName = this.args[1].toLowerCase();

    switch (roleName) {
      case "villager":
      case "warga":
        flex_text.header.text = "👨‍🌾 Villager";
        flex_text.body.text =
          "Warga biasa yang punya skill sepisial, tak perlu susah payah menggunakan skill pas malam. ";
        flex_text.body.text += "Tapi gak tau kenapa pada kesal dapat role ini. Padahal OP loh";
        return this.replyFlex(flex_text);

      case "seer":
        flex_text.header.text = "🔮 Seer";
        flex_text.body.text =
          "Warga yang bisa mengecek role asli dari suatu player pada malam hari. ";
        return this.replyFlex(flex_text);

      case "doctor":
        flex_text.header.text = "💉 Doctor";
        flex_text.body.text =
          "Warga yang bisa memilih siapa yang ingin dilindungi. Dapat melindungi dari serangan biasa atau gigitan vampire. ";
        return this.replyFlex(flex_text);

      case "werewolf":
      case "ww":
        flex_text.header.text = "🐺 Werewolf";
        flex_text.body.text =
          "Penjahat yang menyerupai manusia pada siang hari. Yang memberi perintah siapa yang akan dibunuh. ";
        flex_text.body.text =
          "Jika ada Werewolf Cub, maka yang membunuh adalah Werewolf-Cub. ";
        return this.replyFlex(flex_text);

      case "vampire":
        flex_text.header.text = "🧛 Vampire";
        flex_text.body.text =
          "Makhluk hidup yang membawa kerusuhan dengan bisa mengubah warga menjadi sejenisnya. ";
        flex_text.body.text +=
          "Menang jika mengubah semua warga menjadi Vampire, atau menggantung penentangnya. ";
        return this.replyFlex(flex_text);

      case "vampire-hunter":
        flex_text.header.text = "🗡️ Vampire-Hunter";
        flex_text.body.text =
          "Warga yang berani melawan Vampire, disaat Vampire ke rumahnya, Vampire itu pasti mati. ";
        flex_text.body.text +=
          "Mampu mendengar percakapan Vampire saat malam. ";
        return this.replyFlex(flex_text);

      case "werewolf-cub":
        flex_text.header.text = "🐕 Werewolf-Cub";
        flex_text.body.text =
          "Di Pihak werewolf, melakukan pembunuhan atas suruhan Werewolf. Akan menjadi Werewolf jika Werewolf mati. ";
        return this.replyFlex(flex_text);

      case "sorcerer":
        flex_text.header.text = "🧙 Sorcerer";
        flex_text.body.text =
          "Di Pihak werewolf, bisa menerawang suatu pemain untuk mengetahui rolenya. ";
        return this.replyFlex(flex_text);

      case "consort":
        flex_text.header.text = "🚷 Consort";
        flex_text.body.text =
          "Di Pihak werewolf, bisa memilih siapa pemain yang ingin di block skillnya. Consort immune dari role block. ";
        flex_text.body.text +=
          "Jika role block Serial-Killer, maka Serial-Killer itu akan ganti target ke orang yang role block";
        return this.replyFlex(flex_text);

      case "vigilante":
        flex_text.header.text = "🔫 Vigilante";
        flex_text.body.text =
          "Warga yang bisa memilih siapa yang ingin dibunuh pas malam. ";
        flex_text.body.text +=
          "Tetapi jika dia membunuh sesama warga, dia akan bunuh diri keesokan harinya";
        return this.replyFlex(flex_text);

      case "tanner":
        flex_text.header.text = "🃏 Tanner";
        flex_text.body.text =
          "Tidak memihak kesiapa siapa, Tanner menang jika di gantung";
        return this.replyFlex(flex_text);

      case "lookout":
        flex_text.header.text = "👀 Lookout";
        flex_text.body.text =
          "Warga yang bisa memilih rumah siapa yang ingin dipantau pas malam. ";
        flex_text.body.text +=
          "Dia hanya mengetahui siapa nama pendatang targetnya. ";
        return this.replyFlex(flex_text);

      case "escort":
        flex_text.header.text = "💋 Escort";
        flex_text.body.text =
          "Warga yang bisa ganggu konsentrasi orang lain, sehingga targetnya bisa tidak menggunakan skillnya. ";
        flex_text.body.text +=
          "Namun jika ke rumah Serial Killer, Escort ini bisa dibunuhnya. Escort immune dari role block";
        return this.replyFlex(flex_text);

      case "serial-killer":
        flex_text.header.text = "🔪 Serial Killer";
        flex_text.body.text =
          "Psikopat yang kebal dari serangan biasa. Hidup hanya untuk membunuh orang lain. ";
        flex_text.body.text +=
          "Kebal dari serangan biasa. Jika di role block, kamu akan bunuh yang ngerole block dan ";
        flex_text.body.text += "mengabaikan target awalmu. ";
        return this.replyFlex(flex_text);

      case "retributionist":
        flex_text.header.text = "⚰️ Retributionist";
        flex_text.body.text =
          "Warga yang bisa membangkitkan orang mati. Hanya 1 kali saja";
        return this.replyFlex(flex_text);

      case "veteran":
        flex_text.header.text = "🎖️ Veteran";
        flex_text.body.text =
          "Warga yang merupakan Veteran perang yang paranoia. ";
        flex_text.body.text +=
          "Mudah terkejut sehingga jika dalam keadaan 'alert', bisa membunuh siapa saja yang kerumahnya. ";
        return this.replyFlex(flex_text);

      case "sheriff":
        flex_text.header.text = "👮 Sheriff";
        flex_text.body.text =
          "Warga yang bisa cek suatu pemain mencurigakan atau tidak. ";
        flex_text.body.text +=
          "Setiap warga akan tampil tidak mencurigakan. Namun role Werewolf, Arsonist, Vampire akan tampil tidak mencurigakan juga. ";
        return this.replyFlex(flex_text);

      case "arsonist":
        flex_text.header.text = "🔥 Arsonist";
        flex_text.body.text =
          "Maniak api yang hanya ingin semua orang terbakar. ";
        flex_text.body.text +=
          "Arsonist kebal dari serangan biasa saat malam. Pilih diri sendiri jika ingin membakar rumah target yang telah di sirami bensin. ";
        return this.replyFlex(flex_text);

      default:
        let text =
          "💡 Tidak ada ditemukan role '" + this.args[1] + "' pada role list. ";
        text += "Cek daftar role yang ada dengan cmd '/info'";
        return this.replyText(text);
    }
  },

  /** message func **/

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },

  replyFlex: function(flex_raws, text_raws) {
    flex_raws = Array.isArray(flex_raws) ? flex_raws : [flex_raws];
    let flex_texts = flex_raws.map(flex_raw => ({
      header: flex_raw.header,
      body: flex_raw.body,
      footer: flex_raw.footer,
      table: flex_raw.table
    }));

    let opt_texts = [];
    if (text_raws) {
      text_raws = Array.isArray(text_raws) ? text_raws : [text_raws];
      opt_texts = text_raws.map(text => {
        return { type: "text", text: text };
      });
    }

    const flex = require("/app/message/flex");
    return flex.receive(this.client, this.event, flex_texts, opt_texts);
  }
};
