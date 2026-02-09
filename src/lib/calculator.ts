import type {
	WeightPlate,
	CalculatorMode,
	CalculationResult,
	PlateUsage,
} from './types';

/**
 * DP = Dynamic Programming
 *
 * This state tracks information for each possible weight value from 0 to target.
 * We use DP to solve the "bounded knapsack problem" - finding which combination
 * of plates (with limited quantities) adds up exactly to the target weight,
 * while minimizing the total number of plates used.
 */
interface DPState {
	achievable: boolean; // Can we reach this exact weight with available plates?
	totalPlates: number; // Minimum number of plates needed to reach this weight
	lastPlate?: WeightPlate; // The last plate type that was added to reach this weight
	lastCount?: number; // How many of lastPlate were added in the final step
	prevWeight?: number; // The weight we had before adding lastPlate (for backtracking)
}

export function calculateOptimalCombination(
	plates: WeightPlate[],
	targetKg: number,
	mode: CalculatorMode
): CalculationResult {
	// Validate input
	if (targetKg <= 0) {
		return {
			success: false,
			plates: [],
			totalWeight: 0,
			targetWeight: targetKg,
			mode,
			error: 'Target weight must be greater than 0kg',
		};
	}

	if (plates.length === 0 || plates.every((p) => p.quantity === 0)) {
		return {
			success: false,
			plates: [],
			totalWeight: 0,
			targetWeight: targetKg,
			mode,
			error: 'No plates available. Please add some plates first.',
		};
	}

	/**
	 * Calculate weight per side of dumbbell
	 *
	 * Each dumbbell has 2 sides that need identical plates for balance:
	 * - Single mode: target weight = plates on left + plates on right
	 *   So we need target/2 per side
	 * - Combined mode: target weight is split across 2 dumbbells
	 *   So target/2 per dumbbell, then /2 per side = target/4 per side
	 */
	const perSide = mode === 'combined' ? targetKg / 4 : targetKg / 2;

	/**
	 * Convert to grams to avoid floating point precision issues
	 * (e.g., 2.5kg becomes 2500 grams - an integer)
	 */
	const targetGrams = Math.round(perSide * 1000);

	/**
	 * Adjust available plate quantities
	 *
	 * We need to reserve plates for ALL sides of ALL dumbbells:
	 * - Single mode: need 2x of each plate (left + right sides of 1 dumbbell)
	 * - Combined mode: need 4x of each plate (left + right sides of 2 dumbbells)
	 *
	 * So if you have 8x 2.5kg plates in combined mode, only 2 are available
	 * per side (8 ÷ 4 = 2).
	 */
	const sidesNeeded = mode === 'combined' ? 4 : 2;
	const adjustedPlates = plates.map((plate) => ({
		...plate,
		quantity: Math.floor(plate.quantity / sidesNeeded),
	}));

	/**
	 * DYNAMIC PROGRAMMING TABLE INITIALIZATION
	 *
	 * Create an array with one entry for every possible weight from 0 to target.
	 * Each entry tracks whether that weight is achievable and how to achieve it.
	 *
	 * Example: if target is 5kg (5000g), we create dp[0] through dp[5000]
	 */
	const dp: DPState[] = new Array(targetGrams + 1).fill(null).map(() => ({
		achievable: false,
		totalPlates: Infinity,
	}));

	// Base case: 0 weight is always achievable with 0 plates
	dp[0] = { achievable: true, totalPlates: 0 };

	/**
	 * FILL THE DP TABLE (THE CORE ALGORITHM)
	 *
	 * We use the classic bounded knapsack approach: iterate through each plate
	 * type and update what weights are achievable. This ensures we don't exceed
	 * quantity limits for any plate type.
	 *
	 * Key insight: By processing plate types in the outer loop and weights in
	 * the inner loop (backwards), we ensure each plate type's quantity limit
	 * is properly enforced across the entire solution.
	 */
	for (const plate of adjustedPlates) {
		if (plate.quantity === 0) continue;

		const plateGrams = Math.round(plate.weight * 1000);

		// Process weights from high to low to avoid using the same plate multiple times
		for (let w = targetGrams; w >= plateGrams; w--) {
			if (!dp[w - plateGrams].achievable) continue;

			// Try adding 1, 2, 3... plates of this type (up to available quantity)
			for (let count = 1; count <= plate.quantity; count++) {
				const prevWeight = w - plateGrams * count;
				if (prevWeight < 0) break;
				if (!dp[prevWeight].achievable) continue;

				const newPlateCount = dp[prevWeight].totalPlates + count;

				/**
				 * Update if this is a new solution OR a better solution
				 * (uses fewer plates) than what we found before
				 */
				if (!dp[w].achievable || newPlateCount < dp[w].totalPlates) {
					dp[w] = {
						achievable: true,
						totalPlates: newPlateCount,
						lastPlate: plate,
						lastCount: count,
						prevWeight: prevWeight,
					};
				}
			}
		}
	}

	// Check if target achievable
	if (!dp[targetGrams].achievable) {
		return {
			success: false,
			plates: [],
			totalWeight: 0,
			targetWeight: targetKg,
			mode,
			error: `Cannot achieve ${perSide}kg per side with available plates`,
		};
	}

	/**
	 * BACKTRACKING TO BUILD THE SOLUTION
	 *
	 * Now that we know the target is achievable, we work backwards from
	 * the target weight to reconstruct which plates were used.
	 *
	 * Think of it like breadcrumbs: each state tells us "I got here by
	 * adding X plates from the previous weight Y", so we follow that trail
	 * back to 0.
	 */
	const plateUsage: Map<string, PlateUsage> = new Map();
	let currentWeight = targetGrams;

	while (currentWeight > 0) {
		const state = dp[currentWeight];
		if (
			!state.lastPlate ||
			!state.lastCount ||
			state.prevWeight === undefined
		)
			break;

		const key = state.lastPlate.id;
		const existing = plateUsage.get(key);

		// Accumulate plate counts as we backtrack
		if (existing) {
			existing.count += state.lastCount;
		} else {
			plateUsage.set(key, {
				plate: state.lastPlate,
				count: state.lastCount,
			});
		}

		// Move to the previous weight
		currentWeight = state.prevWeight;
	}

	/**
	 * MULTIPLY FOR ALL SIDES/DUMBBELLS
	 *
	 * The DP algorithm found the solution for ONE SIDE of ONE dumbbell.
	 * Now we multiply to account for all sides:
	 * - Single mode: multiply by 2 (left + right sides of 1 dumbbell)
	 * - Combined mode: multiply by 4 (left + right sides of 2 dumbbells)
	 *
	 * Example: DP found "1x 2.5kg plate per side" in combined mode
	 * Result: 4x 2.5kg plates total (1 per side × 4 sides)
	 */
	const multiplier = sidesNeeded;
	const result = Array.from(plateUsage.values()).map((usage) => ({
		plate: usage.plate,
		count: usage.count * multiplier,
	}));

	// Sort by plate weight (descending) for better display
	result.sort((a, b) => b.plate.weight - a.plate.weight);

	return {
		success: true,
		plates: result,
		totalWeight: targetKg,
		targetWeight: targetKg,
		mode,
	};
}
