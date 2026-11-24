import { useEffect, useState } from "react";
import { usersService } from "./services/usersService.js";
import UsersListScreen from "./screens/UsersListScreen.jsx";
import UserFormScreen from "./screens/UserFormScreen.jsx";

export default function UsersPage() {
  const [view, setView] = useState("list"); // list | create | edit
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  async function loadUsers({ showLoading = true } = {}) {
    if (showLoading) setLoading(true);
    try {
      const data = await usersService.list();
      const list = Array.isArray(data) ? data : [];
      setUsers(list);
      return list;
    } catch (err) {
      setError(err.message || "Erro ao carregar usuários.");
      return null;
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function goToList() {
    setView("list");
    setSelectedUser(null);
    setError("");
  }

  function openCreate() {
    setSelectedUser(null);
    setError("");
    setSuccess("");
    setView("create");
  }

  function openEdit(user) {
    setSelectedUser(user);
    setError("");
    setSuccess("");
    setView("edit");
  }

  async function handleCreate(payload) {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await usersService.create(payload);
      await loadUsers({ showLoading: false });
      setView("list");
      setSuccess("Usuário criado com sucesso.");
    } catch (err) {
      setError(err.message || "Erro ao criar usuário.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(payload) {
    if (!selectedUser) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await usersService.update(selectedUser.id, payload);
      await loadUsers({ showLoading: false });
      setView("list");
      setSelectedUser(null);
      setSuccess("Usuário atualizado com sucesso.");
    } catch (err) {
      setError(err.message || "Erro ao atualizar usuário.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user) {
    const confirmed = window.confirm(`Deseja excluir o usuário #${user.id} (${user.name})?`);
    if (!confirmed) return;

    setDeletingId(user.id);
    setError("");
    setSuccess("");
    try {
      await usersService.remove(user.id);
      setSuccess("Usuário excluído com sucesso.");
      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
        setView("list");
      }
      await loadUsers({ showLoading: false });
    } catch (err) {
      const detail = err.message || "Erro ao excluir usuário.";
      if (err.status === 404 || err.status === 405) {
        setError(`Não foi possível excluir: endpoint de exclusão indisponível na API. (${detail})`);
      } else {
        setError(detail);
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (view === "create") {
    return (
      <UserFormScreen
        mode="create"
        saving={saving}
        error={error}
        onSubmit={handleCreate}
        onCancel={goToList}
      />
    );
  }

  if (view === "edit") {
    return (
      <UserFormScreen
        mode="edit"
        user={selectedUser}
        saving={saving}
        error={error}
        onSubmit={handleUpdate}
        onCancel={goToList}
      />
    );
  }

  return (
    <UsersListScreen
      users={users}
      loading={loading}
      deletingId={deletingId}
      onCreate={openCreate}
      onEdit={openEdit}
      onDelete={handleDelete}
      onRefresh={() => { setError(""); loadUsers(); }}
      error={error}
      success={success}
      onClearMessages={() => { setError(""); setSuccess(""); }}
    />
  );
}
