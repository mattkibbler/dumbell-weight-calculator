// Represents a weight plate type
export interface WeightPlate {
	id: string; // Unique identifier (e.g., "plate-1234567890")
	weight: number; // Weight in KG (e.g., 1.25, 2.5, 5, 10)
	quantity: number; // Available quantity
}

// Calculator mode
export type CalculatorMode = 'single' | 'combined';

// Result of a calculation
export interface CalculationResult {
	success: boolean;
	plates: PlateUsage[]; // Array of plates used
	totalWeight: number; // Actual weight achieved
	targetWeight: number; // Target weight requested
	mode: CalculatorMode;
	error?: string; // Error message if success = false
}

// Tracks how many of each plate type is used
export interface PlateUsage {
	plate: WeightPlate;
	count: number; // How many of this plate used
}

// LocalStorage schema
export interface StorageData {
	plates: WeightPlate[];
	lastUpdated: string; // ISO timestamp
}
