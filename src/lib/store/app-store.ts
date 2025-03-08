import { create } from 'zustand'
import { Bus } from '../types/bus.type'
import { User } from '../types/user.type'

interface AppStore {
    user: User | null
    setUser: (user: User) => void
    selectedBus: Bus | null
    setSelectedBus: (bus: Bus) => void
}

const useAppStore = create<AppStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    selectedBus: null,
    setSelectedBus: (bus) => set({ selectedBus: bus })
}))

export default useAppStore
