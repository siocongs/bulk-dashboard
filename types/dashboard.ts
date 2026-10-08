export type Category = "SALES" | "TRANSFER";

export type VolumeRecord = {
  date: string;
  plant: string;
  category: Category;
  cementCode: string;
  cementName: string;
  volume: number;
};
