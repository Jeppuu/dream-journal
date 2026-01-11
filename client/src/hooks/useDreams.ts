import { useState, useCallback } from "react";
import type { DreamEntry } from "../types/DreamEntry";
import dreamService from "../services/dreamService";

export function useDreams() {
	const [entries, setEntries] = useState<DreamEntry[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchEntries = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await dreamService.getAll();
			setEntries(data);
		} catch (err) {
			console.error("Failed to load dream entries:", err);
			setError("Failed to load dream entries");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const addEntry = useCallback(async (entry: Partial<DreamEntry>) => {
		setIsLoading(true);
		setError(null);
		// Optimistic UI: insert a temporary entry while the request completes
		const tempId = Date.now() * -1;
		const temp: DreamEntry = {
			id: tempId,
			date: new Date().toISOString(),
			description: entry.description ?? "",
			mood: entry.mood ?? "",
		};
		setEntries((prev) => [temp, ...prev]);
		try {
			const created = await dreamService.create(entry);
			// Replace temp with created
			setEntries((prev) => prev.map((e) => (e.id === tempId ? created : e)));
			return created;
		} catch (err) {
			console.error("Failed to add dream entry:", err);
			setError("Failed to add dream entry");
			// remove temp
			setEntries((prev) => prev.filter((e) => e.id !== tempId));
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateEntry = useCallback(async (id: number, entry: Partial<DreamEntry>) => {
		setIsLoading(true);
		setError(null);
		const previous = entries;
		// Optimistic update
		setEntries((prev) => prev.map((e) => (e.id === id ? ({ ...e, ...entry } as DreamEntry) : e)));
		try {
			await dreamService.update(id, entry);
		} catch (err) {
			console.error("Failed to update dream entry:", err);
			setError("Failed to update dream entry");
			// revert
			setEntries(previous);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [entries]);

	const removeEntry = useCallback(async (id: number) => {
		setIsLoading(true);
		setError(null);
		const previous = entries;
		// Optimistic remove
		setEntries((prev) => prev.filter((e) => e.id !== id));
		try {
			await dreamService.remove(id);
		} catch (err) {
			console.error("Failed to delete dream entry:", err);
			setError("Failed to delete dream entry");
			// revert
			setEntries(previous);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [entries]);

	return {
		entries,
		isLoading,
		error,
		fetchEntries,
		addEntry,
		updateEntry,
		removeEntry,
	} as const;
}

export default useDreams;
