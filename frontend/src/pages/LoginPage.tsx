import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { loginRequest, signupRequest, useAuth } from "../context/AuthContext.tsx";
import { Button, Card, Field, Alert } from "../components/ui.tsx";

export function LoginPage() {
    const { isAuthenticated, setSession } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/salles" replace />;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setMsg(null);
        setLoading(true);
        try {
            if (mode === "signup") {
                await signupRequest(email, password);
                localStorage.setItem("cinemaEmailHint", email);
                setMsg({ type: "success", text: "Compte créé. Connectez-vous." });
                setMode("login");
            } else {
                const tokens = await loginRequest(email, password);
                localStorage.setItem("cinemaEmailHint", email);
                setSession(tokens.accessToken, tokens.refreshToken);
                navigate("/salles");
            }
        } catch (err) {
            setMsg({ type: "error", text: err instanceof Error ? err.message : "Erreur" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <header className="text-center">
                    <h1 className="font-display text-4xl font-bold text-amber-400">Zenith Cinéma</h1>
                </header>

                <Card title={mode === "login" ? "Connexion" : "Inscription"}>
                    <div className="mb-4 flex rounded-lg bg-cinema-950 p-1">
                        <button
                            type="button"
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                                mode === "login" ? "bg-cinema-800 text-amber-200" : "text-stone-500"
                            }`}
                            onClick={() => setMode("login")}
                        >
                            Connexion
                        </button>
                        <button
                            type="button"
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                                mode === "signup" ? "bg-cinema-800 text-amber-200" : "text-stone-500"
                            }`}
                            onClick={() => setMode("signup")}
                        >
                            Inscription
                        </button>
                    </div>

                    {msg ? (
                        <div className="mb-4">
                            <Alert type={msg.type}>{msg.text}</Alert>
                        </div>
                    ) : null}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Field
                            label="Mot de passe (min. 8 caractères)"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Patientez…" : mode === "login" ? "Se connecter" : "Créer un compte"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
