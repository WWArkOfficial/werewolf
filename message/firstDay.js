const helper = require("/app/helper");
const naratives = [
  "🏝️ Para warga terdampar di suatu pulau. Ditemukan salah satu warga mati dibunuh, namun tidak ada yang mengaku.",
  "🌇 Ada warga yang dibunuh secara misterius, namun tidak ada yang mengaku. ",
  "☕ Suatu hari ada yang meninggal diracunin sianida, namun tidak ada yang mengaku. ",
  "🛸 Tiba tiba ada UFO yang menghapus ingatan warga warga, membuat mereka gila. ",
  "🏖️ Suatu hari di pantai, ditemukan ikan hiu dibunuh. Namun para pendatang tidak ada yang mengaku",
  "⛅ Di suatu desa, ditemukan seorang pemuda mati dibunuh. Tidak ada yang mengaku"
];
let narative = helper.random(naratives);
module.exports = narative;
