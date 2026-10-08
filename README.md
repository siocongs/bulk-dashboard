# Cement Volume Dashboard — Next.js

Dashboard monitoring volume semen/cement berdasarkan **Plant**, **Category (SALES/TRANSFER)**, **Year**, **Month**, **Coding DD**, **rentang tanggal**, dan **jenis Cement**.

Project ini dibuat sebagai prototype dari screenshot Excel/Pivot yang diberikan. Data awal di `lib/data.ts` adalah **data dummy** yang mengikuti angka agregat yang tampak pada screenshot, bukan data produksi perusahaan.

## 1. Teknologi

- Next.js 16.3.8 + App Router
- React 19.3.0
- TypeScript
- Recharts 3.10.1 untuk grafik
- Lucide React untuk ikon
- CSS biasa melalui `app/globals.css` agar mudah dipelajari

## 2. Prasyarat

Gunakan Node.js **20.9+**. Untuk belajar dari awal, npm sudah cukup.

Cek instalasi:

```bash
node -v
npm -v
```

## 3. Menjalankan project

```bash
cd cement-volume-dashboard
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

## 4. Pemeriksaan sebelum commit

```bash
npm run typecheck
npm run build
```

## 5. Fitur yang sudah dibuat

### Filter

- Year
- Month
- From date / To date
- Coding DD / pilihan hari
- Category: SALES dan TRANSFER
- Multi-select Plant
- Search Plant
- Search Cement code/name
- Pilihan Cement individual
- Reset filter

### Dashboard

- KPI Total Volume
- KPI Sales
- KPI Transfer
- KPI Active Plants
- Bar chart Volume by Plant & Category
- Tooltip pada grafik
- Label angka pada bar
- Summary table
- Grand Total
- Export Summary ke CSV
- Responsive untuk laptop/tablet/mobile

## 6. Struktur folder

```text
cement-volume-dashboard/
├── app/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   └── VolumeChart.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── data.ts
├── types/
│   └── dashboard.ts
├── public/
├── .gitignore
├── next-env.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 7. Bagian yang paling penting untuk magang

### `lib/data.ts`

Saat source data asli sudah diberikan, fokus pertama ada di file ini. Prototype sekarang memakai `mockRecords`.

Bentuk satu record:

```ts
{
  date: "2026-09-01",
  plant: "Plant 8",
  category: "SALES",
  cementCode: "B",
  cementName: "HYDRAULIC CEMENT",
  volume: 1234.56
}
```

Nanti `mockRecords` dapat diganti dengan data dari:

1. SQL database,
2. REST API,
3. file CSV/Excel yang diproses backend,
4. atau sumber data perusahaan lainnya.

## 8. Alur pengembangan ke versi production

```text
Source Data
   ↓
Database / API
   ↓
Next.js data layer / API route
   ↓
Filter + agregasi
   ↓
Dashboard UI
   ↓
Chart + Table
   ↓
Deployment
```

Jangan langsung memasukkan kredensial database ke browser. Password/secret harus disimpan di environment server, misalnya `.env.local`, dan koneksi database dilakukan di sisi server.

## 9. Mapping Coding DD / Cement

Daftar coding diambil dari pesan referensi yang diberikan:

```text
!   PCC JEMPOLAN
#   OPC BOSOWA
(   SEMEN PORTLAND INDUSTRI
@   PPC JEMPOLAN
001 TR-35
1   O.P.C
3   WHITE
5   O.W.C.
7   PPC RAJAWALI
8   TR-27
A   TYPE-2
B   HYDRAULIC CEMENT
C   OPC TR RAPID
D   OPC ASTM
E   PCC INDUSTRY
F   P.S.C
G   TYPE-5
H   TY-2/5
J   P.C.C.
K   TR-18
P   PCC RAJAWALI
Q   PCC BOSOWA
R   TR-10
S   P-MS 2MM
T   TR-30
U   TR-15
V   TR-20
X   CaCO3
```

## 10. Catatan data

Screenshot menunjukkan angka agregat seperti:

- Plant 1 — SALES: 5,703.04
- Plant 2 — SALES: 1,184.74
- Plant 5 — SALES: 8,150.82
- Plant 6 — SALES: 2,513.30
- Plant 8 — SALES: 105,715.50; TRANSFER: 26,308.02
- Plant 11 — SALES: 83,196.43; TRANSFER: 19,167.56
- Plant 14 — SALES: 150,319.04; TRANSFER: 71,367.80

Prototype mendistribusikan angka agregat tersebut menjadi data harian dan cement agar filter dapat dicoba.

## 11. Git

```bash
git init
git add .
git commit -m "feat: init cement volume dashboard"
git branch -M main
git remote add origin <URL-REPOSITORY>
git push -u origin main
```
