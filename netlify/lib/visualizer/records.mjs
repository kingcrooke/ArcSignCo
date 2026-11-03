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
    async get(key, opts = {}) {
      const entry = data.get(key);
      return entry ? asRead(entry, opts.type) : null;
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
  };
}
