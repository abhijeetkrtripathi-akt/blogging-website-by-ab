const { useState: useHState, useEffect: useHEffect } = React;

function ArticleCard({ post }) {
  return (
    <a className="card" href={"/articles/" + post.slug + ".html"}>
      <img src={post.coverImage} alt={post.title} />
      <div className="card-body">
        <h3 className="card-title">{post.title}</h3>
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-meta">{post.authorName} · {window.formatDate(post.publishedAt)} · {post.category}</div>
      </div>
    </a>
  );
}

function CardsGrid({ posts, emptyText }) {
  if (!posts || posts.length === 0) {
    return <div className="empty-state">{emptyText || "No articles yet. Check back soon!"}</div>;
  }
  return (
    <div className="cards-grid">
      {posts.map((p) => <ArticleCard key={p.id} post={p} />)}
    </div>
  );
}

function HomeApp() {
  const [posts, setPosts] = useHState([]);
  const [loading, setLoading] = useHState(true);
  const [error, setError] = useHState("");
  const [user, setUser] = useHState(null);
  const [authMode, setAuthMode] = useHState(null);

  useHEffect(() => {
    fetch("/api/articles")
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(setPosts)
      .catch(() => setError("Could not load articles. Is the server running?"))
      .finally(() => setLoading(false));
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user)).catch(() => {});
  }, []);

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const q = (params.get("q") || "").toLowerCase();

  const filtered = posts.filter((p) => {
    if (category && p.category !== category) return false;
    if (q && !(p.title + " " + p.excerpt + " " + p.tags.join(" ")).toLowerCase().includes(q)) return false;
    return true;
  });

  const latest = [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 3);
  const popular = [...posts].sort((a, b) => b.likesCount - a.likesCount).slice(0, 3);
  const famous = posts.filter((p) => p.famous);

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
  };

  return (
    <>
      <window.SiteHeader user={user} onAuthOpen={setAuthMode} onSignOut={signOut} />
      <main id="main" role="main">
        <section className="hero-banner">
          <span className="hero-eyebrow">Stories worth your time</span>
          <h1>Re-Vision Blogger</h1>
          <p>A place where writers and readers connect. Discover fresh stories, trending topics, and ideas worth sharing.</p>
          <a className="hero-cta" href="#latest-section">Start reading</a>
        </section>

        {category && (
          <div className="filter-banner">
            Showing <strong>{category}</strong> articles · <a href="/">Clear filter</a>
          </div>
        )}
        {q && (
          <div className="filter-banner">
            Search results for <strong>"{q}"</strong> · <a href="/">Clear search</a>
          </div>
        )}

        {loading && <div className="loading-state">Loading articles...</div>}
        {error && <div className="empty-state">{error}</div>}

        {!loading && !error && (category || q) && (
          <section className="articles-section">
            <div className="section-head"><h2>{filtered.length} result{filtered.length === 1 ? "" : "s"}</h2></div>
            <CardsGrid posts={filtered} emptyText="No articles match your filter." />
          </section>
        )}

        {!loading && !error && !category && !q && (
          <>
            <section className="articles-section famous-section">
              <div className="section-head">
                <h2>Famous articles</h2>
                <span className="section-sub">Hand-picked highlights</span>
              </div>
              <CardsGrid posts={famous} />
            </section>

            <section className="articles-section" id="latest-section">
              <div className="section-head">
                <h2>Latest articles</h2>
                <span className="section-sub">Fresh off the press</span>
              </div>
              <CardsGrid posts={latest} />
            </section>

            <section className="articles-section" id="popular-section">
              <div className="section-head">
                <h2>Popular articles</h2>
                <span className="section-sub">Most liked</span>
              </div>
              <CardsGrid posts={popular} />
            </section>
          </>
        )}
      </main>
      <footer className="site-footer" role="contentinfo">
        <div className="footer-newsletter">
          <h3>Subscribe to our newsletter</h3>
          <p>Get the latest articles delivered to your inbox.</p>
          <NewsletterForm />
        </div>
        <div className="footer-extra">
          <div className="col">
            <h4>Pages</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/#about">About</a></li>
              <li><a href="/#contact">Contact</a></li>
              <li><a href="/#write">Write</a></li>
            </ul>
          </div>
          <div className="col">
            <h4>Categories</h4>
            <ul>
              {[...new Set(posts.map((p) => p.category))].map((c) => (
                <li key={c}><a href={"/?category=" + encodeURIComponent(c)}>{c}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-links">
          <a href="/#about">About</a>
          <a href="/#contact">Contact</a>
          <a href="/#privacy">Privacy</a>
        </div>
        <div className="footer-copy">© 2026 Re-Vision Blogger. All rights reserved.</div>
      </footer>
      <window.AuthModal open={!!authMode} onClose={() => setAuthMode(null)} onAuthed={setUser} />
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useHState("");
  const [err, setErr] = useHState("");
  const [succ, setSucc] = useHState("");
  const submit = (e) => {
    e.preventDefault();
    setErr(""); setSucc("");
    const v = email.trim();
    if (!v) return setErr("Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setErr("Please enter a valid email address.");
    setSucc("Thanks for subscribing!");
    setEmail("");
  };
  return (
    <form id="newsletter-form" onSubmit={submit} noValidate>
      <input type="email" id="newsletter-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email address" />
      <button type="submit">Subscribe</button>
      {err && <span className="form-error" id="newsletter-error" role="alert">{err}</span>}
      {succ && <span className="form-success" id="newsletter-success" role="status">{succ}</span>}
    </form>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<HomeApp />);