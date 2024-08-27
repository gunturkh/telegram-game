/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

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

type DailyComboReward = {
  correct_combo: number;
  bonus_coins: number;
  is_submitted: boolean;
  remain_seconds: number;
};
// setPoints: (point: number) =>
//   set((state: { points: number }) => {
//     return {
//       points: state.points + point,
//     };
//   }),
export const usePlayerStore = create<any, any>(
  // persist(
  (set) => ({
    energy: 0,
    setEnergy: (energy: number) => set(() => ({ energy })),
    taps: 0,
    setTaps: (taps: number) =>
      set((state: { taps: number }) => ({ taps: state.taps + taps })),
    resetTaps: () => set(() => ({ taps: 0 })),
    clicks: [],
    setClicks: (clicks: { id: number; x: number; y: number }[]) =>
      set((state: { clicks: { id: number; x: number; y: number }[] }) => ({
        clicks: [...state.clicks, clicks],
      })),
    setClicksWhenAnimationEnd: (
      clicks: { id: number; x: number; y: number }[]
    ) =>
      set(() => ({
        clicks,
      })),
    resetClicks: () => set(() => ({ clicks: [] })),
    passiveEarning: 0,
    setPassiveEarning: (data: number) => set(() => ({ passiveEarning: data })),
    passiveEarnModal: false,
    setPassiveEarnModal: (data: boolean) =>
      set(() => ({ passiveEarnModal: data })),
    dailyCombo: [null, null, null, null],
    dailyComboReward: {
      correct_combo: 0,
      bonus_coins: 0,
      is_submitted: false,
      remain_seconds: 0,
    },
    setDailyComboReward: (data: DailyComboReward) =>
      set(() => ({ dailyComboReward: data })),
    dailyComboRewardModal: false,
    setDailyComboRewardModal: (data: boolean) =>
      set(() => ({ dailyComboRewardModal: data })),
    comboSubmitted: false,
    addValue: (value: number) =>
      set((state: any) => {
        if (
          state.dailyCombo.includes(value) || // Prevent duplicates
          state.dailyCombo.filter((item: number) => item !== null).length >= 4 // Check if already at max length
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
    resetDailyCombo: () =>
      set(() => ({ dailyCombo: [null, null, null, null] })),
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
    setInitialEnergy: (energy: number) => set(() => ({ energy: energy })),
  })
  // {
  //   name: "player-storage", // name of the item in the storage (must be unique)
  //   storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  // }
  // )
);
