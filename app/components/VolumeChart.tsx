"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function compactNumber(value: number) {
  return value.toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  });
}

type ChartPoint = {
  label: string;
  plant: string;
  category: string;
  volume: number;
};

export default function VolumeChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={430}>
      <BarChart
        data={data}
        margin={{ top: 34, right: 18, left: 8, bottom: 78 }}
        barCategoryGap={22}
      >
        <CartesianGrid vertical={false} stroke="#e4e9ef" />
        <XAxis
          dataKey="label"
          angle={-30}
          textAnchor="end"
          interval={0}
          height={80}
          tick={{ fontSize: 11, fill: "#5f6b7a" }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#5f6b7a" }}
          tickFormatter={(value) =>
            Number(value).toLocaleString("id-ID", {
              notation: "compact",
              maximumFractionDigits: 1,
            })
          }
          width={54}
        />
        <Tooltip
          formatter={(value: unknown) => [compactNumber(Number(value)) + " Ton", "Volume"]}
          labelFormatter={(label) => String(label)}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #dbe2ea",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
          }}
        />
        <Bar dataKey="volume" fill="#5b9bd5" radius={[7, 7, 0, 0]}>
          <LabelList
            dataKey="volume"
            position="top"
            formatter={(value: unknown) => compactNumber(Number(value))}
            fill="#465161"
            fontSize={10}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
