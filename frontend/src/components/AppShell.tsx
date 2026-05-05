import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { Button } from "./ui.tsx";

const links = [
    { to: "/salles", label: "Salles" },
    { to: "/movies", label: "Films" },
    { to: "/seances", label: "Séances" },
    { to: "/wallet", label: "Portefeuille" },
    { to: "/billets", label: "Billets" }
];

export function ProtectedShell() {
    const { isAuthenticated, logout, role, emailHint } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="border-b border-cinema-800 bg-cinema-900/90 md:w-56 md:border-b-0 md:border-r md:min-h-screen">
                <div className="p-5">
                    <p className="font-display text-xl font-bold tracking-tight text-amber-400">Zenith Cinéma</p>
                    {emailHint ? (
                        <p className="mt-3 truncate text-xs text-stone-400" title={emailHint}>
                            {emailHint}
                        </p>
                    ) : null}
                    <p className="text-[10px] uppercase tracking-wider text-stone-600 mt-1">{role ?? "—"}</p>
                </div>
                <nav className="flex flex-wrap gap-1 px-3 pb-4 md:flex-col md:px-2">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `rounded-lg px-3 py-2 text-sm transition md:w-full ${
                                    isActive
                                        ? "bg-cinema-accent/15 text-amber-300 font-medium border border-cinema-accent/30"
                                        : "text-stone-400 hover:bg-cinema-800/50 hover:text-stone-200"
                                }`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="hidden px-3 pb-6 md:block">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => void logout()}>
                        Déconnexion
                    </Button>
                </div>
            </aside>
            <main className="flex-1 p-6 md:p-10">
                <Outlet />
            </main>
            <div className="border-t border-cinema-800 p-4 md:hidden">
                <Button variant="secondary" className="w-full" onClick={() => void logout()}>
                    Déconnexion
                </Button>
            </div>
        </div>
    );
}
