import { useCallback, useEffect, useState, type FormEvent } from "react";
import { apiFetch, readError } from "../api/client.ts";
import { Button, Card, Field, Alert } from "../components/ui.tsx";

type WalletTx = {
    id: number;
    type: string;
    amount: number | string;
    balanceAfter: number | string;
    createdAt: string;
};

export function WalletPage() {
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<WalletTx[]>([]);
    const [amount, setAmount] = useState("20");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setError(null);
        try {
            const [bRes, tRes] = await Promise.all([
                apiFetch("/wallet/balance"),
                apiFetch("/wallet/transactions")
            ]);
            if (!bRes.ok) throw new Error(await readError(bRes));
            if (!tRes.ok) throw new Error(await readError(tRes));
            const b = (await bRes.json()) as { balance: number };
            setBalance(Number(b.balance));
            setTransactions((await tRes.json()) as WalletTx[]);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erreur");
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    async function deposit(e: FormEvent) {
        e.preventDefault();
        setInfo(null);
        const res = await apiFetch("/wallet/deposit", {
            method: "POST",
            body: JSON.stringify({ amount: Number(amount) })
        });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        setInfo("Dépôt effectué.");
        await refresh();
    }

    async function withdrawMoney() {
        setInfo(null);
        const res = await apiFetch("/wallet/withdraw", {
            method: "POST",
            body: JSON.stringify({ amount: Number(amount) })
        });
        if (!res.ok) {
            setError(await readError(res));
            return;
        }
        setInfo("Retrait effectué.");
        await refresh();
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <header>
                <h1 className="font-display text-3xl font-bold text-stone-100">Portefeuille</h1>
                <p className="mt-1 text-sm text-stone-500">Dépôt, retrait et historique (euros)</p>
            </header>

            {error ? <Alert type="error">{error}</Alert> : null}
            {info ? <Alert type="success">{info}</Alert> : null}

            <Card title="Solde">
                <p className="font-display text-4xl font-bold text-amber-400">
                    {balance === null ? "…" : `${balance.toFixed(2)} €`}
                </p>
                <Button variant="ghost" className="mt-4" onClick={() => void refresh()}>
                    Actualiser
                </Button>
            </Card>

            <Card title="Opérations">
                <form className="flex flex-wrap items-end gap-4" onSubmit={deposit}>
                    <Field label="Montant (€)" type="number" step="0.01" min={0.01} value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <Button type="submit">Déposer</Button>
                    <Button type="button" variant="secondary" onClick={() => void withdrawMoney()}>
                        Retirer
                    </Button>
                </form>
                <p className="mt-2 text-xs text-stone-600">
                    Astuce : le bouton Retirer utilise le même champ montant (formulaire simplifié pour la démo).
                </p>
            </Card>

            <Card title="Historique">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-cinema-800 text-stone-500">
                                <th className="pb-2 pr-4">Date</th>
                                <th className="pb-2 pr-4">Type</th>
                                <th className="pb-2 pr-4">Montant</th>
                                <th className="pb-2">Solde après</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id} className="border-b border-cinema-800/60">
                                    <td className="py-2 pr-4 font-mono text-xs text-stone-400">
                                        {new Date(t.createdAt).toLocaleString()}
                                    </td>
                                    <td className="py-2 pr-4">{t.type}</td>
                                    <td className="py-2 pr-4">{Number(t.amount).toFixed(2)} €</td>
                                    <td className="py-2">{Number(t.balanceAfter).toFixed(2)} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {transactions.length === 0 ? <p className="text-sm text-stone-500 mt-2">Aucune transaction.</p> : null}
            </Card>
        </div>
    );
}
