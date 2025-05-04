export interface AdminUser {
    uid: number;
    username: string;
    email: string;
    postCount: number;
    followerCount: number;
    role: 0 | 1;
}
