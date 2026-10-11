"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SpProviderPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var http = __toESM(require("http"));
var crypto = __toESM(require("crypto"));
var DEFAULT_SETTINGS = {
  port: 27124,
  apiKey: ""
};
var SpProviderPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.server = null;
  }
  async onload() {
    await this.loadSettings();
    if (!this.settings.apiKey) {
      this.settings.apiKey = crypto.randomBytes(32).toString("hex");
      await this.saveSettings();
    }
    this.addSettingTab(new SpProviderSettingTab(this.app, this));
    this.startServer();
  }
  onunload() {
    this.stopServer();
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  // ── HTTP server ─────────────────────────────────────────────────────────────
  startServer() {
    this.stopServer();
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res).catch((err) => {
        console.error("[SP Provider] Unhandled error:", err);
        this.sendJson(res, 500, { error: "Internal server error" });
      });
    });
    this.server.listen(this.settings.port, "127.0.0.1", () => {
      console.log(`[SP Provider] Listening on http://127.0.0.1:${this.settings.port}`);
    });
    this.server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`[SP Provider] Port ${this.settings.port} is already in use.`);
      } else {
        console.error("[SP Provider] Server error:", err);
      }
    });
  }
  stopServer() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
  // ── Request router ──────────────────────────────────────────────────────────
  async handleRequest(req, res) {
    var _a, _b, _c, _d;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    const auth = (_a = req.headers["authorization"]) != null ? _a : "";
    if (auth !== `Bearer ${this.settings.apiKey}`) {
      this.sendJson(res, 401, { error: "Unauthorized" });
      return;
    }
    const url = new URL((_b = req.url) != null ? _b : "/", `http://127.0.0.1:${this.settings.port}`);
    const pathname = decodeURIComponent(url.pathname);
    if (req.method === "GET" && pathname === "/") {
      this.sendJson(res, 200, { status: "ok" });
      return;
    }
    if (req.method === "POST" && pathname.startsWith("/search/simple")) {
      const query = (_c = url.searchParams.get("query")) != null ? _c : "";
      const contextLength = parseInt((_d = url.searchParams.get("contextLength")) != null ? _d : "100", 10);
      const results = await this.searchVault(query, contextLength);
      this.sendJson(res, 200, results);
      return;
    }
    if (pathname.startsWith("/vault/")) {
      const recursive = url.searchParams.get("recursive") === "true";
      await this.handleVaultRequest(req, res, pathname, recursive);
      return;
    }
    this.sendJson(res, 404, { error: "Not found" });
  }
  async handleVaultRequest(req, res, pathname, recursive = false) {
    const vaultPath = pathname.slice("/vault/".length);
    const isFolder = vaultPath === "" || vaultPath.endsWith("/");
    if (req.method === "GET" && isFolder) {
      const folder = vaultPath.replace(/\/$/, "") || "/";
      const files = this.listFolder(folder, recursive);
      this.sendJson(res, 200, { files });
      return;
    }
    if (req.method === "GET" && vaultPath !== "") {
      const result = await this.readFileWithMeta(vaultPath);
      if (result === null) {
        this.sendJson(res, 404, { error: "Not found" });
      } else {
        this.sendJson(res, 200, result);
      }
      return;
    }
    if (req.method === "PUT" && vaultPath !== "") {
      const body = await this.readBody(req);
      let content;
      try {
        const parsed = JSON.parse(body);
        content = typeof parsed.content === "string" ? parsed.content : body;
      } catch (e) {
        content = body;
      }
      await this.writeFile(vaultPath, content);
      this.sendJson(res, 200, { ok: true });
      return;
    }
    this.sendJson(res, 404, { error: "Not found" });
  }
  // ── Vault operations ────────────────────────────────────────────────────────
  async readFileWithMeta(vaultPath) {
    const file = this.app.vault.getAbstractFileByPath((0, import_obsidian.normalizePath)(vaultPath));
    if (!(file instanceof import_obsidian.TFile)) return null;
    const content = await this.app.vault.cachedRead(file);
    return { content, mtime: file.stat.mtime };
  }
  async writeFile(vaultPath, content) {
    const normalPath = (0, import_obsidian.normalizePath)(vaultPath);
    const existing = this.app.vault.getAbstractFileByPath(normalPath);
    if (existing instanceof import_obsidian.TFile) {
      await this.app.vault.process(existing, () => content);
    } else {
      const parts = normalPath.split("/");
      parts.pop();
      if (parts.length > 0) {
        await this.ensureFolderExists(parts.join("/"));
      }
      await this.app.vault.create(normalPath, content);
    }
  }
  // Creates each missing ancestor folder in order. vault.createFolder does not
  // recurse, so we walk the segments manually.
  async ensureFolderExists(folderPath) {
    const parts = folderPath.split("/").filter(Boolean);
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(current)) {
        await this.app.vault.createFolder(current);
      }
    }
  }
  // When `recursive` is false, only direct children of the folder are returned.
  // When true, every markdown file under the folder (any depth) is returned, with
  // `name` kept relative to the folder so nested paths survive the round-trip.
  listFolder(folderPath, recursive = false) {
    const isRoot = folderPath === "/" || folderPath === "";
    const allFiles = this.app.vault.getMarkdownFiles();
    return allFiles.filter((f) => {
      if (isRoot) return recursive || !f.path.includes("/");
      if (!f.path.startsWith(folderPath + "/")) return false;
      return recursive || f.path.slice(folderPath.length + 1).split("/").length === 1;
    }).sort((a, b) => b.stat.mtime - a.stat.mtime).map((f) => ({
      name: isRoot ? f.path : f.path.slice(folderPath.length + 1),
      mtime: f.stat.mtime
    }));
  }
  async searchVault(query, contextLength) {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    const results = [];
    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
      const content = await this.app.vault.cachedRead(file);
      const lowerContent = content.toLowerCase();
      const matches = [];
      let pos = 0;
      while (pos < lowerContent.length) {
        const idx = lowerContent.indexOf(lower, pos);
        if (idx === -1) break;
        const start = Math.max(0, idx - contextLength);
        const end = Math.min(content.length, idx + lower.length + contextLength);
        matches.push({
          match: { start: idx, end: idx + lower.length },
          context: content.slice(start, end)
        });
        pos = idx + lower.length;
        if (matches.length >= 10) break;
      }
      if (matches.length > 0) {
        results.push({ filename: file.path, matches, score: matches.length });
      }
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 50);
  }
  // ── Helpers ─────────────────────────────────────────────────────────────────
  sendJson(res, status, body) {
    const json = JSON.stringify(body);
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(json);
  }
  readBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      req.on("error", reject);
    });
  }
};
var SpProviderSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Port").setDesc("The port the HTTP server listens on. Restart Obsidian after changing.").addText(
      (text) => text.setPlaceholder("27124").setValue(String(this.plugin.settings.port)).onChange(async (value) => {
        const port = parseInt(value, 10);
        if (port > 0 && port < 65536) {
          this.plugin.settings.port = port;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(containerEl).setName("API Key").setDesc("Paste this into Super Productivity \u2192 Settings \u2192 Issue Providers \u2192 Obsidian \u2192 API Key.").addText(
      (text) => text.setValue(this.plugin.settings.apiKey).setDisabled(true)
    ).addButton(
      (btn) => btn.setButtonText("Copy").onClick(() => {
        navigator.clipboard.writeText(this.plugin.settings.apiKey);
      })
    ).addButton(
      (btn) => btn.setButtonText("Regenerate").setWarning().onClick(async () => {
        this.plugin.settings.apiKey = crypto.randomBytes(32).toString("hex");
        await this.plugin.saveSettings();
        this.display();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Base URL").setDesc("Enter this as the Base URL in Super Productivity.").addText(
      (text) => text.setValue(`http://127.0.0.1:${this.plugin.settings.port}`).setDisabled(true)
    );
    const infoEl = containerEl.createEl("p", { cls: "setting-item-description" });
    infoEl.appendText("Documentation & source code: ");
    infoEl.createEl("a", {
      text: "codeberg.org/sinenomine/obsidian-sp-provider",
      href: "https://codeberg.org/sinenomine/obsidian-sp-provider"
    });
    infoEl.appendText(" \xB7 SP plugin: ");
    infoEl.createEl("a", {
      text: "codeberg.org/sinenomine/sp-obsidian",
      href: "https://codeberg.org/sinenomine/sp-obsidian"
    });
  }
};
