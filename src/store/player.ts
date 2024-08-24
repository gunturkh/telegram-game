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
      dailyCombo: [null, null, null],
      comboSubmitted: false,
      addValue: (value: number) =>
        set((state: any) => {
          if (
            state.dailyCombo.includes(value) || // Prevent duplicates
            state.dailyCombo.filter((item: number) => item !== null).length >= 3 // Check if already at max length
          ) {
            return state;
          }

          const updatedCombo = [...state.dailyCombo];
          const firstNullIndex = updatedCombo.indexOf(null);

          if (firstNullIndex !== -1) {
            updatedCombo[firstNullIndex] = value;
          } else {
            updatedCombo.push(value); // This line should never be reached due to the max 3 check.
          }

          return { dailyCombo: updatedCombo };
        }),

      removeValue: (value: number) =>
        set((state: any) => {
          const updatedCombo = state.dailyCombo.map((item: number) =>
            item === value ? null : item
          );

          return { dailyCombo: updatedCombo };
        }),

      updateNull: (newValue: number) =>
        set((state: any) => {
          if (state.dailyCombo.includes(newValue)) return state; // Prevent duplicates

          const updatedCombo = [...state.dailyCombo];
          const nullIndex = updatedCombo.indexOf(null);

          if (nullIndex !== -1) {
            updatedCombo[nullIndex] = newValue;
          }

          return { dailyCombo: updatedCombo };
        }),
      resetDailyCombo: () => set(() => ({ dailyCombo: [null, null, null] })),
      setComboSubmitted: (data: boolean) => set(() => ({ comboSubmitted: data })),
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
