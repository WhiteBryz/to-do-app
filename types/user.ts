export type UserRole = 'worker' | 'admin' | 'master'

export interface GlobalUser {
    id: string;
    createdAt: string; // ISO string
    updatedAt: string;
    name?: string;
    email: string;
    userRole: UserRole;
}