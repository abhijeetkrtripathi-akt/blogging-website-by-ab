/*
 * Firebase client API adapter.
 *
 * Local development (localhost:3000) keeps using the Express API.
 * On Firebase Hosting, this file redirects /api/* calls to Firebase Auth + Firestore,
 * so the same React components work in both environments.
 */
(function () {
  var isLocalExpress =
    (location.hostname === "localhost" || location.hostname === "127.0.0.1") &&
    location.port === "3000";
  if (isLocalExpress) return;
  if (typeof firebase === "undefined") {
    console.warn("Firebase SDK not loaded; API calls will fail.");
    return;
  }

  var firebaseConfig = {
    projectId: "re-vision-blogger",
    appId: "1:202186016469:web:36215d204e410f21fc445c",
    storageBucket: "re-vision-blogger.firebasestorage.app",
    apiKey: "AIzaSyBsPef5WfsN7FHXyiW2wwajbZ-jMRBskIk",
    authDomain: "re-vision-blogger.firebaseapp.com",
    messagingSenderId: "202186016469",
    measurementId: "G-PVZT7PTMD7",
  };

  firebase.initializeApp(firebaseConfig);
  var auth = firebase.auth();
  var db = firebase.firestore();

  var originalFetch = window.fetch.bind(window);

  function json(data, status) {
    return new Response(JSON.stringify(data), {
      status: status || 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  function userObj(u) {
    if (!u) return null;
    return {
      id: u.uid,
      name: u.displayName || (u.email ? u.email.split("@")[0] : "Reader"),
      email: u.email || "",
      bio: "",
      avatar: u.photoURL || "https://i.pravatar.cc/120?u=" + encodeURIComponent(u.email || u.uid),
    };
  }

  function currentUser() {
    return new Promise(function (resolve) {
      var unsub = auth.onAuthStateChanged(function (u) {
        unsub();
        resolve(u);
      });
    });
  }

  function articleData(id, doc) {
    var d = doc.data() || {};
    return Object.assign({}, d, { id: d.id || id, slug: d.slug || id });
  }

  async function likeCount(slug) {
    var snap = await db.collection("likes").where("articleSlug", "==", slug).get();
    return snap.size;
  }

  async function handle(path, opts) {
    var method = (opts.method || "GET").toUpperCase();
    var body = {};
    if (opts.body) {
      try { body = JSON.parse(opts.body); } catch (e) { body = {}; }
    }
    var m;

    // ---- auth ----
    if (path === "/api/auth/me" && method === "GET") {
      return json({ user: userObj(await currentUser()) });
    }
    if (path === "/api/auth/signin" && method === "POST") {
      try {
        var cred = await auth.signInWithEmailAndPassword(body.email, body.password);
        return json({ user: userObj(cred.user) });
      } catch (e) {
        return json({ error: "Invalid email or password" }, 400);
      }
    }
    if (path === "/api/auth/signup" && method === "POST") {
      if (!body.name || !body.email || !body.password) {
        return json({ error: "Name, email and password are required" }, 400);
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return json({ error: "Invalid email address" }, 400);
      }
      if (String(body.password).length < 8) {
        return json({ error: "Password must be at least 8 characters" }, 400);
      }
      try {
        var created = await auth.createUserWithEmailAndPassword(body.email, body.password);
        await created.user.updateProfile({ displayName: body.name });
        return json({
          user: userObj({ uid: created.user.uid, email: created.user.email, displayName: body.name }),
        }, 201);
      } catch (e) {
        var msg = e && e.code === "auth/email-already-in-use" ? "Email already registered" : (e.message || "Could not create account");
        return json({ error: msg }, 400);
      }
    }
    if (path === "/api/auth/signout" && method === "POST") {
      await auth.signOut();
      return json({ ok: true });
    }

    // ---- articles ----
    if (path === "/api/articles" && method === "GET") {
      var all = await db.collection("articles").get();
      return json(all.docs.map(function (d) { return articleData(d.id, d); }));
    }

    m = path.match(/^\/api\/articles\/([^/]+)\/related$/);
    if (m && method === "GET") {
      var slug = decodeURIComponent(m[1]);
      var snap = await db.collection("articles").get();
      var current = null;
      var list = [];
      snap.docs.forEach(function (d) {
        var a = articleData(d.id, d);
        if (a.slug === slug) current = a;
        else list.push(a);
      });
      if (!current) return json({ error: "Article not found" }, 404);
      var same = list.filter(function (a) { return a.category === current.category; });
      var others = list.filter(function (a) { return a.category !== current.category; });
      return json(same.concat(others).slice(0, 3));
    }

    m = path.match(/^\/api\/articles\/([^/]+)\/like$/);
    if (m && method === "POST") {
      var lu = await currentUser();
      if (!lu) return json({ error: "Sign in required" }, 401);
      var lslug = decodeURIComponent(m[1]);
      var likeRef = db.collection("likes").doc(lslug + "_" + lu.uid);
      var likeDoc = await likeRef.get();
      if (likeDoc.exists) await likeRef.delete();
      else await likeRef.set({ articleSlug: lslug, userId: lu.uid });
      return json({ liked: !likeDoc.exists, likesCount: await likeCount(lslug) });
    }

    m = path.match(/^\/api\/articles\/([^/]+)\/bookmark$/);
    if (m && method === "POST") {
      var bu = await currentUser();
      if (!bu) return json({ error: "Sign in required" }, 401);
      var bslug = decodeURIComponent(m[1]);
      var bmRef = db.collection("bookmarks").doc(bu.uid + "_" + bslug);
      var bmDoc = await bmRef.get();
      if (bmDoc.exists) await bmRef.delete();
      else await bmRef.set({ articleSlug: bslug, userId: bu.uid });
      return json({ bookmarked: !bmDoc.exists });
    }

    m = path.match(/^\/api\/articles\/([^/]+)\/comments$/);
    if (m && method === "GET") {
      var cslug = decodeURIComponent(m[1]);
      var csnap = await db.collection("comments").where("articleSlug", "==", cslug).get();
      var comments = csnap.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      }).sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      return json(comments);
    }
    if (m && method === "POST") {
      var cu = await currentUser();
      if (!cu) return json({ error: "Sign in required" }, 401);
      var text = String(body.text || "").trim();
      if (!text) return json({ error: "Comment cannot be empty" }, 400);
      if (text.length > 1000) return json({ error: "Comment is too long (max 1000 characters)" }, 400);
      var createdAt = new Date().toISOString();
      var payload = {
        articleSlug: decodeURIComponent(m[1]),
        userId: cu.uid,
        userName: cu.displayName || cu.email,
        text: text,
        createdAt: createdAt,
      };
      var added = await db.collection("comments").add(payload);
      return json(Object.assign({ id: added.id }, payload), 201);
    }

    m = path.match(/^\/api\/articles\/([^/]+)$/);
    if (m && method === "GET") {
      var dslug = decodeURIComponent(m[1]);
      var dref = await db.collection("articles").doc(dslug).get();
      if (!dref.exists) return json({ error: "Article not found" }, 404);
      var article = articleData(dref.id, dref);
      var u = await currentUser();
      var likes = await db.collection("likes").where("articleSlug", "==", dslug).get();
      var ccount = await db.collection("comments").where("articleSlug", "==", dslug).get();
      article.likesCount = likes.size;
      article.commentsCount = ccount.size;
      article.liked = false;
      article.bookmarked = false;
      if (u) {
        article.liked = (await db.collection("likes").doc(dslug + "_" + u.uid).get()).exists;
        article.bookmarked = (await db.collection("bookmarks").doc(u.uid + "_" + dslug).get()).exists;
      }
      return json(article);
    }

    // ---- comment delete ----
    m = path.match(/^\/api\/comments\/([^/]+)$/);
    if (m && method === "DELETE") {
      var du = await currentUser();
      if (!du) return json({ error: "Sign in required" }, 401);
      try {
        await db.collection("comments").doc(decodeURIComponent(m[1])).delete();
        return json({ ok: true });
      } catch (e) {
        return json({ error: "You can only delete your own comments" }, 403);
      }
    }

    return json({ error: "Not found" }, 404);
  }

  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || "";
    if (url.indexOf("/api/") !== -1) {
      var path = url.substring(url.indexOf("/api/"));
      return handle(path, init || {});
    }
    return originalFetch(input, init);
  };
})();