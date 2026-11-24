import { useState } from "react";
import Sidebar from "../shared/components/Sidebar.jsx";
import DashboardPage from "../modules/dashboard/DashboardPage.jsx";
import UsersPage from "../modules/users/UsersPage.jsx";

const pageMeta = {
  dashboard: { title: "Dashboard", subtitle: "Resumo do sistema e acesso rápido aos módulos" },
  users: { title: "Usuários", subtitle: "Gerencie cadastros, perfis e atualizações" },
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const meta = pageMeta[page] || pageMeta.dashboard;

  return (
    <div className="app-shell">
      <Sidebar current={page} onNavigate={setPage} />
      <div className="main-area">
        <header className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
            <div className="topbar-subtitle">{meta.subtitle}</div>
          </div>
          <div className="topbar-badge">React + JS</div>
        </header>
        <main className="content">
          {page === "dashboard" ? <DashboardPage /> : null}
          {page === "users" ? <UsersPage /> : null}
        </main>
      </div>
    </div>
  );
}
