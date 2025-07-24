import { useSelector } from "react-redux"
import type { RootState } from "~/redux/store"

export const useAuth = (): boolean => {
    const { user, tokens } = useSelector((state: RootState) => state.auth);
    return Boolean(user && tokens?.access_token);
}
