import { create } from "zustand";

type StoreDashboardState = {
  activeDashboard: string;
  updateActiveDashboard: ({ uuid }: { uuid: string }) => void;
};

export const useDashboardState = create<StoreDashboardState>()((set) => ({
  activeDashboard: "",
  updateActiveDashboard: ({ uuid }: { uuid: string }) =>
    set(() => ({ activeDashboard: uuid })),
}));
