import type { Category, VolumeRecord } from "@/types/dashboard";

export const cementCatalog = [
  { code: "!", name: "PCC JEMPOLAN" },
  { code: "#", name: "OPC BOSOWA" },
  { code: "(", name: "SEMEN PORTLAND INDUSTRI" },
  { code: "@", name: "PPC JEMPOLAN" },
  { code: "001", name: "TR-35" },
  { code: "1", name: "O.P.C" },
  { code: "3", name: "WHITE" },
  { code: "5", name: "O.W.C." },
  { code: "7", name: "PPC RAJAWALI" },
  { code: "8", name: "TR-27" },
  { code: "A", name: "TYPE-2" },
  { code: "B", name: "HYDRAULIC CEMENT" },
  { code: "C", name: "OPC TR RAPID" },
  { code: "D", name: "OPC ASTM" },
  { code: "E", name: "PCC INDUSTRY" },
  { code: "F", name: "P.S.C" },
  { code: "G", name: "TYPE-5" },
  { code: "H", name: "TY-2/5" },
  { code: "J", name: "P.C.C." },
  { code: "K", name: "TR-18" },
  { code: "P", name: "PCC RAJAWALI" },
  { code: "Q", name: "PCC BOSOWA" },
  { code: "R", name: "TR-10" },
  { code: "S", name: "P-MS 2MM" },
  { code: "T", name: "TR-30" },
  { code: "U", name: "TR-15" },
  { code: "V", name: "TR-20" },
  { code: "X", name: "CaCO3" },
] as const;

export const plants = ["Plant 1", "Plant 2", "Plant 5", "Plant 6", "Plant 8", "Plant 11", "Plant 14"] as const;
export const categories: Category[] = ["SALES", "TRANSFER"];

// Angka di bawah sengaja meniru agregat yang terlihat pada screenshot referensi.
// Nanti bagian ini tinggal diganti sumber data asli (API, SQL, Excel/CSV, dll.).
const september2026Totals: Record<string, Partial<Record<Category, number>>> = {
  "Plant 1": { SALES: 5703.04 },
  "Plant 2": { SALES: 1184.74 },
  "Plant 5": { SALES: 8150.82 },
  "Plant 6": { SALES: 2513.3 },
  "Plant 8": { SALES: 105715.5, TRANSFER: 26308.02 },
  "Plant 11": { SALES: 83196.43, TRANSFER: 19167.56 },
  "Plant 14": { SALES: 150319.04, TRANSFER: 71367.8 },
};

const padded = (n: number) => String(n).padStart(2, "0");

function generateDailyDistribution(total: number, plantIndex: number, categoryIndex: number) {
  const weights = Array.from({ length: 30 }, (_, day) => {
    const wave = 0.8 + ((day * 7 + plantIndex * 5 + categoryIndex * 3) % 11) / 20;
    const weekendDip = day % 7 === 5 || day % 7 === 6 ? 0.86 : 1;
    return wave * weekendDip;
  });

  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((weight) => (total * weight) / sum);
}

function splitAcrossCements(volume: number, plantIndex: number, day: number, categoryIndex: number) {
  const weights = cementCatalog.map((_, cementIndex) => {
    const base = 1 + ((cementIndex * 3 + plantIndex * 2 + day * 5 + categoryIndex) % 13);
    return base;
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  return weights.map((weight) => (volume * weight) / totalWeight);
}

function createMockRecords(): VolumeRecord[] {
  const records: VolumeRecord[] = [];

  plants.forEach((plant, plantIndex) => {
    categories.forEach((category, categoryIndex) => {
      const total = september2026Totals[plant]?.[category];
      if (!total) return;

      const daily = generateDailyDistribution(total, plantIndex, categoryIndex);

      daily.forEach((dayVolume, dayIndex) => {
        const date = `2026-09-${padded(dayIndex + 1)}`;
        const byCement = splitAcrossCements(dayVolume, plantIndex, dayIndex + 1, categoryIndex);

        byCement.forEach((cementVolume, cementIndex) => {
          const cement = cementCatalog[cementIndex];
          records.push({
            date,
            plant,
            category,
            cementCode: cement.code,
            cementName: cement.name,
            volume: Number((cementVolume).toFixed(2)),
          });
        });
      });
    });
  });

  return records;
}

export const mockRecords = createMockRecords();

export const availableYears = [2026];
