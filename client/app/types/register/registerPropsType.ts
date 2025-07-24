export interface RegisterPropsType {
    name: string;
    email: string;
    number: string;
    country: string;
    gender: "male" | "female" | "other";
    date_of_birth: string;
    password: string;
    confirm_password: string;
    signature: string;
    terms_accepted: boolean;
    role: "crypto" | "e-commerce";
    local_ip?: string;
}
