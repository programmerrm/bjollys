import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "~/redux/features/auth/authSlice";

export const useAuthCheck = (): boolean => {
    const [authChecked, setAuthChecked] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            const localAuth = JSON.parse(localStorage.getItem("auth") || "{}");
            if (localAuth?.admin && localAuth?.tokens?.access_token) {
                dispatch(setAuth(localAuth));
            }
        } catch (error) {
            console.error("Failed to parse auth data:", error);
        } finally {
            setAuthChecked(true);
        }
    }, [dispatch]);

    return authChecked;
}
