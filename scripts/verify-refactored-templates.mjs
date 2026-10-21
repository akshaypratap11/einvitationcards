import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const SCRATCH_DIR = "/home/akshay/.gemini/antigravity-cli/brain/69f3c794-630f-4097-84fd-a409142a7266/scratch";
if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

async function createBrowserSession(port = 9225) {
  const browserProc = spawn("/usr/bin/chromium", [
    `--remote-debugging-port=${port}`,
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
  ]);

  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!ready) {
    browserProc.kill();
    throw new Error("Could not connect to Chromium CDP");
  }

  return { browserProc, port };
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function captureTab(port, url, prefix, width, height) {
  const res = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  const tab = await res.json();
  const cdp = new CDPClient(tab.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send("Page.enable");
  await cdp.send("DOM.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: width < 600,
  });

  await new Promise((r) => setTimeout(r, 1500));

  // Screenshot 1: Intro (if present)
  const introShot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(SCRATCH_DIR, `${prefix}_intro_${width}px.png`),
    Buffer.from(introShot.data, "base64")
  );

  // Click #intro if present
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.getElementById("intro");
      if (el) el.click();
    })()`,
  });

  await new Promise((r) => setTimeout(r, 5000));

  // Screenshot 2: Hero
  const heroShot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(SCRATCH_DIR, `${prefix}_hero_${width}px.png`),
    Buffer.from(heroShot.data, "base64")
  );

  // Scroll to couple/pair section
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.querySelector(".couple");
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1500));

  const pairShot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(SCRATCH_DIR, `${prefix}_pair_${width}px.png`),
    Buffer.from(pairShot.data, "base64")
  );

  // Scroll to venue section
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.querySelector(".venue");
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1000));

  const venueShot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(SCRATCH_DIR, `${prefix}_venue_${width}px.png`),
    Buffer.from(venueShot.data, "base64")
  );

  cdp.close();
  await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`);
  console.log(`Captured all views for ${prefix} at ${width}px`);
}

async function run() {
  const { browserProc, port } = await createBrowserSession(9225);

  const targets = [
    { url: "http://localhost:3000/demo/wedding", prefix: "refactor_demo_wedding" },
    { url: "http://localhost:3000/demo/birthday", prefix: "refactor_demo_birthday" },
    { url: "http://localhost:3000/demo/ghar", prefix: "refactor_demo_ghar" },
    { url: "http://localhost:3000/preview/wedding", prefix: "refactor_preview_wedding" },
    { url: "http://localhost:3000/preview/birthday", prefix: "refactor_preview_birthday" },
    { url: "http://localhost:3000/preview/ghar", prefix: "refactor_preview_ghar" },
  ];

  for (const t of targets) {
    console.log(`Processing: ${t.url}`);
    // Mobile 375px
    await captureTab(port, t.url, t.prefix, 375, 812);
    // Desktop 1280px
    await captureTab(port, t.url, t.prefix, 1280, 800);
  }

  browserProc.kill();
  console.log("All verifications complete!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
