import { LoginResponseType } from "~/types/login/loginResponseType";
import { apiSlice } from "../api/apiSlice";
import { setAuth } from "./authSlice";
import { LoginPropsType } from "~/types/login/loginPropsType";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addForgotPassword: builder.mutation({
            query: (data) => ({
                url: "/accounts/user/forgot-password/",
                method: "POST",
                body: data,
            }),
        }),
        addConfirmPassword: builder.mutation({
            query: ({ data, uidb64, token }) => ({
                url: `/accounts/user/reset-password/${uidb64}/${token}/`,
                method: "POST",
                body: data,
            }),
        }),

        addRegister: builder.mutation({
            query: (data) => ({
                url: "/accounts/user/register/",
                method: "POST",
                body: data,
            }),
        }),
        addLogin: builder.mutation<LoginResponseType, LoginPropsType>({
            query: (data) => ({
                url: "/accounts/user/login/",
                method: "POST",
                body: data,
            }),
            async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    const authData = {
                        user: data.data.user,
                        tokens: {
                            access_token: data.data.tokens.access_token,
                            refresh_token: data.data.tokens.refresh_token,
                        },
                    };
                    dispatch(setAuth(authData));
                } catch (err: any) {
                    const errorMsg = err?.error?.data?.message || "Login failed!";
                    console.error("Login time error:", errorMsg);
                }
            },
        }),
    }),
});

export const { useAddRegisterMutation, useAddLoginMutation, useAddForgotPasswordMutation, useAddConfirmPasswordMutation } = authApi;
