export default function Sidebar({ current, onNavigate }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "📊", hint: "Visão geral" },
    { id: "users", label: "Usuários", icon: "👥", hint: "Cadastro e gestão" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">AS</div>
        <div>
          <div className="brand-title">Armazen Stock</div>
          <div className="brand-subtitle">Painel administrativo</div>
        </div>
      </div>

      <div className="sidebar-section-label">Menu</div>
      <nav>
        <ul className="nav-list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`nav-button ${current === item.id ? "active" : ""}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                <span className="nav-text">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-hint">{item.hint}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-title">Conexão</div>
        <div className="sidebar-footer-text">Proxy: <code>/api</code> → <code>localhost:3000</code></div>
      </div>
    </aside>
  );
}
