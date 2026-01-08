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

## **Dependency Fix Summary**

This project initially failed to install and run due to multiple dependency and configuration issues. The following fixes were applied:

* Fixed React runtime mismatch: the project uses React 17, so react-dom client (React 18 API) was removed and the entrypoint was reverted to ReactDOM.render.
* Resolved incompatible testing dependencies by aligning testing libraries with React 17.
* Added required Node.js polyfills for browser based Web3 libraries using Vite configuration (Node globals and module polyfills plus Rollup node polyfills).
* Implemented Offline Safe Mode to prevent external network calls (notably Moralis and network fetching plugins) unless explicitly enabled.
* Made network dependent providers conditional via environment variables to ensure clean local startup.

The project now installs without errors and runs cleanly.

## Run

    npm install
    npm run start

The application will be available at:

    http://localhost:5173

## **Proof Script**

A small Node.js proof script is included to confirm that the project runs correctly after dependency fixes.

### **Steps**

1. In Terminal 1 start the app:

    npm run start

2. In Terminal 2 (CMD on Windows) run the proof script:

    npm run prove

Expected output:

    PROOF: PASS

The proof script verifies:
* Node.js execution
* Local probe server startup
* Vite dev server reachability
* No external network calls in Offline Safe Mode

Optional override:

    set VITE_URL=http://localhost:5173/&& npm run prove

## **Offline Safe Mode**

Offline Safe Mode is enabled by default and prevents external network calls during development.

* Default behavior makes no Moralis or external HTTPS requests
* Ensures the project runs cleanly in restricted or offline environments

To explicitly enable Moralis and external services:

    set VITE_ENABLE_MORALIS=true&& npm run start

## **Notes**

* The application includes embedded third party content such as YouTube which may load after the initial render.
* This behavior does not affect dependency correctness or application startup and is intentionally excluded from the proof script.

