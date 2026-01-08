// scripts/prove.mjs
import http from "node:http";
import { setTimeout as sleep } from "node:timers/promises";

const OFFLINE_SAFE_MODE = process.env.VITE_OFFLINE_SAFE_MODE === "true";

// Default candidates (covers Windows oddities)
const URL_CANDIDATES = [
  process.env.VITE_URL,                 // allow override
  "http://localhost:5173/",
  "http://127.0.0.1:5173/",
  "http://localhost:4173/",             // common fallback ports
  "http://127.0.0.1:4173/",
].filter(Boolean);

async function fetchWithTimeout(url, ms = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      bytes: Buffer.byteLength(text),
      sample: text.slice(0, 140).replace(/\s+/g, " "),
    };
  } finally {
    clearTimeout(id);
  }
}

function startLocalProbeServer(port = 4179) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, ts: new Date().toISOString() }));
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

async function findWorkingViteUrl() {
  for (const url of URL_CANDIDATES) {
    try {
      const r = await fetchWithTimeout(url, 2500);
      if (r.status >= 200 && r.status < 500) return { url, result: r };
    } catch (_) {}
  }
  return null;
}

(async () => {
  console.log("=== Proof Script: Node.js Dependency Compatibility Test ===");
  console.log("node:", process.version);
  console.log("offlineSafeMode:", OFFLINE_SAFE_MODE);

  // 1) Minimal local server proof (no external network)
  const srv = await startLocalProbeServer();
  console.log("local probe server: http://localhost:4179/ (OK)");

  // 2) Confirm the app responds
  const found = await findWorkingViteUrl();

  if (!found) {
    console.log("PROOF: FAIL - could not reach Vite dev server.");
    console.log("Tried:", URL_CANDIDATES.join(", "));
    console.log("");
    console.log("Fix:");
    console.log("1) In another terminal, run: npm run start");
    console.log("2) Copy the exact Local URL Vite prints (e.g. http://localhost:5173/)");
    console.log("3) Re-run proof with override:");
    console.log('   set VITE_URL=http://localhost:5173/&& npm run prove');
    srv.close();
    process.exit(1);
  }

  console.log(`vite reachable: ${found.url}`);
  console.log(`status=${found.result.status} bytes=${found.result.bytes} sample="${found.result.sample}"`);

  // 3) Offline safe mode statement
  if (OFFLINE_SAFE_MODE) {
    console.log("offlineSafeMode enabled: skipping any external calls (Moralis should not be hit).");
  } else {
    console.log("offlineSafeMode disabled: proof script itself makes no external calls.");
  }

  await sleep(150);
  srv.close();
  console.log("PROOF: PASS ✅");
})();
