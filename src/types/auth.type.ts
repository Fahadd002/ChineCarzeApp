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

export interface IRegisterResponse {
    success: boolean;
    message: string;
    user?: {
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
    }
}

export interface IVerifyEmailResponse {
    success: boolean;
    message: string;
    user?: {
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
    }
}

export interface IVerifyEmailResponse {
    success: boolean;
    message: string;
    user?: {
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
    }
}