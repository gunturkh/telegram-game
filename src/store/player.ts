/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IPlayerData {
  telegram_id: number;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
  point: number;
  profit_per_hour: number;
}
export const usePlayerStore = create<any, any>(
  persist(
    (set) => ({
      passiveEarning: 0,
      setPassiveEarning: (data: number) =>
        set(() => ({ passiveEarning: data })),
      passiveEarnModal: false,
      setPassiveEarnModal: (data: boolean) =>
        set(() => ({ passiveEarnModal: data })),
      dailyCombo: [],
      setDailyCombo: (data: number) =>
        set((state: { dailyCombo: number[] }) => ({
          dailyCombo: [...state.dailyCombo, data],
        })),
      playerData: null,
      setPlayerData: (data: IPlayerData) => set(() => ({ playerData: data })),
      points: 0,
      setInitialPoints: (point: number) => set(() => ({ points: point })),
      setPoints: (point: number) =>
        set((state: { points: number }) => {
          return {
            points: state.points + point,
          };
        }),
      energy: 0,
      setInitialEnergy: (energy: number) => set(() => ({ energy: energy })),
    }),
    {
      name: "player-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
