# START HERE — untuk pemula

Kamu tidak perlu memahami seluruh React/Next.js sekaligus. Kerjakan berurutan.

## Tahap 1 — Pastikan tools

1. Install Node.js 20.9 atau lebih baru.
2. Buka VS Code.
3. Buka folder `cement-volume-dashboard`.
4. Buka Terminal di VS Code.
5. Jalankan:

```bash
npm install
npm run dev
```

6. Buka `http://localhost:3000`.

## Tahap 2 — Kenali 4 file utama

`app/page.tsx`

Ini halaman utama. File ini memanggil component dashboard.

`app/components/Dashboard.tsx`

Ini pusat interaksi: filter, KPI, tabel, export CSV, dan state filter.

`app/components/VolumeChart.tsx`

Ini hanya bertugas menampilkan bar chart menggunakan Recharts.

`lib/data.ts`

Ini tempat data dummy dan daftar cement. Saat data perusahaan tersedia, bagian ini yang pertama kamu ubah.

## Tahap 3 — Coba modifikasi kecil

Cari:

```ts
"Plant 8": { SALES: 105715.5, TRANSFER: 26308.02 },
```

Ubah salah satu angka, simpan, lalu lihat dashboard. Next.js akan melakukan refresh otomatis pada mode development.

## Tahap 4 — Pahami cara filter bekerja

User memilih filter → React menyimpan pilihan → `filteredRecords` menghitung record yang cocok → `summaryRows` mengagregasi volume → KPI, chart, dan tabel mengambil hasil agregasi tersebut.

Secara sederhana:

```text
Input Filter
    ↓
filteredRecords
    ↓
summaryRows
    ↓
┌─────────────┬────────────┬─────────────┐
│ KPI         │ Chart      │ Table       │
└─────────────┴────────────┴─────────────┘
```

## Tahap 5 — Jangan integrasikan database sebelum data contract jelas

Sebelum coding database, minta pembimbing/mentor memberikan:

- sumber data sebenarnya,
- nama tabel/file/API,
- nama kolom,
- contoh 10–20 baris data,
- timezone/jadwal refresh,
- definisi SALES dan TRANSFER,
- definisi Plant,
- daftar master Cement/Coding,
- apakah dashboard read-only,
- bagaimana autentikasi dilakukan.

## Tahap 6 — Bentuk data target

Idealnya setiap transaksi/record minimal bisa dipetakan ke:

```text
date
plant
category
cementCode
cementName
volume
```

Contoh:

```json
{
  "date": "2026-09-12",
  "plant": "Plant 14",
  "category": "SALES",
  "cementCode": "B",
  "cementName": "HYDRAULIC CEMENT",
  "volume": 1250.45
}
```

## Tahap 7 — Setelah source data siap

Urutannya:

```text
Database/API asli
      ↓
Server-side data access
      ↓
Filter berdasarkan parameter
      ↓
Agregasi SUM(volume)
      ↓
Dashboard
```

Jangan menaruh username/password database di component client atau browser.

## Tahap 8 — Sebelum diserahkan

Jalankan:

```bash
npm run typecheck
npm run build
```

Lalu cek:

- filter tidak menghasilkan angka aneh,
- Grand Total sesuai hasil agregasi,
- SALES + TRANSFER sesuai total volume,
- chart dan table menampilkan data yang sama,
- rentang tanggal bekerja,
- data kosong menampilkan empty state,
- export CSV dapat dibuka di Excel.
