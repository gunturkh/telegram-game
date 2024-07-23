/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface IPlayerData {
    telegram_id: number
    first_name: string
    last_name: string
    username: string
    role: string
    iat: number
    exp: number
    point: number
    profit_per_hour: number
}
export const usePlayerStore = create<any,any>(
    persist((set) => ({
        playerData: null,
        setPlayerData: (data: IPlayerData) => set(() => ({ playerData: data })),
    }),
        {
            name: 'player-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ))