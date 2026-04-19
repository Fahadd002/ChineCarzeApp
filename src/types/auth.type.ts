export interface ILoginResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: {
        needPasswordChange: string;
        name: string;
        email: string;
        role: string;
        image: string;
        isDeleted: boolean;
        emailVerified: boolean;
    }
}