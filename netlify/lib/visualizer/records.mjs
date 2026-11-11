// In-memory stand-ins for the database and the blob store, used by tests and the local preview server.
export function memoryBlobs() {
  const data = new Map();
  const asBuffer = (value) => Buffer.isBuffer(value) ? value : Buffer.from(value);
  const asRead = (entry, type) => type === "arrayBuffer"
    ? entry.value.buffer.slice(entry.value.byteOffset, entry.value.byteOffset + entry.value.byteLength)
    : entry.value;
  return {
    async set(key, value, opts = {}) {
      data.set(key, { value: asBuffer(value), metadata: opts.metadata || {} });
    },
    async setJSON(key, value) {
      return this.set(key, JSON.stringify(value));
    },
    async get(key, opts = {}) {
      const entry = data.get(key);
      if (!entry) return null;
      if (opts.type === "json") return JSON.parse(entry.value.toString());
      return asRead(entry, opts.type);
    },
    async list({ prefix } = {}) {
      const blobs = [];
      for (const key of data.keys()) {
        if (!prefix || key.startsWith(prefix)) blobs.push({ key });
      }
      return { blobs };
    },
    async getWithMetadata(key, opts = {}) {
      const entry = data.get(key);
      if (!entry) return null;
      return { data: asRead(entry, opts.type), metadata: entry.metadata, etag: "1" };
    },
  };
}

export function memoryRecords() {
  const sessions = new Map();
  const renders = new Map();
  const leads = new Map();
  const jobs = new Map();
  const usage = new Map();
  const events = [];
  return {
    async createSession(row) { sessions.set(row.id, { ...row }); return sessions.get(row.id); },
    async getSession(id) { return sessions.get(id) || null; },
    async updateSession(id, patch) {
      const cur = sessions.get(id);
      if (!cur) return null;
      sessions.set(id, { ...cur, ...patch });
      return sessions.get(id);
    },
    async addRender(row) { renders.set(row.id, { ...row }); return renders.get(row.id); },
    async getRender(id) { return renders.get(id) || null; },
    async listRenders(sessionId) { return [...renders.values()].filter(r => r.sessionId === sessionId); },
    async addLead(row) { leads.set(row.id, { ...row }); return leads.get(row.id); },
    async listLeads() { return [...leads.values()].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))); },
    async getLead(id) { return leads.get(id) || null; },
    async bumpUsage(ipHash, day, field, by = 1) {
      const key = `${ipHash}|${day}`;
      const row = usage.get(key) || { ipHash, day, scans: 0, renders: 0, edits: 0, leads: 0, uploads: 0, logins: 0 };
      row[field] = (row[field] || 0) + by;
      usage.set(key, row);
      return row[field];
    },
    async getUsage(ipHash, day) {
      return usage.get(`${ipHash}|${day}`) || { scans: 0, renders: 0, edits: 0, leads: 0, uploads: 0, logins: 0 };
    },
    async addEvent(row) { events.push(row); },
    async listEvents() { return events.slice(); },
    async addJob(row) { jobs.set(row.id, { ...row, variants: row.variants || [] }); return jobs.get(row.id); },
    async getJob(id) { return jobs.get(id) || null; },
    async updateJob(id, patch) {
      const cur = jobs.get(id);
      if (!cur) return null;
      jobs.set(id, { ...cur, ...patch });
      return jobs.get(id);
    },
  };
}

// Sessions, renders, leads, and usage counters. Netlify Database is not available on this
// account (the build fails with "database feature not available"), so these records live in
// the same Blobs store as the images, the way sign-mockup proofs already do.
export function blobRecords(blobs, ns) {
  const key = (kind, id) => `${ns}/records/${kind}/${id}.json`;
  const read = (kind, id) => blobs.get(key(kind, id), { type: "json" });
  const emptyUsage = { scans: 0, renders: 0, edits: 0, leads: 0, uploads: 0, logins: 0 };
  return {
    async createSession(row) { await blobs.setJSON(key("sessions", row.id), row); return row; },
    async getSession(id) { return read("sessions", id); },
    async updateSession(id, patch) {
      const cur = await read("sessions", id);
      if (!cur) return null;
      const next = { ...cur, ...patch };
      await blobs.setJSON(key("sessions", id), next);
      return next;
    },
    async addRender(row) { await blobs.setJSON(key("renders", row.id), row); return row; },
    async getRender(id) { return read("renders", id); },
    async listRenders(sessionId) {
      const listed = await blobs.list({ prefix: `${ns}/records/renders/` });
      const rows = [];
      for (const item of listed.blobs || []) {
        const row = await blobs.get(item.key, { type: "json" });
        if (row && row.sessionId === sessionId) rows.push(row);
      }
      return rows;
    },
    async addLead(row) { await blobs.setJSON(key("leads", row.id), row); return row; },
    async getLead(id) { return read("leads", id); },
    async listLeads() {
      const listed = await blobs.list({ prefix: `${ns}/records/leads/` });
      const rows = [];
      for (const item of listed.blobs || []) {
        const row = await blobs.get(item.key, { type: "json" });
        if (row) rows.push(row);
      }
      return rows.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    },
    async bumpUsage(ipHash, day, field, by = 1) {
      const id = `${ipHash}_${day}`;
      const cur = (await read("usage", id)) || { ipHash, day, ...emptyUsage };
      cur[field] = (cur[field] || 0) + by;
      await blobs.setJSON(key("usage", id), cur);
      return cur[field];
    },
    async getUsage(ipHash, day) {
      return (await read("usage", `${ipHash}_${day}`)) || { ...emptyUsage };
    },
    async addEvent(row) { await blobs.setJSON(key("events", row.id), row); },
    async addJob(row) { await blobs.setJSON(key("jobs", row.id), row); return row; },
    async getJob(id) { return read("jobs", id); },
    async updateJob(id, patch) {
      const cur = await read("jobs", id);
      if (!cur) return null;
      const next = { ...cur, ...patch };
      await blobs.setJSON(key("jobs", id), next);
      return next;
    },
  };
}
