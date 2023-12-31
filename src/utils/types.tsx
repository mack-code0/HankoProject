export type User = {
    id: string
    name?: string
    email: string
    hankoId: string
    createdAt: string
};

export type note = {
    title: string
    note: string
    id: string
    favorite: boolean
    user: string
}