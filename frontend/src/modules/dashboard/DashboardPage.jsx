import { useEffect, useState } from "react";
import { usersService } from "../users/services/usersService.js";

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: null, api: "desconhecido" });
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const users = await usersService.list();
        if (!active) return;
        setStats({ users: Array.isArray(users) ? users.length : 0, api: "online" });
      } catch (err) {
        if (!active) return;
        setStats({ users: null, api: "offline/erro" });
        setError(err.message || "Não foi possível carregar dados.");
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2>Painel</h2>
        <p className="muted">Visão geral simples do sistema.</p>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="muted">Status da API</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.api}</div>
        </div>
        <div className="card">
          <div className="muted">Usuários cadastrados</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            {stats.users === null ? "-" : stats.users}
          </div>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Módulos</h3>
        <ul>
          <li><strong>Usuários:</strong> listar, criar e atualizar (name/email/role) via API.</li>
          <li><strong>Schema base (Prisma):</strong> User com role, status e registrationSource.</li>
        </ul>
        <p className="muted" style={{ marginBottom: 0 }}>
          Estrutura modular preparada para incluir novos módulos (ex.: produtos, estoque, movimentações).
        </p>
      </div>
    </div>
  );
}
