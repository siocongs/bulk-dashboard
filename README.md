# Cement Volume Dashboard — Next.js

Dashboard monitoring volume semen/cement berdasarkan **Plant**, **Category (SALES/TRANSFER)**, **Year**, **Month**, **Coding DD**, **rentang tanggal**, dan **jenis Cement**.

## 1. Tech

- Next.js 16.3.8 + App Router
- React 19.3.0
- TypeScript
- Recharts 3.10.1 grafik
- Lucide React ikon
- CSS melalui `app/globals.css`

## 2. How to Run

Gunakan Node.js **20.9+**. Untuk belajar dari awal, npm sudah cukup.

Cek instalasi:

```bash
node -v
npm -v
```


```bash
cd cement-volume-dashboard
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

## 3. Check before commit

```bash
npm run typecheck
npm run build
```

## 4. Feature

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

## 5. Project Structure

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

## 6. Point

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

## 7. Flow

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

## 8. Mapping Coding DD / Cement

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