import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db/index.js";
import { visualizerEvents, visualizerLeads, visualizerRenders, visualizerSessions, visualizerUsage } from "../../../db/schema.js";

export function drizzleRecords() {
  const db = getDb();
  return {
    async createSession(row) {
      await db.insert(visualizerSessions).values(row);
      return row;
    },
    async getSession(id) {
      const [row] = await db.select().from(visualizerSessions).where(eq(visualizerSessions.id, id)).limit(1);
      return row || null;
    },
    async updateSession(id, patch) {
      await db.update(visualizerSessions).set(patch).where(eq(visualizerSessions.id, id));
      return this.getSession(id);
    },
    async addRender(row) {
      await db.insert(visualizerRenders).values(row);
      return row;
    },
    async getRender(id) {
      const [row] = await db.select().from(visualizerRenders).where(eq(visualizerRenders.id, id)).limit(1);
      return row || null;
    },
    async listRenders(sessionId) {
      return db.select().from(visualizerRenders).where(eq(visualizerRenders.sessionId, sessionId));
    },
    async addLead(row) {
      await db.insert(visualizerLeads).values(row);
      return row;
    },
    async listLeads() {
      return db.select().from(visualizerLeads).orderBy(desc(visualizerLeads.createdAt));
    },
    async getLead(id) {
      const [row] = await db.select().from(visualizerLeads).where(eq(visualizerLeads.id, id)).limit(1);
      return row || null;
    },
    async bumpUsage(ipHash, day, field, by = 1) {
      const [cur] = await db.select().from(visualizerUsage).where(and(eq(visualizerUsage.ipHash, ipHash), eq(visualizerUsage.day, day))).limit(1);
      if (!cur) {
        const row = { ipHash, day, scans: 0, renders: 0, edits: 0, leads: 0, uploads: 0, logins: 0, [field]: by };
        await db.insert(visualizerUsage).values(row);
        return by;
      }
      const next = (cur[field] || 0) + by;
      await db.update(visualizerUsage).set({ [field]: next }).where(and(eq(visualizerUsage.ipHash, ipHash), eq(visualizerUsage.day, day)));
      return next;
    },
    async getUsage(ipHash, day) {
      const [cur] = await db.select().from(visualizerUsage).where(and(eq(visualizerUsage.ipHash, ipHash), eq(visualizerUsage.day, day))).limit(1);
      return cur || { scans: 0, renders: 0, edits: 0, leads: 0, uploads: 0, logins: 0 };
    },
    async addEvent(row) {
      await db.insert(visualizerEvents).values(row);
    },
  };
}
