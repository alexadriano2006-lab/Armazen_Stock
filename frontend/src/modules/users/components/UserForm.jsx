import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "OPERATOR",
};

export default function UserForm({ mode, initialUser, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (mode === "edit" && initialUser) {
      setForm({
        name: initialUser.name || "",
        email: initialUser.email || "",
        password: "",
        role: initialUser.role || "OPERATOR",
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, initialUser]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (mode === "create") {
      onSubmit({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Nome completo</span>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Ex.: Maria Silva" />
        </label>
        <label className="field">
          <span>E-mail</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="usuario@exemplo.com" />
        </label>
        {mode === "create" ? (
          <label className="field">
            <span>Senha</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={1}
              placeholder="Defina uma senha"
            />
          </label>
        ) : null}
        <label className="field">
          <span>Perfil de acesso</span>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="OPERATOR">OPERATOR (operador)</option>
            <option value="ADMIN">ADMIN (administrador)</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Salvando..." : mode === "create" ? "Criar usuário" : "Salvar alterações"}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel} disabled={loading}>
          {mode === "edit" ? "Cancelar edição" : "Cancelar"}
        </button>
      </div>

      <p className="muted form-hint">
        {mode === "edit"
          ? "Atualização atual envia apenas nome, e-mail e perfil. A senha não é alterada por este formulário."
          : "Campos obrigatórios: nome, e-mail, senha e perfil. O backend pode aplicar hash na criação."}
      </p>
    </form>
  );
}
