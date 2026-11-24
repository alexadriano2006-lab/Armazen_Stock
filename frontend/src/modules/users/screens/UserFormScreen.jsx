import UserForm from "../components/UserForm.jsx";

export default function UserFormScreen({
  mode,
  user,
  saving,
  error,
  onSubmit,
  onCancel,
}) {
  const isEdit = mode === "edit";
  const title = isEdit ? `Editar usuário${user ? ` #${user.id}` : ""}` : "Cadastrar usuário";
  const subtitle = isEdit
    ? "Tela de edição: atualize os dados do usuário selecionado e salve as alterações."
    : "Tela de cadastro: preencha os dados para criar um novo usuário.";

  return (
    <div className="screen">
      <section className="panel">
        <div className="panel-header screen-header">
          <div>
            <button className="btn btn-ghost btn-back" type="button" onClick={onCancel} disabled={saving}>
              ← Voltar para lista
            </button>
            <h3 className="panel-title" style={{ marginTop: 10 }}>{title}</h3>
            <p className="muted" style={{ margin: "4px 0 0" }}>{subtitle}</p>
          </div>
          <div className="screen-badge">{isEdit ? "Edição" : "Cadastro"}</div>
        </div>

        {error ? <div className="alert alert-error" style={{ marginTop: 8 }}>{error}</div> : null}

        {isEdit && user ? (
          <div className="info-strip">
            <div><strong>ID:</strong> #{user.id}</div>
            <div><strong>Status atual:</strong> {user.status ? "Ativo" : "Inativo"}</div>
            <div><strong>Origem:</strong> {user.registrationSource || "-"}</div>
          </div>
        ) : null}

        <UserForm
          mode={isEdit ? "edit" : "create"}
          initialUser={user}
          onSubmit={onSubmit}
          onCancel={onCancel}
          loading={saving}
        />
      </section>
    </div>
  );
}
