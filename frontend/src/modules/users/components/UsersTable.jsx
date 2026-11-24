export default function UsersTable({ users, onEdit, onDelete, loading, deletingId }) {
  if (loading) {
    return <div className="empty-state"><p>Carregando usuários...</p></div>;
  }

  if (!users.length) {
    return (
      <div className="empty-state">
        <p>Nenhum usuário encontrado.</p>
        <p className="muted">Clique em "Novo usuário" para cadastrar o primeiro.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Perfil</th>
            <th>Status</th>
            <th>Origem</th>
            <th className="actions-col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><span className="mono">#{user.id}</span></td>
              <td className="cell-strong">{user.name}</td>
              <td>{user.email}</td>
              <td><span className={`badge ${user.role === "ADMIN" ? "badge-admin" : "badge-operator"}`}>{user.role}</span></td>
              <td>
                <span className={`badge ${user.status ? "badge-active" : "badge-inactive"}`}>
                  {user.status ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td><span className="muted">{user.registrationSource || "-"}</span></td>
              <td>
                <div className="row-actions">
                  <button className="btn btn-sm btn-secondary" type="button" onClick={() => onEdit(user)}>
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    type="button"
                    onClick={() => onDelete(user)}
                    disabled={deletingId === user.id}
                    title="Excluir usuário (requer endpoint DELETE /users/:id no backend)"
                  >
                    {deletingId === user.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
