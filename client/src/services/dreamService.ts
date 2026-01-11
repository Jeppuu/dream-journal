import api from "./api";
import type { DreamEntry } from "../types/DreamEntry";

const base = "/api/dreamentries";

export const dreamService = {
  async getAll(): Promise<DreamEntry[]> {
    const { data } = await api.get<DreamEntry[]>(base);
    return data;
  },

  async getById(id: number): Promise<DreamEntry> {
    const { data } = await api.get<DreamEntry>(`${base}/${id}`);
    return data;
  },

  async create(entry: Partial<DreamEntry>): Promise<DreamEntry> {
    const { data } = await api.post<DreamEntry>(base, entry);
    return data;
  },

  async update(id: number, entry: Partial<DreamEntry>): Promise<void> {
    await api.put(`${base}/${id}`, entry);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${base}/${id}`);
  },

  async search(query: string): Promise<DreamEntry[]> {
    const { data } = await api.get<DreamEntry[]>(`${base}?search=${encodeURIComponent(query)}`);
    return data;
  },

  async getByMood(mood: string): Promise<DreamEntry[]> {
    const { data } = await api.get<DreamEntry[]>(`${base}?mood=${encodeURIComponent(mood)}`);
    return data;
  },

  async getByDateRange(start: string, end: string): Promise<DreamEntry[]> {
    const { data } = await api.get<DreamEntry[]>(`${base}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
    return data;
  },
};

export default dreamService;
