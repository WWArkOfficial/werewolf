const roles = [
  {
    name: "werewolf",
    description:
      "🐺 Kamu adalah penjahat yang menyamar diantara werewolf. Kamu kebal dari serangan biasa. ",
    skillText: "🐺 Werewolf, Pilih siapa mangsamu",
    cmdText: "/skill",
    team: "werewolf",
    canKill: true,
    emoji: "🐺"
  },
  {
    name: "sorcerer",
    description:
      "🧙 Kamu adalah penjahat yang bisa mengetahui suatu role. Kamu di pihak Werewolf",
    skillText: "🧙 Sorcerer, Pilih siapa yang ingin diterawang",
    cmdText: "/skill",
    team: "werewolf",
    canKill: false,
    emoji: "🐺"
  },
  {
    name: "consort",
    description:
      "🚷 Kamu adalah penjahat yang bisa block skill suatu pemain saat malam. Kamu di pihak Werewolf",
    skillText: "🚷 Consort, Pilih siapa yang ingin di block",
    cmdText: "/skill",
    team: "werewolf",
    canKill: false,
    emoji: "🐺"
  },
  {
    name: "seer",
    description:
      "🔮 Kamu adalah warga yang bisa cek identitas sebenarnya dari suatu orang. Gantung Werewolf supaya kamu menang",
    skillText: "🔮 Seer, pilih siapa yang ingin di check",
    team: "villager",
    cmdText: "/skill",
    canKill: false,
    emoji: " 👨‍🌾"
  },
  {
    name: "doctor",
    description:
      "💉 Kamu adalah warga yang bisa menyembuhkan suatu orang pada malam hari, mana tau orang lain butuh bantuan.",
    skillText: "💉 Doctor, pilih siapa yang ingin dilindungi",
    team: "villager",
    cmdText: "/skill",
    canKill: false,
    emoji: "👨‍🌾"
  },
  {
    name: "villager",
    description:
      "👨‍🌾 Kamu adalah warga (luar)biasa, tugasmu itu cari tau siapa werewolf, dan gantungkan werewolfnya",
    team: "villager",
    canKill: false,
    emoji: "👨‍🌾"
  },
  {
    name: "vampire",
    description:
      "🧛 Kamu bukan dipihak warga atau werewolf, misi kamu gantung werewolf dan membuat semua warga menjadi vampire.",
    skillText: "🧛 Vampire, pilih siapa yang ingin di ubah menjadi vampire",
    team: "vampire",
    cmdText: "/skill",
    canKill: true,
    emoji: "🧛"
  },
  {
    name: "vampire-hunter",
    description:
      "🗡️ Kamu adalah warga yang membantu warga membasmi Vampire. Jika kamu didatangi Vampire, kamu akan membunuhnya. Kamu juga bisa mendengar percakapan Vampire saat malam. Jika semua vampire telah mati, kamu akan menjadi Vigilante",
    skillText: "🗡️ Vampire Hunter, pilih siapa yang ingin di check rumahnya",
    cmdText: "/skill",
    team: "villager",
    canKill: true,
    emoji: "👨‍🌾"
  },
  {
    name: "werewolf-cub",
    description:
      "🐕 Kamu dipihak werewolf, dan kamu suruhan Werewolf untuk membunuh orang lain. ",
    skillText: "🐕 Werewolf Cub, pilih siapa yang ingin di bunuh",
    team: "werewolf",
    cmdText: "/skill",
    canKill: true,
    emoji: "🐺"
  },
  {
    name: "vigilante",
    description:
      "🔫 Kamu adalah warga yang bisa memilih siapa yang ingin dibunuh pas malam. Jika kamu bunuh sesama warga, kamu akan bunuh diri keesokan harinya",
    skillText: "🔫 Vigilante, pilih siapa yang ingin dibunuh",
    cmdText: "/skill",
    team: "villager",
    canKill: true,
    emoji: "👨‍🌾"
  },
  {
    name: "tanner",
    description:
      "🃏 Kamu tidak memihak siapa siapa, tetapi kamu menang jika di vote warga sampai digantung",
    team: "tanner",
    canKill: false,
    emoji: "🃏"
  },
  {
    name: "lookout",
    description:
      "👀 Kamu adalah warga yang bisa memantau rumah seseorang pas malam, sehingga bisa mengetahui siapa pendatangnya",
    skillText: "👀 Lookout, pilih rumah yang ingin dipantau",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: "👨‍🌾"
  },
  {
    name: "escort",
    description:
      "💋 Kamu adalah warga yang bisa block skill pemain lain, sehingga targetmu tidak dapat menggunakan skill malamnya. Hati hati, kamu bisa block skill sesama warga",
    skillText: "💋 Escort, pilih siapa yang mau kamu distrak malam ini",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: "👨‍🌾"
  },
  {
    name: "serial-killer",
    description:
      "🔪 Kamu adalah Psikopat yang hanya ingin semua orang mati. Kamu kebal dari serangan biasa, dan Menang jika semua yang menentangmu mati",
    skillText: "🔪 Serial Killer, pilih siapa yang mau kamu siksa malam ini",
    cmdText: "/skill",
    team: "serial-killer",
    canKill: true,
    emoji: "🔪"
  },
  {
    name: "retributionist",
    description:
      "⚰️ Kamu adalah warga yang bisa membangkitkan orang yang telah mati. ",
    skillText: "⚰️ Retributionist, pilih siapa yang mau kamu bangkitkan",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: "👨‍🌾"
  },
  {
    name: "veteran",
    description:
      "🎖️ Kamu adalah warga yang memiliki paranoia, jika kamu 'alert', maka kamu akan membunuh siapa saja yang kerumahmu. ",
    skillText: "🎖️ Veteran, apakah kamu akan alert malam ini?",
    cmdText: "/alert",
    team: "villager",
    canKill: true,
    emoji: "👨‍🌾"
  },
  {
    name: "arsonist",
    description:
      "🔥 Kamu adalah orang gila yang ingin semua orang mati dibakar. Untuk membakar rumah target, gunakan skill ke diri sendiri. Pastikan sudah menyiram bensin ke rumah target-target",
    skillText:
      "🔥 Arsonist, pilih rumah siapa yang ingin kamu sirami dengan bensin.",
    cmdText: "/skill",
    team: "arsonist",
    canKill: true,
    emoji: "🔥"
  },
  {
    name: "sheriff",
    description:
      "👮 Kamu adalah warga yang bisa cek suatu warga mencurigakan atau tidak. ",
    skillText: "👮 Sheriff, pilih siapa yang mau kamu cek",
    cmdText: "/skill",
    team: "villager",
    canKill: false,
    emoji: "👨‍🌾"
  }
];

module.exports = roles;
