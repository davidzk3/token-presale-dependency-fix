# **Node.js Dependency Compatibility Test**

This test checks your ability to fix **broken or outdated dependencies** in a Node.js project. The project you receive will contain version conflicts and missing or incorrect packages. Your job is to make it run.

---

## **What You Need to Do**

### **1. Find the Problems**

Look through the project and identify:

* Outdated or incompatible versions
* Missing or duplicated dependencies
* Configuration mistakes

---

### **2. Fix the Dependencies**

Update the dependency file so the project:

* Installs without errors
* Runs cleanly
* Uses compatible versions

---

### **3. Show That It Works**

After fixing everything:

* Provide a **short script** that proves the project runs
  (e.g., start a small server, run a simple build, deploy a basic module, or make a minimal Web3/API call)

---

## **What to Submit**

1. **Your fixed `package.json` file**
2. **A small codebase** (only the files needed to run your test)
3. **Your test script** that confirms everything works

---

## **Goal**

Show that you can quickly:

* Spot dependency issues
* Fix version conflicts
* Make a broken Node.js project work again

---

# **Node.js Dependency Compatibility Fix**

## Dependency Fix Summary

This project initially failed to install and run due to multiple dependency and configuration issues. The following fixes were applied:

* Fixed React runtime mismatch: the project uses React 17, so `react-dom/client` (React 18 API) was removed and the entrypoint was reverted to `ReactDOM.render`.
* Standardized UI dependencies on **MUI v5**, restoring stable compatibility with React 17.
* Resolved incompatible testing dependencies by aligning testing libraries with React 17.
* Added required Node.js polyfills for browser-based Web3 libraries using Vite configuration (Node globals and module polyfills plus Rollup node polyfills).
* Fixed a React Router + MUI v5 interop issue where a function-valued `className` was passed to MUI `Button`, causing runtime warnings; updated Navbar usage to align with MUI v5 prop expectations.
* Introduced Offline Safe Mode as the default execution path, allowing the application to run without external network dependencies.
* Implemented a deterministic proof script to verify local execution after dependency repair.

The project now installs, runs locally, and exposes a reproducible proof of correct execution.

---

## Run

    npm install
    npm run start

The application will be available at:

    http://localhost:5173

## **Proof Script**

A small Node.js proof script is included to confirm that the project runs correctly after dependency fixes.

### Steps

**1. In Terminal 1, start the app:**

```bash
npm run start
```

**2. In Terminal 2 (CMD on Windows), run the proof script:**

```bash
npm run prove
```

### Expected Output

```text
PROOF: PASS ✅
```

### What the Proof Script Verifies
* Node.js execution
* Local probe server startup
* Vite dev server reachability (HTTP 200 response)
* Deterministic confirmation that the repaired project runs correctly

Optional override:

```bash
set VITE_URL=http://localhost:5173/&& npm run prove
```

---

## **Offline Safe Mode**

Offline Safe Mode is enabled by default and prevents external network calls during development.

* Default behavior makes no Moralis or external HTTPS requests
* All network-dependent logic is conditionally loaded
* Ensures deterministic startup in restricted or offline environments

### **Implementation Notes**

* Moralis-dependent logic was isolated into dedicated components (e.g. `Networks.moralis.jsx`)
* Hooks such as `useMoralis` and `useChain` are only executed when Moralis is enabled
* This avoids invalid hook execution and eliminates runtime crashes when Moralis is disabled

To explicitly enable Moralis and external services:

    set VITE_ENABLE_MORALIS=true&& npm run start

---

## Environment Configuration

Only **one environment file** is included in the repository:

### `.env.example`

```env
VITE_ENABLE_REMOTE=false
VITE_MORALIS_APP_ID=
VITE_MORALIS_SERVER_URL=
```

* `.env.example` serves as a template for optional Moralis configuration.
* `.env.local` may be created locally but is **ignored by git**.
* No environment variables are required for a clean local startup.

---

## **Files Included for Review**
* `package.json`
* `package-lock.json`
* `vite.config.js`
* `src/index.jsx`
* `src/components/Chains/Networks.jsx`
* `src/components/Chains/Networks.moralis.jsx`
* `scripts/prove.mjs`
* `README.md`

---

## **Notes**
* Console messages such as `Content Script Bridge...` may appear due to browser extensions and are **not related to the application**.
* The application includes embedded third party content such as YouTube which may load after the initial render.
* This behavior does not affect dependency correctness or application startup and is intentionally excluded from the proof script.

---

## **Result**
The broken Node.js project was successfully repaired. It installs cleanly, runs locally without errors, and includes a deterministic proof script demonstrating correct execution.

