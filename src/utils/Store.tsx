import { StoreApi, create } from 'zustand';

interface UserState {
    user: null | any;
    setUser: (value: any) => void;
}

export const useUserStore = create<UserState>((set: StoreApi<UserState>['setState']) => ({
    user: null,
    setUser: (value: any) => set(() => ({ user: value })),
}));