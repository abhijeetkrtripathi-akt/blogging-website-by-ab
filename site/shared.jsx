const { useState: useS, useEffect: useE } = React;

window.formatDate = function (iso, withTime) {
  if (!iso) return "";
  const d = new Date(iso);
  const opts = { year: "numeric", month: "short", day: "numeric" };
  if (withTime) { opts.hour = "2-digit"; opts.minute = "2-digit"; }
  return d.toLocaleDateString(undefined, opts);
};

window.AuthModal = function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useS("signin");
  const [name, setName] = useS("");
  const [email, setEmail] = useS("");
  const [password, setPassword] = useS("");
  const [error, setError] = useS("");
  const [busy, setBusy] = useS(false);

  useE(() => { if (open) { setError(""); } }, [open]);
  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const url = mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
      const body = mode === "signin" ? { email, password } : { name, email, password };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      onAuthed(data.user);
      onClose();
    } catch (err) {
      setError("Network error. Is the server running?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={mode === "signin" ? "Sign in" : "Sign up"} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-tabs">
          <button className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setError(""); }}>Sign in</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); }}>Sign up</button>
        </div>
        <form onSubmit={submit} className="modal-form">
          {mode === "signup" && (
            <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" /></label>
          )}
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 8 characters" /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button type="submit" className="btn-primary modal-submit" disabled={busy}>{busy ? "Please wait..." : (mode === "signin" ? "Sign in" : "Create account")}</button>
          {mode === "signin" && <p className="modal-hint">Demo: alice@example.com / password123</p>}
        </form>
      </div>
    </div>
  );
};

window.SiteHeader = function SiteHeader({ user, onAuthOpen, onSignOut }) {
  const [menuOpen, setMenuOpen] = useS(false);
  const [search, setSearch] = useS("");
  const [categories, setCategories] = useS([]);

  useE(() => {
    fetch("/api/articles").then((r) => r.json()).then((list) => {
      const cats = [...new Set(list.map((a) => a.category))];
      setCategories(cats);
    }).catch(() => {});
  }, []);

  const doSearch = () => {
    window.location.href = "/?q=" + encodeURIComponent(search.trim());
  };

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <a className="brand" href="/">Re-Vision Blogger</a>
        <div className="header-right">
          <div className="header-actions">
            <div className="search-wrap">
              <input type="search" id="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." aria-label="Search articles" onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }} />
              <button type="button" id="search-btn" className="search-btn" onClick={doSearch}>Search</button>
            </div>
            <div className="auth-buttons">
              {user ? (
                <>
                  <span className="user-chip">Hi, {user.name.split(" ")[0]}</span>
                  <button type="button" className="btn btn-ghost" onClick={onSignOut}>Sign out</button>
                </>
              ) : (
                <>
                  <button type="button" id="signin-btn" className="btn btn-ghost" onClick={() => onAuthOpen("signin")}>Sign in</button>
                  <button type="button" id="signup-btn" className="btn btn-primary" onClick={() => onAuthOpen("signup")}>Sign up</button>
                </>
              )}
            </div>
            <button type="button" className="hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>{menuOpen ? "✕" : "☰"}</button>
          </div>
          <nav className="header-nav-below" aria-label="Secondary navigation">
            <a href="/">Home</a>
            <a href="/#about">About</a>
            <a href="/#contact">Contact</a>
            <a href="/#write">Write</a>
          </nav>
        </div>
      </div>

      <div className="categories-bar" aria-label="Categories">
        {categories.map((cat) => (
          <a key={cat} className="category-chip" href={"/?category=" + encodeURIComponent(cat)}>{cat}</a>
        ))}
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <ul className="nav-list">
            <li><a href="/">Home</a></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/#contact">Contact</a></li>
            <li><a href="/#write">Write</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
};