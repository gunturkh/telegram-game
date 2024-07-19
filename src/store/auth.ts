/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface IUserData {
    telegramId: number
    first_name: string
    last_name: string
    username: string
}
export const useAuthStore = create<any,any>(
    persist((set) => ({
        token: '',
        data: null,
        setAuthToken: (data: string) => set(() => ({ token: data })),
        setAuthData: (data: IUserData) => set(() => ({ data: data })),
        removeAuthToken: () => set({ token: '' }),
    }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ))