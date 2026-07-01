# Kabayan AI — Rerencangan Basa Sunda

Prototipe pertama: chat basa Sunda (lemes/sedeng/kasar), generate gambar, ringkas dokumén PDF, jeung input sora.

## Cara deploy (stack anu biasa Kang Deden pake)

1. Push folder ieu ka GitHub repo anyar (misalna `kabayan-ai`).
2. Connect repo ka Netlify (New site from Git).
3. Di Netlify dashboard → Site settings → Environment variables, tambahkeun:
   - `GROQ_API_KEY` → API key ti console.groq.com (gratis)
   - `SILICONFLOW_API_KEY` → API key ti SiliconFlow (sarua jeung anu dipake di DedenAI)
4. Deploy. Netlify otomatis ngadeteksi folder `netlify/functions`.
5. Buka URL Netlify-na di HP, tés chat, gambar, jeung unggah dokumén.

## Struktur file
```
kabayan-ai/
├── index.html                  ← frontend (single file)
├── netlify.toml                ← konfigurasi Netlify
└── netlify/functions/
    ├── chat.js                 ← proxy ka Groq (llama-3.3-70b-versatile)
    └── image.js                ← proxy ka SiliconFlow (FLUX.1-schnell)
```

## Catetan penting
- **API key aman**: teu aya key anu katembong di frontend, sadayana ngaliwatan Netlify Function (pola sarua jeung DedenAI).
- **Memory**: ayeuna make localStorage (kasimpen di HP wungkul). Upami hayang sinkron across-device, tinggal tambahkeun JSONBin sarua jeung pola WMD/BeresIn.
- **Voice input**: make Web Speech API browser (basa `id-ID`, sabab browser can ngarojong recognition basa Sunda langsung — hasil transkripna tetep bisa diketik/diédit deui saméméh dikirim).
- **Model**: Groq jeung SiliconFlow geus lumayan ngartos Basa Sunda ti data latihanana; kualitas basa Sunda-na gumantung kana system prompt di `chat.js` / `index.html`. Bisa terus dioptimasi upami aya hasil anu kurang pas.

## Rencana pangwangunan salajengna (upami dipikahoyong)
- Toggle terjemahan Indonesia ⇄ Sunda husus
- Kamus babasan/paribasa Sunda anu bisa di-lookup langsung
- Mode "diajar Sunda" pikeun murangkalih sakola
- Sinkronisasi riwayat ngobrol cross-device via JSONBin
