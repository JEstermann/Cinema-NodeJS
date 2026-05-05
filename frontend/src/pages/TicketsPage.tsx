import { useCallback, useEffect, useState, type FormEvent } from "react";
import { apiFetch, readError } from "../api/client.ts";
import { Button, Card, Field, Alert } from "../components/ui.tsx";

type ScreeningLite = { id: number; startAt: string; movie?: { title?: string }; room?: { name?: string } };

type TicketRow = {
    id: number;
    kind: "SIMPLE" | "SUPER";
    remainingCredits: number;
    pricePaid: number | string;
    screening?: { id: number } | null;
    createdAt?: string;
};

export function TicketsPage() {
    const [tickets, setTickets] = useState<TicketRow[]>([]);
    const [screenings, setScreenings] = useState<ScreeningLite[]>([]);
    const [screeningForBuy, setScreeningForBuy] = useState("");
    const [useTicketId, setUseTicketId] = useState("");
    const [useScreeningId, setUseScreeningId] = useState("");
    const [detailId, setDetailId] = useState("");
    const [detailJson, setDetailJson] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const loadTickets = useCallback(async () => {
        const res = await apiFetch("/tickets");
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        setTickets((await res.json()) as TicketRow[]);
    }, []);

    const loadScreenings = useCallback(async () => {
        const res = await apiFetch("/screenings?page=1&size=100");
        if (!res.ok) return;
        const body = (await res.json()) as { data: ScreeningLite[] };
        setScreenings(body.data ?? []);
    }, []);

    const refresh = useCallback(async () => {
        setError(null);
        await Promise.all([loadTickets(), loadScreenings()]);
    }, [loadTickets, loadScreenings]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    useEffect(() => {
        if (screenings.length === 0) return;
        setScreeningForBuy((prev) => prev || String(screenings[0].id));
        setUseScreeningId((prev) => prev || String(screenings[0].id));
    }, [screenings]);

    async function buySimple(e: FormEvent) {
        e.preventDefault();
        setInfo(null);
        const res = await apiFetch("/tickets/simple", {
            method: "POST",
            body: JSON.stringify({ screeningId: Number(screeningForBuy) })
        });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        setInfo("Billet simple acheté.");
        await refresh();
    }

    async function buySuper() {
        setInfo(null);
        const res = await apiFetch("/tickets/super", { method: "POST", body: JSON.stringify({}) });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        setInfo("Super billet acheté (10 crédits).");
        await refresh();
    }

    async function useTicket(e: FormEvent) {
        e.preventDefault();
        setInfo(null);
        const res = await apiFetch("/tickets/use", {
            method: "POST",
            body: JSON.stringify({
                ticketId: Number(useTicketId),
                screeningId: Number(useScreeningId)
            })
        });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        setInfo("Entrée enregistrée pour cette séance.");
        await refresh();
    }

    async function loadDetail(e: FormEvent) {
        e.preventDefault();
        setDetailJson(null);
        const res = await apiFetch(`/tickets/${detailId}`);
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        const data = await res.json();
        setDetailJson(JSON.stringify(data, null, 2));
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <header>
                <h1 className="font-display text-3xl font-bold text-stone-100">Billets</h1>
            
            </header>

            {error ? <Alert type="error">{error}</Alert> : null}
            {info ? <Alert type="success">{info}</Alert> : null}

            <div className="grid gap-8 lg:grid-cols-2">
                <Card title="Acheter un billet simple : 10€">
                    <form className="space-y-4" onSubmit={buySimple}>
                        <label className="block space-y-1.5">
                            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Séance</span>
                            <select
                                className="w-full rounded-lg border border-cinema-700 bg-cinema-950 px-3 py-2 text-sm"
                                value={screeningForBuy}
                                onChange={(e) => setScreeningForBuy(e.target.value)}
                            >
                                {screenings.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        #{s.id} — {s.movie?.title ?? "?"} · {new Date(s.startAt).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <Button type="submit">Payer et réserver</Button>
                    </form>
                </Card>

                <Card title="Super billet (10 séances) : 75€">
                    <p className="text-sm text-stone-400 mb-4">
                         Assure-toi d’avoir assez sur le portefeuille.
                    </p>
                    <Button onClick={() => void buySuper()}>Acheter un super billet</Button>
                </Card>
            </div>

            <Card title="Utiliser un billet à l’entrée">
                <form className="grid gap-4 md:grid-cols-3 md:items-end" onSubmit={useTicket}>
                    <Field label="ID billet" type="number" min={1} value={useTicketId} onChange={(e) => setUseTicketId(e.target.value)} required />
                    <label className="block space-y-1.5 md:col-span-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Séance</span>
                        <select
                            className="w-full rounded-lg border border-cinema-700 bg-cinema-950 px-3 py-2 text-sm"
                            value={useScreeningId}
                            onChange={(e) => setUseScreeningId(e.target.value)}
                        >
                            {screenings.map((s) => (
                                <option key={s.id} value={s.id}>
                                    #{s.id}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Button type="submit" className="md:col-span-1">
                        Valider l’entrée
                    </Button>
                </form>
                <p className="mt-3 text-xs text-stone-600">
                    Billet simple : la séance doit correspondre à celle du billet. Super billet : n’importe quelle séance (tant qu’il reste des crédits).
                </p>
            </Card>

            <Card title="Mes billets">
                <Button variant="ghost" className="mb-4" onClick={() => void refresh()}>
                    Rafraîchir la liste
                </Button>
                <ul className="space-y-2">
                    {tickets.map((t) => (
                        <li key={t.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-cinema-800 bg-cinema-950/50 px-3 py-2 text-sm">
                            <span className="font-mono text-amber-200/90">#{t.id}</span>
                            <span>{t.kind}</span>
                            <span className="text-stone-400">crédits : {t.remainingCredits}</span>
                            <span className="text-stone-500">{Number(t.pricePaid).toFixed(2)} €</span>
                        </li>
                    ))}
                </ul>
                {tickets.length === 0 ? <p className="text-sm text-stone-500">Aucun billet.</p> : null}
            </Card>

         
        </div>
    );
}
