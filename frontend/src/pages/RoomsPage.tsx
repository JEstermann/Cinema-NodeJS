import { useCallback, useEffect, useState, type FormEvent } from "react";
import { apiFetch, readError } from "../api/client.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { Button, Card, Field, Alert } from "../components/ui.tsx";

type Room = {
    id: number;
    name: string;
    description?: string;
    images?: string[];
    type?: string;
    capacity?: number;
    isAccessible?: boolean;
    isMaintenance?: boolean;
};

type ListRoomsResponse = {
    data: Room[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};

export function RoomsPage() {
    const { isAdmin } = useAuth();
    const [list, setList] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("Salle Zenith");
    const [description, setDescription] = useState("Une belle salle pour démo du projet cinéma avec tout confort.");
    const [images, setImages] = useState("https://picsum.photos/seed/cinema-room/800/500");
    const [type, setType] = useState("Standard");
    const [capacity, setCapacity] = useState("20");

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiFetch("/rooms?page=1&size=50");
            if (!res.ok) throw new Error(await readError(res));
            const body = (await res.json()) as ListRoomsResponse;
            setList(body.data ?? []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erreur");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    async function createRoom(e: FormEvent) {
        e.preventDefault();
        setError(null);
        const imgs = images.split(",").map((s) => s.trim()).filter(Boolean);
        const res = await apiFetch("/rooms", {
            method: "POST",
            body: JSON.stringify({
                name,
                description,
                images: imgs.length ? imgs : ["https://picsum.photos/800/500"],
                type,
                capacity: Number(capacity),
                isAccessible: false,
                isMaintenance: false
            })
        });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        await load();
    }

    async function deleteRoom(id: number) {
        if (!confirm("Supprimer cette salle ?")) return;
        const res = await apiFetch(`/rooms/${id}`, { method: "DELETE" });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        await load();
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <header>
                <h1 className="font-display text-3xl font-bold text-stone-100">Salles</h1>
                <p className="mt-1 text-sm text-stone-500">Liste publique authentifiée · création réservée aux admins</p>
            </header>

            {error ? <Alert type="error">{error}</Alert> : null}

            {isAdmin ? (
                <Card title="Créer une salle (admin)">
                    <form className="grid gap-4 md:grid-cols-2" onSubmit={createRoom}>
                        <Field label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
                        <Field label="Capacité (15–30)" type="number" min={15} max={30} value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                        <Field label="Type" value={type} onChange={(e) => setType(e.target.value)} required />
                        <Field
                            label="Images (URLs séparées par virgule)"
                            value={images}
                            onChange={(e) => setImages(e.target.value)}
                            placeholder="https://..."
                        />
                        <div className="md:col-span-2">
                            <label className="block space-y-1.5">
                                <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Description</span>
                                <textarea
                                    className="w-full rounded-lg border border-cinema-700 bg-cinema-950 px-3 py-2 text-sm text-stone-100 min-h-[88px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    minLength={10}
                                />
                            </label>
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit">Créer</Button>
                        </div>
                    </form>
                </Card>
            ) : null}

            <Card title={loading ? "Chargement…" : `${list.length} salle(s)`}>
                <ul className="grid gap-4 md:grid-cols-2">
                    {list.map((r) => (
                        <li key={r.id} className="rounded-xl border border-cinema-800 bg-cinema-950/40 p-4">
                            <div className="flex justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-amber-200">{r.name}</p>
                                    <p className="text-xs text-stone-500 mt-1">
                                        #{r.id} · cap. {r.capacity ?? "?"} · {r.type ?? "—"}
                                    </p>
                                    {r.isMaintenance ? (
                                        <span className="mt-2 inline-block rounded bg-amber-900/40 px-2 py-0.5 text-[10px] text-amber-200">
                                            Maintenance
                                        </span>
                                    ) : null}
                                </div>
                                {isAdmin ? (
                                    <Button variant="danger" className="shrink-0 h-8 px-2 text-xs" onClick={() => void deleteRoom(r.id)}>
                                        Supprimer
                                    </Button>
                                ) : null}
                            </div>
                            {r.description ? <p className="mt-2 text-sm text-stone-400 line-clamp-3">{r.description}</p> : null}
                        </li>
                    ))}
                </ul>
                {!loading && list.length === 0 ? <p className="text-sm text-stone-500">Aucune salle.</p> : null}
            </Card>
        </div>
    );
}
