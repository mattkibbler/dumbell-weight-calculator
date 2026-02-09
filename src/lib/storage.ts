import type { WeightPlate, StorageData } from './types';

const STORAGE_KEY = 'dumbbell-calculator-plates';

// Default plates to initialize with
const DEFAULT_PLATES: WeightPlate[] = [
	{ id: 'plate-1.25', weight: 1.25, quantity: 4 },
	{ id: 'plate-2.5', weight: 2.5, quantity: 4 },
	{ id: 'plate-5', weight: 5, quantity: 4 },
	{ id: 'plate-10', weight: 10, quantity: 2 },
];

export function loadPlates(): WeightPlate[] {
	if (typeof window === 'undefined') return DEFAULT_PLATES;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return DEFAULT_PLATES;

		const data: StorageData = JSON.parse(stored);
		return data.plates;
	} catch (error) {
		console.error('Failed to load plates:', error);
		return DEFAULT_PLATES;
	}
}

export function savePlates(plates: WeightPlate[]): void {
	if (typeof window === 'undefined') return;

	try {
		const data: StorageData = {
			plates,
			lastUpdated: new Date().toISOString(),
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save plates:', error);
	}
}

export function addPlate(plate: WeightPlate): WeightPlate[] {
	const plates = loadPlates();
	plates.push(plate);
	savePlates(plates);
	return plates;
}

export function updatePlate(
	id: string,
	updates: Partial<WeightPlate>
): WeightPlate[] {
	const plates = loadPlates();
	const index = plates.findIndex((p) => p.id === id);
	if (index !== -1) {
		plates[index] = { ...plates[index], ...updates };
		savePlates(plates);
	}
	return plates;
}

export function deletePlate(id: string): WeightPlate[] {
	const plates = loadPlates().filter((p) => p.id !== id);
	savePlates(plates);
	return plates;
}

export function generatePlateId(): string {
	return `plate-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
