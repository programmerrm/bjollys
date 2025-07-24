import { ReactElement, ReactNode } from "react";

export interface FieldPropsType {
    label?: string | ReactNode;
    children: ReactElement<{ id?: string }>;
    htmlFor?: string;
    error?: { message?: string };
};
