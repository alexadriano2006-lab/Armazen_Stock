import { useMemo, useState } from "react";
import UsersTable from "../components/UsersTable.jsx";

export default function UsersListScreen({
  users,
  loading,
  deletingId,
  onCreate,
  onEdit,
  onDelete,
  onRefresh,
  error,
  success,
  onClearMessages,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => (user.name || "").toLowerCase().includes(term));
  }, [users, searchTerm]);

  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="screen">
      <section className="panel toolbar-panel">
        <div className="toolbar-header">
          <div>
            <h3 className="panel-title">Gestão de usuários</h3>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              Cadastre novos usuários, edite registros e pesquise por nome.
            </p>
          </div>
          <div className="toolbar-actions">
            <button className="btn btn-primary" type="button" onClick={onCreate}>
              + Novo usuário
            </button>
            <button className="btn btn-secondary" type="button" onClick={onRefresh} disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar lista"}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={onClearMessages}
              disabled={!error && !success}
            >
              Limpar mensagens
            </button>
          </div>
        </div>
      </section>

      {error ? <div className="alert alert-error">{error}</div> : null}
      {success ? <div className="alert alert-success">{success}</div> : null}

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Lista de usuários</h3>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              {hasSearch
                ? `${filteredUsers.length} de ${users.length} registro(s) encontrado(s).`
                : `${users.length} registro(s). Ações disponíveis em cada linha: Editar e Excluir.`}
            </p>
          </div>
          <button className="btn btn-primary" type="button" onClick={onCreate}>
            Ir para cadastro
          </button>
        </div>

        <div className="search-bar">
          <label className="search-field">
            <span className="search-label">Pesquisar por nome</span>
            <input
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do usuário..."
              disabled={loading}
            />
          </label>
          {hasSearch ? (
            <button className="btn btn-ghost" type="button" onClick={() => setSearchTerm("")}>
              Limpar busca
            </button>
          ) : null}
        </div>

        {!loading && users.length > 0 && filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum usuário encontrado para "{searchTerm.trim()}".</p>
            <p className="muted">Tente outro nome ou limpe a busca.</p>
          </div>
        ) : (
          <UsersTable
            users={filteredUsers}
            onEdit={onEdit}
            onDelete={onDelete}
            loading={loading}
            deletingId={deletingId}
          />
        )}
      </section>
    </div>
  );
}
