TODO

- setelah sistem points reset perminggu dah aman, data user yg di .data werewolf-glitch ini akan di hapus,
lalu barulah import changes dari github yg udah update dari werewolf-glitch-test

  -  `cd /app/.data/users`

  -  `rm -rf *`

- buat database beneran, data user store di mongodb / sql. freakin' hard tho

- role tracker(tau target visit siapa), trapper, spy, survivor, jailor
  - tracker : dari target.index nya kita bisa tau dia visit siapa KALAU tidak di roleblock dan TIDAK di attack
    kecuali yg attack itu veteran, baru tau dia kemana
  - trapper : sama keknya mekanisme seperti bodyguard, cuman ini ribet sih
  - spy, dia bisa tau werewolf kemana aja, dan kalau dia dia bisa bug suatu target, untuk tau org itu terkena apa aja, di heal, di attack, di roleblock dll
  - survivor menang kalau dia gak mati
- kalau role udah bsa multi gitu,

  - doctor : ada private prop ke target, yg di healed, pasti harus ada prop healed by who gitu
    - doctor sementara ga bisa multi dulu, ntr lah
  - bisa ada role executioner, ini buat system baru lagi, dimana dia targetnya harus warga
    - ah nanti baru pikir kek mna bagusnya
  - bisa ada role amnesiac
  - sekarang neutral dh bisa multiple, tapi mereka ga tau siapa sesama mereka

- sekarang udah bisa custom, jadi di getRandomRoleSet bnyak tugas nih

- buat module sendiri, untuk flex message, biar gampang dipake di bot lain
  - ini flexMessage table nya gampang di kostumisasi
  - dan buat gimana flex_textxnya itu bisa di lebih dari 1 bubble chat (max 5 bubble chat)
  - 1 carousel max 10 bubble flex
