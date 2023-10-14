import { StoreApi, create } from 'zustand';
import { User } from './types';

interface UserState {
    user: null | User;
    setUser: (value: any) => void;
}

export const useUserStore = create<UserState>((set: StoreApi<UserState>['setState']) => ({
    user: null,
    setUser: (value: any) => set(() => ({ user: value })),
}));