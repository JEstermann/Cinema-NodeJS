import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    children: ReactNode;
}) {
    const base =
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cinema-accent/60 disabled:opacity-40 disabled:pointer-events-none";
    const styles = {
        primary: "bg-cinema-accent text-cinema-950 hover:bg-amber-400 shadow-glow",
        secondary: "bg-cinema-800 text-stone-100 border border-cinema-700 hover:bg-cinema-700",
        danger: "bg-red-900/80 text-red-100 border border-red-800 hover:bg-red-800",
        ghost: "bg-transparent text-stone-300 hover:bg-cinema-800/80 border border-transparent"
    };
    return (
        <button type="button" className={`${base} ${styles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
    return (
        <section className="rounded-2xl border border-cinema-800 bg-cinema-900/60 p-5 shadow-xl backdrop-blur-sm">
            {title ? <h2 className="font-display text-lg font-semibold text-amber-100/95 mb-4">{title}</h2> : null}
            {children}
        </section>
    );
}

export function Field({
    label,
    ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</span>
            <input
                className="w-full rounded-lg border border-cinema-700 bg-cinema-950 px-3 py-2 text-sm text-stone-100 placeholder:text-stone-600 focus:border-cinema-accent focus:ring-1 focus:ring-cinema-accent"
                {...inputProps}
            />
        </label>
    );
}

export function Alert({ type, children }: { type: "success" | "error" | "info"; children: ReactNode }) {
    const map = {
        success: "border-emerald-800/80 bg-emerald-950/40 text-emerald-200",
        error: "border-red-900/80 bg-red-950/40 text-red-200",
        info: "border-cinema-700 bg-cinema-950/50 text-stone-300"
    };
    return <div className={`rounded-lg border px-3 py-2 text-sm ${map[type]}`}>{children}</div>;
}
