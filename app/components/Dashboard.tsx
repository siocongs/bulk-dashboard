"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Factory,
  Filter,
  RefreshCcw,
  Search,
  TrendingUp,
} from "lucide-react";
import VolumeChart from "./VolumeChart";
import { availableYears, cementCatalog, mockRecords, plants } from "@/lib/data";
import type { Category } from "@/types/dashboard";

const months = [
  ["01", "January"],
  ["02", "February"],
  ["03", "March"],
  ["04", "April"],
  ["05", "May"],
  ["06", "June"],
  ["07", "July"],
  ["08", "August"],
  ["09", "September"],
  ["10", "October"],
  ["11", "November"],
  ["12", "December"],
] as const;

function formatNumber(value: number) {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function downloadCsv(rows: { plant: string; category: string; volume: number }[]) {
  const header = ["Plant", "Category", "Volume (Ton)"];
  const body = rows.map((row) => [row.plant, row.category, row.volume.toFixed(2)]);
  const csv = [header, ...body].map((line) => line.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "cement-volume-summary.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("09");
  const [days, setDays] = useState<number[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedPlants, setSelectedPlants] = useState<string[]>([...plants]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(["SALES", "TRANSFER"]);
  const [selectedCement, setSelectedCement] = useState<string | null>(null);
  const [cementSearch, setCementSearch] = useState("");
  const [plantSearch, setPlantSearch] = useState("");

  const daysInSelectedMonth = useMemo(() => {
    if (month === "ALL") return 31;
    return new Date(Number(year), Number(month), 0).getDate();
  }, [month, year]);

  const filteredRecords = useMemo(() => {
    return mockRecords.filter((record) => {
      const recordYear = record.date.slice(0, 4);
      const recordMonth = record.date.slice(5, 7);
      const recordDay = Number(record.date.slice(8, 10));

      if (year !== "ALL" && recordYear !== year) return false;
      if (month !== "ALL" && recordMonth !== month) return false;
      if (days.length > 0 && !days.includes(recordDay)) return false;
      if (fromDate && record.date < fromDate) return false;
      if (toDate && record.date > toDate) return false;
      if (!selectedPlants.includes(record.plant)) return false;
      if (!selectedCategories.includes(record.category)) return false;
      if (selectedCement && record.cementCode !== selectedCement) return false;

      return true;
    });
  }, [year, month, days, fromDate, toDate, selectedPlants, selectedCategories, selectedCement]);

  const summaryRows = useMemo(() => {
    const map = new Map<string, { plant: string; category: Category; volume: number }>();

    filteredRecords.forEach((record) => {
      const key = `${record.plant}|${record.category}`;
      const current = map.get(key);
      if (current) {
        current.volume += record.volume;
      } else {
        map.set(key, {
          plant: record.plant,
          category: record.category,
          volume: record.volume,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.volume - a.volume);
  }, [filteredRecords]);

  const salesTotal = useMemo(
    () => filteredRecords.filter((record) => record.category === "SALES").reduce((sum, record) => sum + record.volume, 0),
    [filteredRecords],
  );

  const transferTotal = useMemo(
    () => filteredRecords.filter((record) => record.category === "TRANSFER").reduce((sum, record) => sum + record.volume, 0),
    [filteredRecords],
  );

  const totalVolume = salesTotal + transferTotal;
  const activePlantCount = new Set(filteredRecords.map((record) => record.plant)).size;

  const chartData = summaryRows.map((row) => ({
    label: `${row.plant} · ${row.category}`,
    plant: row.plant,
    category: row.category,
    volume: Number(row.volume.toFixed(2)),
  }));

  const visiblePlants = plants.filter((plant) => plant.toLowerCase().includes(plantSearch.toLowerCase()));
  const visibleCements = cementCatalog.filter((cement) =>
    `${cement.code} ${cement.name}`.toLowerCase().includes(cementSearch.toLowerCase()),
  );

  function resetFilters() {
    setYear("2026");
    setMonth("09");
    setDays([]);
    setFromDate("");
    setToDate("");
    setSelectedPlants([...plants]);
    setSelectedCategories(["SALES", "TRANSFER"]);
    setSelectedCement(null);
    setCementSearch("");
    setPlantSearch("");
  }

  function toggleDay(day: number) {
    setDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort((a, b) => a - b),
    );
  }

  function togglePlant(plant: string) {
    setSelectedPlants((current) =>
      current.includes(plant) ? current.filter((item) => item !== plant) : [...current, plant],
    );
  }

  function toggleCategory(category: Category) {
    setSelectedCategories((current) => {
      if (current.includes(category)) return current.filter((item) => item !== category);
      return [...current, category];
    });
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">OPERATIONS ANALYTICS</div>
          <h1>Bulk Dashboard</h1>
          <p>Monitoring volume semen berdasarkan plant, kategori, tanggal, dan jenis cement.</p>
        </div>
        <div className="topbar-actions">
          <button className="button secondary" onClick={resetFilters}>
            <RefreshCcw size={16} /> Reset
          </button>
          <button className="button primary" onClick={() => downloadCsv(summaryRows)}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </header>

      <section className="kpi-grid">
        <article className="kpi-card">
          <div className="kpi-icon blue"><TrendingUp size={19} /></div>
          <div>
            <span>Total Volume</span>
            <strong>{formatNumber(totalVolume)} Ton</strong>
          </div>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon green"><TrendingUp size={19} /></div>
          <div>
            <span>Sales</span>
            <strong>{formatNumber(salesTotal)} Ton</strong>
          </div>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon orange"><Factory size={19} /></div>
          <div>
            <span>Transfer</span>
            <strong>{formatNumber(transferTotal)} Ton</strong>
          </div>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon purple"><Factory size={19} /></div>
          <div>
            <span>Active Plants</span>
            <strong>{activePlantCount}</strong>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <aside className="filter-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title"><Filter size={18} /> Filter</div>
              <span className="panel-subtitle">Atur data yang ingin ditampilkan</span>
            </div>
          </div>

          <FilterSection title="Tanggal" icon={<CalendarDays size={15} />}>
            <label className="field-label">Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="select-input">
              <option value="ALL">All Years</option>
              {availableYears.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>

            <label className="field-label">Month</label>
            <select value={month} onChange={(e) => { setMonth(e.target.value); setDays([]); }} className="select-input">
              <option value="ALL">All Months</option>
              {months.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
            </select>

            <div className="date-row">
              <div>
                <label className="field-label">From</label>
                <input className="date-input" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div>
                <label className="field-label">To</label>
                <input className="date-input" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>

            <div className="field-label-row">
              <label className="field-label">Coding DD</label>
              {days.length > 0 && <button className="link-button" onClick={() => setDays([])}>Clear</button>}
            </div>
            <div className="day-grid">
              {Array.from({ length: daysInSelectedMonth }, (_, index) => index + 1).map((day) => (
                <button
                  key={day}
                  className={`day-button ${days.includes(day) ? "active" : ""}`}
                  onClick={() => toggleDay(day)}
                >
                  {String(day).padStart(2, "0")}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Category">
            <div className="toggle-grid">
              {(["SALES", "TRANSFER"] as Category[]).map((category) => (
                <button
                  key={category}
                  className={`toggle-button ${selectedCategories.includes(category) ? "active" : ""}`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Plant">
            <div className="search-field">
              <Search size={15} />
              <input value={plantSearch} onChange={(e) => setPlantSearch(e.target.value)} placeholder="Search plant..." />
            </div>
            <div className="list-box compact-list">
              {visiblePlants.map((plant) => (
                <button
                  key={plant}
                  className={`list-item ${selectedPlants.includes(plant) ? "selected" : ""}`}
                  onClick={() => togglePlant(plant)}
                >
                  <span className="check-mark">{selectedPlants.includes(plant) ? "✓" : ""}</span>
                  <span>{plant}</span>
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Cement">
            <div className="search-field">
              <Search size={15} />
              <input value={cementSearch} onChange={(e) => setCementSearch(e.target.value)} placeholder="Search cement code/name..." />
            </div>
            <button className={`all-cement ${selectedCement === null ? "active" : ""}`} onClick={() => setSelectedCement(null)}>
              All Cement
            </button>
            <div className="list-box cement-list">
              {visibleCements.map((cement) => (
                <button
                  key={cement.code}
                  className={`cement-item ${selectedCement === cement.code ? "active" : ""}`}
                  onClick={() => setSelectedCement(cement.code)}
                >
                  <span className="cement-code">{cement.code}</span>
                  <span>{cement.name}</span>
                </button>
              ))}
            </div>
          </FilterSection>
        </aside>

        <section className="content-panel">
          <div className="panel-heading chart-heading">
            <div>
              <h2>Volume by Plant &amp; Category</h2>
              <span className="panel-subtitle">Hasil agregasi sesuai filter aktif</span>
            </div>
            <div className="filter-summary">
              <span>{selectedCategories.length} categories</span>
              <span>{selectedPlants.length} plants</span>
              <span>{selectedCement ? `Cement: ${selectedCement}` : "All cement"}</span>
            </div>
          </div>

          <div className="chart-card">
            {chartData.length > 0 ? (
              <VolumeChart data={chartData} />
            ) : (
              <div className="empty-state">Tidak ada data untuk kombinasi filter tersebut.</div>
            )}
          </div>

          <div className="summary-card">
            <div className="panel-heading summary-heading">
              <div>
                <h2>Summary</h2>
                <span className="panel-subtitle">Plant, category, dan total volume</span>
              </div>
              <span className="record-count">{filteredRecords.length.toLocaleString("id-ID")} records</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Plant</th>
                    <th>Category</th>
                    <th className="number-cell">Volume (Ton)</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((row) => (
                    <tr key={`${row.plant}-${row.category}`}>
                      <td>{row.plant}</td>
                      <td><span className={`category-badge ${row.category.toLowerCase()}`}>{row.category}</span></td>
                      <td className="number-cell">{formatNumber(row.volume)}</td>
                    </tr>
                  ))}
                  <tr className="grand-total-row">
                    <td colSpan={2}>Grand Total</td>
                    <td className="number-cell">{formatNumber(totalVolume)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>

      <footer className="footer-note">
        {/* <span>Prototype data mengikuti angka agregat pada screenshot referensi.</span>
        <span>Ganti <code>lib/data.ts</code> saat sudah mendapat source data asli.</span> */}
      </footer>
    </main>
  );
}

function FilterSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="filter-section">
      <div className="filter-section-title">{icon}{title}<ChevronDown size={14} /></div>
      <div className="filter-section-content">{children}</div>
    </section>
  );
}
