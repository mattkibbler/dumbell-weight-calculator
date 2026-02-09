// Generate a consistent color for a given plate weight
export function getPlateColor(weight: number): string {
	// Use a predefined color palette for common weights
	const colorMap: Record<number, string> = {
		0.5: '#ef4444', // red
		1: '#f97316', // orange
		1.25: '#f59e0b', // amber
		2: '#eab308', // yellow
		2.5: '#84cc16', // lime
		5: '#22c55e', // green
		7.5: '#14b8a6', // teal
		10: '#06b6d4', // cyan
		15: '#3b82f6', // blue
		20: '#6366f1', // indigo
		25: '#8b5cf6', // violet
	};

	// Check if we have a predefined color
	if (colorMap[weight]) {
		return colorMap[weight];
	}

	// Generate a color based on weight using HSL
	// Use weight as hue seed for consistent colors
	const hue = (weight * 137.508) % 360; // Golden angle for better distribution
	return `hsl(${hue}, 70%, 50%)`;
}

// Get a lighter version for backgrounds
export function getPlateLightColor(weight: number): string {
	const colorMap: Record<number, string> = {
		0.5: '#fee2e2', // red-100
		1: '#ffedd5', // orange-100
		1.25: '#fef3c7', // amber-100
		2: '#fef9c3', // yellow-100
		2.5: '#ecfccb', // lime-100
		5: '#dcfce7', // green-100
		7.5: '#ccfbf1', // teal-100
		10: '#cffafe', // cyan-100
		15: '#dbeafe', // blue-100
		20: '#e0e7ff', // indigo-100
		25: '#ede9fe', // violet-100
	};

	if (colorMap[weight]) {
		return colorMap[weight];
	}

	// Generate a lighter version
	const hue = (weight * 137.508) % 360;
	return `hsl(${hue}, 70%, 90%)`;
}
