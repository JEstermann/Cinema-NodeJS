import { useCallback, useEffect, useState, type FormEvent } from "react";
import { apiFetch, readError } from "../api/client.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { Button, Card, Field, Alert } from "../components/ui.tsx";

type Movie = {
    id: number;
    title: string;
    description?: string;
    durationInMinutes: number;
};

type ListMoviesResponse = {
    data: Movie[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};

export function MoviesPage() {
    const { isAdmin } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("La Grande Aventure");
    const [description, setDescription] = useState("Film de démo pour tester les séances.");
    const [duration, setDuration] = useState("105");

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiFetch("/movies?page=1&size=50");
            if (!res.ok) throw new Error(await readError(res));
            const body = (await res.json()) as ListMoviesResponse;
            setMovies(body.data ?? []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erreur");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    async function createMovie(e: FormEvent) {
        e.preventDefault();
        const res = await apiFetch("/movies", {
            method: "POST",
            body: JSON.stringify({
                title,
                description,
                durationInMinutes: Number(duration)
            })
        });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        await load();
    }

    async function deleteMovie(id: number) {
        if (!confirm("Supprimer ce film ?")) return;
        const res = await apiFetch(`/movies/${id}`, { method: "DELETE" });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        await load();
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <header>
                <h1 className="font-display text-3xl font-bold text-stone-100">Films</h1>
            </header>

            {error ? <Alert type="error">{error}</Alert> : null}

            {isAdmin ? (
                <Card title="Ajouter un film (admin)">
                    <form className="grid gap-4 md:grid-cols-2" onSubmit={createMovie}>
                        <Field label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <Field label="Durée (minutes)" type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} required />
                        <div className="md:col-span-2">
                            <label className="block space-y-1.5">
                                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Description</span>
                                <textarea
                                    className="w-full rounded-lg border border-cinema-700 bg-cinema-950 px-3 py-2 text-sm min-h-[72px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </label>
                        </div>
                        <Button type="submit">Créer</Button>
                    </form>
                </Card>
            ) : null}

            <Card title={loading ? "…" : "Catalogue"}>
                <ul className="space-y-3">
                    {movies.map((m) => (
                        <li key={m.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-cinema-800 bg-cinema-950/40 p-4">
                            <div>
                                <p className="font-medium text-amber-100">{m.title}</p>
                                <p className="text-xs text-stone-500 mt-1">
                                    #{m.id} · {m.durationInMinutes} min
                                </p>
                                {m.description ? <p className="mt-2 text-sm text-stone-400">{m.description}</p> : null}
                            </div>
                            {isAdmin ? (
                                <Button variant="danger" className="h-8 text-xs" onClick={() => void deleteMovie(m.id)}>
                                    Supprimer
                                </Button>
                            ) : null}
                        </li>
                    ))}
                </ul>
                {!loading && movies.length === 0 ? <p className="text-sm text-stone-500">Aucun film.</p> : null}
            </Card>
        </div>
    );
}
