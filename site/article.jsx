const { useState: useAState, useEffect: useAEffect, useRef: useARef } = React;

function RelatedCard({ post }) {
  return (
    <a className="card" href={"/articles/" + post.slug + ".html"}>
      <img src={post.coverImage} alt={post.title} />
      <div className="card-body">
        <h3 className="card-title">{post.title}</h3>
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-meta">{post.authorName} · {window.formatDate(post.publishedAt)}</div>
      </div>
    </a>
  );
}

function ArticleApp() {
  const slug = window.__ARTICLE_SLUG__;
  const [article, setArticle] = useAState(null);
  const [related, setRelated] = useAState([]);
  const [comments, setComments] = useAState([]);
  const [user, setUser] = useAState(null);
  const [authMode, setAuthMode] = useAState(null);
  const [loading, setLoading] = useAState(true);
  const [notFound, setNotFound] = useAState(false);
  const [copied, setCopied] = useAState("");
  const [commentText, setCommentText] = useAState("");
  const [commentError, setCommentError] = useAState("");
  const [actionMsg, setActionMsg] = useAState("");
  const contentRef = useARef(null);

  useAEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user)).catch(() => {});
    fetch("/api/articles/" + encodeURIComponent(slug))
      .then(async (r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setArticle(data);
        return fetch("/api/articles/" + encodeURIComponent(slug) + "/comments").then((r) => r.json());
      })
      .then((cs) => { if (cs) setComments(cs); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    fetch("/api/articles/" + encodeURIComponent(slug) + "/related")
      .then((r) => r.ok ? r.json() : [])
      .then(setRelated)
      .catch(() => {});
  }, [slug]);

  const toc = React.useMemo(() => {
    if (!article) return [];
    const doc = new DOMParser().parseFromString(article.content || "", "text/html");
    return Array.from(doc.querySelectorAll("h2, h3")).map((n, i) => ({
      id: n.id || "section-" + i,
      text: n.textContent,
      level: n.tagName.toLowerCase(),
    }));
  }, [article]);

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
  };

  const requireUser = () => {
    if (!user) { setActionMsg("Sign in to like, bookmark, or comment."); setAuthMode("signin"); return false; }
    return true;
  };

  const toggleLike = async () => {
    if (!requireUser()) return;
    const res = await fetch("/api/articles/" + encodeURIComponent(slug) + "/like", { method: "POST" });
    if (res.ok) {
      const d = await res.json();
      setArticle((a) => ({ ...a, liked: d.liked, likesCount: d.likesCount }));
    }
  };

  const toggleBookmark = async () => {
    if (!requireUser()) return;
    const res = await fetch("/api/articles/" + encodeURIComponent(slug) + "/bookmark", { method: "POST" });
    if (res.ok) {
      const d = await res.json();
      setArticle((a) => ({ ...a, bookmarked: d.bookmarked }));
      setActionMsg(d.bookmarked ? "Saved to bookmarks." : "Removed from bookmarks.");
    }
  };

  const copyLink = () => {
    const url = window.location.href;
    try {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    } catch (e) { /* ignore */ }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied("Link copied!");
    setTimeout(() => setCopied(""), 2000);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!requireUser()) return;
    setCommentError("");
    const text = commentText.trim();
    if (!text) { setCommentError("Comment cannot be empty."); return; }
    const res = await fetch("/api/articles/" + encodeURIComponent(slug) + "/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) { setCommentError(data.error || "Could not post comment."); return; }
    setComments((c) => [data, ...c]);
    setCommentText("");
  };

  const deleteComment = async (id) => {
    const res = await fetch("/api/comments/" + id, { method: "DELETE" });
    if (res.ok) setComments((c) => c.filter((x) => x.id !== id));
  };

  const shareUrl = window.location.href;
  const shareText = article ? article.title : "Re-Vision Blogger";

  if (loading) {
    return (
      <>
        <window.SiteHeader user={user} onAuthOpen={setAuthMode} onSignOut={signOut} />
        <main className="article-main"><div className="loading-state">Loading article...</div></main>
      </>
    );
  }

  if (notFound || !article) {
    return (
      <>
        <window.SiteHeader user={user} onAuthOpen={setAuthMode} onSignOut={signOut} />
        <main className="article-main">
          <div className="not-found">
            <h1>Article not found</h1>
            <p>This article may have been moved or deleted.</p>
            <a className="hero-cta dark" href="/">Back to home</a>
          </div>
        </main>
      </>
    );
  }

  const showToc = article.tocEnabled && toc.length >= 3;

  return (
    <>
      <window.SiteHeader user={user} onAuthOpen={setAuthMode} onSignOut={signOut} />
      <main id="main" role="main" className="article-main">
        <article className="article-page">
          <header className="article-header">
            <a className="article-category" href={"/?category=" + encodeURIComponent(article.category)}>{article.category}</a>
            <h1 id="article-title">{article.title}</h1>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-byline">
              <img className="avatar" src={article.authorAvatar} alt={article.authorName} />
              <div>
                <div className="byline-name">{article.authorName}</div>
                <div className="byline-dates">
                  Published {window.formatDate(article.publishedAt)} · Updated {window.formatDate(article.updatedAt)}
                </div>
              </div>
            </div>
            <img className="article-cover" src={article.coverImage} alt={article.title} />
          </header>

          <div className="article-layout">
            {showToc && (
              <aside className="toc" aria-label="Table of contents">
                <h2>Contents</h2>
                <ol>
                  {toc.map((t) => (
                    <li key={t.id} className={t.level === "h3" ? "toc-sub" : ""}>
                      <a href={"#" + t.id}>{t.text}</a>
                    </li>
                  ))}
                </ol>
              </aside>
            )}

            <div className="article-body-wrap">
              <div className="article-body" ref={contentRef} dangerouslySetInnerHTML={{ __html: article.content }} />

              {article.videoUrl && (
                <div className="article-video">
                  <h2>Watch</h2>
                  <video controls width="100%" src={article.videoUrl}></video>
                </div>
              )}

              <div className="article-tags">
                {article.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
              </div>

              <div className="engagement-bar">
                <button type="button" className={"action-btn" + (article.liked ? " active" : "")} onClick={toggleLike} aria-pressed={!!article.liked}>
                  ♥ {article.liked ? "Liked" : "Like"} · {article.likesCount}
                </button>
                <button type="button" className={"action-btn" + (article.bookmarked ? " active" : "")} onClick={toggleBookmark} aria-pressed={!!article.bookmarked}>
                  {article.bookmarked ? "★ Saved" : "☆ Bookmark"}
                </button>
              </div>

              <div className="share-bar">
                <span>Share:</span>
                <a href={"https://twitter.com/intent/tweet?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(shareText)} target="_blank" rel="noopener">X</a>
                <a href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrl)} target="_blank" rel="noopener">Facebook</a>
                <a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(shareUrl)} target="_blank" rel="noopener">LinkedIn</a>
                <button type="button" className="copy-btn" onClick={copyLink}>Copy Link</button>
                {copied && <span className="copy-msg" role="status">{copied}</span>}
              </div>
              {actionMsg && <div className="action-msg" role="status">{actionMsg}</div>}

              <section className="author-box" aria-label="About the author">
                <img className="avatar-lg" src={article.authorAvatar} alt={article.authorName} />
                <div>
                  <h2>About {article.authorName}</h2>
                  <p>{article.authorBio}</p>
                </div>
              </section>

              <section className="comments" aria-label="Comments">
                <h2>Comments ({comments.length})</h2>
                {comments.length === 0 && <div className="empty-state">No comments yet. Start the conversation.</div>}

                {user ? (
                  <form className="comment-form" onSubmit={submitComment}>
                    <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." aria-label="Write a comment" maxLength={1000} />
                    {commentError && <div className="form-error" role="alert">{commentError}</div>}
                    <button type="submit" className="btn-primary">Post comment</button>
                  </form>
                ) : (
                  <div className="signin-prompt">
                    <p>Sign in to join the conversation.</p>
                    <button type="button" className="btn-primary" onClick={() => { setActionMsg("Sign in to comment."); setAuthMode("signin"); }}>Sign in to comment</button>
                  </div>
                )}

                <ul className="comment-list">
                  {comments.map((c) => (
                    <li key={c.id} className="comment">
                      <img className="avatar" src={c.avatar} alt={c.userName} />
                      <div className="comment-body">
                        <div className="comment-head">
                          <strong>{c.userName}</strong>
                          <span>{window.formatDate(c.createdAt, true)}</span>
                        </div>
                        <p>{c.text}</p>
                        {user && user.id === c.userId && (
                          <button type="button" className="delete-comment" onClick={() => deleteComment(c.id)}>Delete</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <section className="related" aria-label="Related articles">
            <div className="section-head"><h2>Related articles</h2></div>
            <div className="cards-grid">
              {related.map((r) => <RelatedCard key={r.id} post={r} />)}
            </div>
          </section>
        </article>
      </main>
      <footer className="site-footer" role="contentinfo">
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/#about">About</a>
          <a href="/#contact">Contact</a>
        </div>
        <div className="footer-copy">© 2026 Re-Vision Blogger. All rights reserved.</div>
      </footer>
      <window.AuthModal open={!!authMode} onClose={() => setAuthMode(null)} onAuthed={setUser} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ArticleApp />);