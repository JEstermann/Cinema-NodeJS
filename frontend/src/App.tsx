import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedShell } from "./components/AppShell.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RoomsPage } from "./pages/RoomsPage.tsx";
import { MoviesPage } from "./pages/MoviesPage.tsx";
import { ScreeningsPage } from "./pages/ScreeningsPage.tsx";
import { WalletPage } from "./pages/WalletPage.tsx";
import { TicketsPage } from "./pages/TicketsPage.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedShell />}>
                <Route index element={<Navigate to="/salles" replace />} />
                <Route path="salles" element={<RoomsPage />} />
                <Route path="movies" element={<MoviesPage />} />
                <Route path="seances" element={<ScreeningsPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="billets" element={<TicketsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/salles" replace />} />
        </Routes>
    );
}
