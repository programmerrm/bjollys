type User = {
    id: number;
    image: string | null;
    name: string;
    email: string;
    role: string;
}

type Tokens = {
    access_token: string;
    refresh_token: string;
}

export interface LoginResponseType {
    data: {
        user: User,
        tokens: Tokens,
    },
};
