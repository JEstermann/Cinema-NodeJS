const getApiBase = (): string => {
    const raw = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
    return raw.replace(/\/$/, "");
};

async function rawFetch(path: string, init?: RequestInit, accessToken?: string | null): Promise<Response> {
    const headers = new Headers(init?.headers);
    const body = init?.body;
    if (body && typeof body === "string" && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch(`${getApiBase()}${path}`, { ...init, headers });
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
    const token = localStorage.getItem("accessToken");
    let res = await rawFetch(path, init, token);

    const authRetry =
        (res.status === 401 || res.status === 403) &&
        !path.startsWith("/auth/") &&
        localStorage.getItem("refreshToken");

    if (authRetry) {
        const rt = localStorage.getItem("refreshToken")!;
        const refreshRes = await rawFetch(
            "/auth/refresh",
            {
                method: "POST",
                body: JSON.stringify({ refreshToken: rt })
            },
            null
        );
        if (refreshRes.ok) {
            const data = (await refreshRes.json()) as { accessToken?: string };
            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
                window.dispatchEvent(new Event("cinema-token-updated"));
                res = await rawFetch(path, init, data.accessToken);
            }
        }
    }

    return res;
}

export async function readError(res: Response): Promise<string> {
    try {
        const data = await res.json();
        if (typeof data === "object" && data !== null && "error" in data && typeof (data as { error: string }).error === "string") {
            return (data as { error: string }).error;
        }
        return JSON.stringify(data);
    } catch {
        return res.statusText || `Erreur ${res.status}`;
    }
}
