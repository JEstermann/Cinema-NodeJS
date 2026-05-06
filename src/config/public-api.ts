
export function getPublicApiBaseUrl(): string {
    const explicit = process.env.PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");
    if (explicit) return explicit;
    const host = process.env.API_PUBLIC_HOST ?? "165.232.75.132";
    const port = String(process.env.APP_PORT ?? "3000");
    return `http://${host}:${port}`;
}
