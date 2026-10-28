# MAISON — toko online pakaian (Next.js)

Storefront bergaya lacoste.com/id dengan panel admin untuk kategori dan produk. Checkout diteruskan ke WhatsApp.

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:3000
```

Production (perlu server sendiri / VPS, karena data disimpan sebagai file):

```bash
npm run build
ADMIN_SECRET="isi-dengan-string-acak-panjang" npm start
```

## Admin

- Buka `/admin` (atau ikon akun di header).
- Login sementara: **admin** / **12345**, di-hardcode di `src/lib/auth.ts`. Ganti sebelum dipakai publik.
- Set env `ADMIN_SECRET` di production untuk menandatangani cookie login.

Di admin Anda bisa:
- **Kategori**: kategori utama tampil di menu atas, sub-kategori tampil di dropdown. Kategori yang masih berisi produk atau sub-kategori tidak bisa dihapus.
- **Produk**: nama, kategori, harga, harga diskon (badge "% off" dihitung otomatis), warna, ukuran, maksimal 8 foto (JPG/PNG/WEBP, maks. 5MB), badge, status New In dan aktif/nonaktif.
- **Dashboard**: ringkasan jumlah data dan daftar email newsletter.

## Mengganti brand

Edit `src/config/site.ts`: nama brand, tagline, **nomor WhatsApp** (format `628xxxxxxxxxx`), email, teks pengiriman, dan link sosial media. Warna tema ada di `src/app/globals.css`.

## Data dan file

| Lokasi | Isi |
| --- | --- |
| `seed/*.json` | Data contoh awal (di-commit) |
| `data/*.json` | Data aktif. Dibuat otomatis dari `seed/` saat pertama dijalankan. Backup folder ini. |
| `storage/uploads/` | Foto yang di-upload admin, disajikan lewat `/media/...`. Backup folder ini juga. |
| `public/placeholder/` | Gambar placeholder data contoh |
| `public/images/` | Foto banner (Unsplash, bebas dipakai komersial). Sumber di `public/images/CREDITS.md` |

- `npm run reset-data`: hapus `data/` sehingga toko kembali ke data contoh.
- `npm run generate-seed`: buat ulang `seed/` dan gambar placeholder.

## Catatan teknis

- Next.js 16 dengan Cache Components. Halaman toko di-cache dengan tag `catalog`; setiap perubahan dari admin memanggil `updateTag("catalog")` sehingga langsung tampil.
- `/admin` dilindungi oleh `src/proxy.ts`, dan setiap halaman serta server action admin memanggil `requireAdmin()`.
- Keranjang tersimpan di browser (localStorage). Harga di halaman keranjang dan pesan WhatsApp selalu diambil ulang dari server.
