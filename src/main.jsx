import React from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import App from "./App.jsx";
import "./index.css";

/*
 * LỚP LƯU TRỮ (window.storage: get/set/delete/list)
 * - Nếu có biến môi trường VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
 *   -> dùng Supabase: MỌI người dùng (admin/giảng viên/học viên) dùng CHUNG dữ liệu.
 * - Nếu không -> dùng IndexedDB: dữ liệu chỉ nằm trong trình duyệt của từng người (chế độ demo).
 */

// ---- Adapter Supabase (dùng chung) ----
function supabaseStorage(url, anon) {
  const sb = createClient(url, anon);
  const TBL = "app_kv";
  return {
    async get(key) {
      const { data, error } = await sb.from(TBL).select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      return data ? { key, value: data.value } : null;
    },
    async set(key, value) {
      const { error } = await sb.from(TBL).upsert({ key, value }, { onConflict: "key" });
      if (error) throw error;
      return { key, value };
    },
    async delete(key) {
      await sb.from(TBL).delete().eq("key", key);
      return { key, deleted: true };
    },
    async list(prefix) {
      let q = sb.from(TBL).select("key");
      if (prefix) q = q.like("key", prefix + "%");
      const { data } = await q;
      return { keys: (data || []).map((r) => r.key) };
    },
  };
}

// ---- Adapter IndexedDB (cục bộ) ----
function idbStorage() {
  const DB_NAME = "tiem-day-nhac";
  const STORE = "kv";
  const openDB = () =>
    new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  const run = async (mode, fn) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const req = fn(t.objectStore(STORE));
      t.oncomplete = () => resolve(req ? req.result : undefined);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  };
  return {
    async get(key) { const v = await run("readonly", (s) => s.get(key)); return v === undefined ? null : { key, value: v }; },
    async set(key, value) { await run("readwrite", (s) => s.put(value, key)); return { key, value }; },
    async delete(key) { await run("readwrite", (s) => s.delete(key)); return { key, deleted: true }; },
    async list(prefix) { const keys = await run("readonly", (s) => s.getAllKeys()); return { keys: (keys || []).filter((k) => !prefix || String(k).startsWith(prefix)) }; },
  };
}

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (typeof window !== "undefined" && !window.storage) {
  window.storage = url && anon ? supabaseStorage(url, anon) : idbStorage();
  window.__STORAGE_MODE__ = url && anon ? "supabase" : "local";
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
