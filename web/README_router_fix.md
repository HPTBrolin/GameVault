GameVault – Router fix (BrowserRouter)
======================================

What this patch does
--------------------
- Replaces the `RouterProvider` usage with `BrowserRouter` so your <App /> component
  renders correctly and the runtime error:
    "Cannot read properties of undefined (reading 'location')" disappears.
- Adds no-op `styles/app.css` and `styles/theme.css` so the imports in main.tsx don't fail
  even if those files are missing in your repo (safe to overwrite/merge).

Files in this ZIP (relative to project root):
---------------------------------------------
web/src/main.tsx
web/src/styles/app.css
web/src/styles/theme.css

How to apply
------------
1) Close Vite dev server if running.
2) Copy `web/src/main.tsx` to your project, replacing the existing file.
3) Ensure the folders `web/src/styles/` exist. Copy the two CSS files there.
   (If you already have your own app.css/theme.css, keep yours and skip ours).
4) Start the dev server again:
     cd web
     npm run dev

Optional (if you prefer RouterProvider + createBrowserRouter)
-------------------------------------------------------------
- Instead of this patch, you can keep RouterProvider and create a `router.tsx` with
  createBrowserRouter([...]) and pass it to <RouterProvider router={router} />.
- The BrowserRouter solution is the smallest change and won’t break your current UI.

Safe by design
--------------
- This patch only touches the entry point (main.tsx) and adds two no‑op CSS files.
  No other code or styles are modified.
