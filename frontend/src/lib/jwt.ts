export type JwtPayload = {
    userId?: number;
    role?: string;
};

export function decodeJwtPayload(token: string): JwtPayload | null {
    try {
        const part = token.split(".")[1];
        if (!part) return null;
        const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
}

export function isAdminRole(role: string | undefined): boolean {
    return role === "ADMIN" || role === "SUPER_ADMIN";
}
