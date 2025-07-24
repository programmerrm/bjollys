import { AuthUserType } from "../user/authUserType";

export interface AuthStatePropsType {
    user: AuthUserType | null,
    tokens: {
        access_token: string | null;
        refresh_token: string | null;
    },
};
