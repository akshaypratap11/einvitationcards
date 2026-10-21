import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const SCRATCH_DIR = "/home/akshay/.gemini/antigravity-cli/brain/69f3c794-630f-4097-84fd-a409142a7266/scratch";
if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

async function createBrowserSession(port = 9223) {
  const browserProc = spawn("/usr/bin/chromium", [
    `--remote-debugging-port=${port}`,
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
  ]);

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!wsUrl) {
    browserProc.kill();
    throw new Error("Could not connect to Chromium CDP");
  }

  return { browserProc, wsUrl, port };
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

async function captureGharCard(url, prefix, width, height, port) {
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

  // Wait for initial load and intro animation text to rise
  await new Promise((r) => setTimeout(r, 3000));

  // Screenshot 1: Intro
  const introShot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(SCRATCH_DIR, `${prefix}_intro_${width}px.png`),
    Buffer.from(introShot.data, "base64")
  );
  console.log(`Saved ${prefix}_intro_${width}px.png`);

  // Click on #intro to open
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.getElementById("intro");
      if (el) el.click();
    })()`,
  });

  // Wait 4.8 seconds for kalash lighting + doors opening + petals shower
  await new Promise((r) => setTimeout(r, 5000));

  // Screenshot 2: Hero
  const heroShot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(SCRATCH_DIR, `${prefix}_hero_${width}px.png`),
    Buffer.from(heroShot.data, "base64")
  );
  console.log(`Saved ${prefix}_hero_${width}px.png`);

  // Scroll to New Beginning section (Old Home vs New Home)
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.querySelector(".couple");
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    })()`,
  });
  await new Promise((r) => setTimeout(r, 2000));

  const thenNowShot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(SCRATCH_DIR, `${prefix}_then_now_${width}px.png`),
    Buffer.from(thenNowShot.data, "base64")
  );
  console.log(`Saved ${prefix}_then_now_${width}px.png`);

  // Scroll to Ceremony Essentials & Schedule
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.querySelector(".cards") || document.querySelector(".tl");
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1500));

  const detailsShot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(SCRATCH_DIR, `${prefix}_details_${width}px.png`),
    Buffer.from(detailsShot.data, "base64")
  );
  console.log(`Saved ${prefix}_details_${width}px.png`);

  // Scroll to Venue & RSVP
  await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.querySelector(".rsvp") || document.querySelector(".venue");
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1500));

  const rsvpShot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(SCRATCH_DIR, `${prefix}_rsvp_${width}px.png`),
    Buffer.from(rsvpShot.data, "base64")
  );
  console.log(`Saved ${prefix}_rsvp_${width}px.png`);

  cdp.close();
  await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`);
}

async function run() {
  const { browserProc, port } = await createBrowserSession(9223);

  try {
    const refUrl = "file:///home/akshay/Projects/einvitationcard/reference/griha-pravesh.html";
    const appUrl = "http://localhost:3000/demo/ghar";

    console.log("=== Capturing Griha Pravesh Reference (375px) ===");
    await captureGharCard(refUrl, "gp_ref", 375, 812, port);

    console.log("=== Capturing Griha Pravesh App Demo (375px) ===");
    await captureGharCard(appUrl, "gp_app", 375, 812, port);

    console.log("=== Capturing Griha Pravesh Reference (1280px) ===");
    await captureGharCard(refUrl, "gp_ref", 1280, 800, port);

    console.log("=== Capturing Griha Pravesh App Demo (1280px) ===");
    await captureGharCard(appUrl, "gp_app", 1280, 800, port);

    console.log("All Griha Pravesh screenshots captured successfully!");
  } finally {
    browserProc.kill();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
