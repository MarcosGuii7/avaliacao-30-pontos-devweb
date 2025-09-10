import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="brand">Admin</h1>

        <nav className="nav">
          <NavLink to="/" end className={({isActive}) => `link ${isActive ? "active": ""}`}>
            Início
          </NavLink>
          <NavLink to="/alunos" className={({isActive}) => `link ${isActive ? "active": ""}`}>
            Alunos
          </NavLink>
          <NavLink to="/professores" className={({isActive}) => `link ${isActive ? "active": ""}`}>
            Professores
          </NavLink>
          <NavLink to="/disciplinas" className={({isActive}) => `link ${isActive ? "active": ""}`}>
            Disciplinas
          </NavLink>
        </nav>
      </aside>

      <main className="content">
        <header className="header">
          <span>Painel Administrativo — Demo de Navegação</span>
        </header>

        <section className="page">
          <Outlet />
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} Sua Empresa
        </footer>
      </main>
    </div>
  );
}
