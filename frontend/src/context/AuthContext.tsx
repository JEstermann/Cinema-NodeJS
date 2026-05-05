import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";
import { apiFetch, readError } from "../api/client";
import { decodeJwtPayload, isAdminRole } from "../lib/jwt";

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    role: string | undefined;
    userId: number | undefined;
    emailHint: string | undefined;
};

type AuthContextValue = AuthState & {
    isAuthenticated: boolean;
    isAdmin: boolean;
    setSession: (accessToken: string, refreshToken: string) => void;
    logout: () => Promise<void>;
    refreshTokensFromStorage: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loadFromStorage(): AuthState {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const payload = accessToken ? decodeJwtPayload(accessToken) : null;
    const emailHint = localStorage.getItem("cinemaEmailHint") ?? undefined;
    return {
        accessToken,
        refreshToken,
        role: payload?.role,
        userId: payload?.userId,
        emailHint
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>(() => loadFromStorage());

    const refreshTokensFromStorage = useCallback(() => {
        setState(loadFromStorage());
    }, []);

    useEffect(() => {
        const handler = () => refreshTokensFromStorage();
        window.addEventListener("cinema-token-updated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("cinema-token-updated", handler);
            window.removeEventListener("storage", handler);
        };
    }, [refreshTokensFromStorage]);

    const setSession = useCallback((accessToken: string, refreshToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        const payload = decodeJwtPayload(accessToken);
        setState({
            accessToken,
            refreshToken,
            role: payload?.role,
            userId: payload?.userId,
            emailHint: localStorage.getItem("cinemaEmailHint") ?? undefined
        });
    }, []);

    const logout = useCallback(async () => {
        const rt = localStorage.getItem("refreshToken");
        if (rt) {
            try {
                await apiFetch("/auth/logout", {
                    method: "POST",
                    body: JSON.stringify({ refreshToken: rt })
                });
            } catch {
                /* ignore */
            }
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setState({
            accessToken: null,
            refreshToken: null,
            role: undefined,
            userId: undefined,
            emailHint: localStorage.getItem("cinemaEmailHint") ?? undefined
        });
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            ...state,
            isAuthenticated: Boolean(state.accessToken && state.refreshToken),
            isAdmin: isAdminRole(state.role),
            setSession,
            logout,
            refreshTokensFromStorage
        }),
        [state, setSession, logout, refreshTokensFromStorage]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
    return ctx;
}

export async function loginRequest(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const res = await fetch(`${(import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "")}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error(await readError(res));
    return res.json() as Promise<{ accessToken: string; refreshToken: string }>;
}

export async function signupRequest(email: string, password: string): Promise<void> {
    const res = await fetch(`${(import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "")}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const err = await readError(res);
        throw new Error(err);
    }
}
