/** POST /auth/login response.  */
export interface LoginResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    accessToken: string;
    refreshToken: string;
}

/** Get /auth/me response.  */
export interface AuthMeResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

/** POST /auth/refresh response.  */
export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}