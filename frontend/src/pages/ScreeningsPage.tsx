import { useCallback, useEffect, useState, type FormEvent } from "react";
import { apiFetch, readError } from "../api/client.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { Button, Card, Field, Alert } from "../components/ui.tsx";

type Screening = {
    id: number;
    startAt: string;
    endAt: string;
    room?: { id: number; name?: string };
    movie?: { id: number; title?: string };
};

type ListScreeningsResponse = {
    data: Screening[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};

type RoomOpt = { id: number; name: string };
type MovieOpt = { id: number; title: string };

export function ScreeningsPage() {
    const { isAdmin } = useAuth();
    const [screenings, setScreenings] = useState<Screening[]>([]);
    const [rooms, setRooms] = useState<RoomOpt[]>([]);
    const [movies, setMovies] = useState<MovieOpt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [roomId, setRoomId] = useState("");
    const [movieId, setMovieId] = useState("");
    const [startAtLocal, setStartAtLocal] = useState("");

    const loadRefs = useCallback(async () => {
        try {
            const [rRes, mRes] = await Promise.all([
                apiFetch("/rooms?page=1&size=100"),
                apiFetch("/movies?page=1&size=100")
            ]);
            if (rRes.ok) {
                const rBody = (await rRes.json()) as { data: RoomOpt[] };
                setRooms(rBody.data ?? []);
            }
            if (mRes.ok) {
                const mBody = (await mRes.json()) as { data: MovieOpt[] };
                setMovies(mBody.data ?? []);
            }
        } catch {
            /* ignore */
        }
    }, []);

    const loadScreenings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiFetch("/screenings?page=1&size=100");
            if (!res.ok) throw new Error(await readError(res));
            const body = (await res.json()) as ListScreeningsResponse;
            setScreenings(body.data ?? []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erreur");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadRefs();
        void loadScreenings();
    }, [loadRefs, loadScreenings]);

    async function createScreening(e: FormEvent) {
        e.preventDefault();
        if (!startAtLocal) return;
        const iso = new Date(startAtLocal).toISOString();
        const res = await apiFetch("/screenings", {
            method: "POST",
            body: JSON.stringify({
                roomId: Number(roomId),
                movieId: Number(movieId),
                startAt: iso
            })
        });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        await loadScreenings();
    }

    async function deleteScreening(id: number) {
        if (!confirm("Supprimer cette séance ?")) return;
        const res = await apiFetch(`/screenings/${id}`, { method: "DELETE" });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        await loadScreenings();
    }

    useEffect(() => {
        if (rooms.length && !roomId) setRoomId(String(rooms[0].id));
        if (movies.length && !movieId) setMovieId(String(movies[0].id));
    }, [rooms, movies, roomId, movieId]);

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <header>
                <h1 className="font-display text-3xl font-bold text-stone-100">Séances</h1>
               
            </header>

            {error ? <Alert type="error">{error}</Alert> : null}

            {isAdmin ? (
                <Card title="Planifier une séance (admin)">
                    <form className="grid gap-4 md:grid-cols-2" onSubmit={createScreening}>
                        <label className="block space-y-1.5">
                            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Salle</span>
                            <select
                                className="w-full rounded-lg border border-cinema-700 bg-cinema-950 px-3 py-2 text-sm"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                required
                            >
                                {rooms.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block space-y-1.5">
                            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Film</span>
                            <select
                                className="w-full rounded-lg border border-cinema-700 bg-cinema-950 px-3 py-2 text-sm"
                                value={movieId}
                                onChange={(e) => setMovieId(e.target.value)}
                                required
                            >
                                {movies.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.title}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="md:col-span-2">
                            <Field
                                label="Début (local)"
                                type="datetime-local"
                                value={startAtLocal}
                                onChange={(e) => setStartAtLocal(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="md:col-span-2">
                            Créer la séance
                        </Button>
                    </form>
                </Card>
            ) : null}

            <Card title={loading ? "…" : "Planning"}>
                <ul className="space-y-3">
                    {screenings.map((s) => (
                        <li key={s.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-cinema-800 bg-cinema-950/40 p-4">
                            <div>
                                <p className="font-medium text-amber-100">{s.movie?.title ?? `Film #${s.movie?.id}`}</p>
                                <p className="text-sm text-stone-400 mt-1">{s.room?.name ?? `Salle #${s.room?.id}`}</p>
                                <p className="text-xs text-stone-500 mt-2 font-mono">
                                    {new Date(s.startAt).toLocaleString()} → {new Date(s.endAt).toLocaleString()}
                                </p>
                                <p className="text-[10px] text-stone-600 mt-1">id séance : {s.id}</p>
                            </div>
                            {isAdmin ? (
                                <Button variant="danger" className="h-8 text-xs shrink-0" onClick={() => void deleteScreening(s.id)}>
                                    Supprimer
                                </Button>
                            ) : null}
                        </li>
                    ))}
                </ul>
                {!loading && screenings.length === 0 ? <p className="text-sm text-stone-500">Aucune séance.</p> : null}
            </Card>
        </div>
    );
}
