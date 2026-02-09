<script lang="ts">
	import type { CalculationResult } from '../lib/types';
	import { getPlateColor } from '../lib/colors';

	export let result: CalculationResult;

	// Calculate plates per side (divide total by number of sides)
	$: platesPerSide = result.plates.map((usage) => ({
		...usage,
		countPerSide: usage.count / (result.mode === 'combined' ? 4 : 2),
	}));

	// Sort by weight ascending (lightest on outside, heaviest closest to center)
	$: sortedPlates = [...platesPerSide].sort(
		(a, b) => a.plate.weight - b.plate.weight
	);

	// Calculate plate visual size based on weight (for visual hierarchy)
	function getPlateHeight(weight: number): number {
		// Base height + scaled by weight
		return Math.min(60, 30 + weight * 3);
	}
</script>

<div class="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
	<h3 class="font-semibold text-gray-900 mb-4 text-center">
		Dumbbell Configuration
	</h3>

	<div class="space-y-6">
		{#if result.mode === 'combined'}
			<!-- Show two dumbbells -->
			{#each [1, 2] as dumbbellNum}
				<div class="flex flex-col items-center">
					<p class="text-sm text-gray-600 mb-2">
						Dumbbell {dumbbellNum} ({result.totalWeight / 2}kg)
					</p>
					<div class="flex items-center justify-center">
						<!-- Left side plates -->
						<div class="flex items-center justify-end space-x-1">
							{#each sortedPlates as usage}
								{#each Array(usage.countPerSide) as _, i}
									<div
										class="rounded-md flex items-center justify-center text-white text-xs font-bold shadow-md transition-transform hover:scale-105"
										style="
                      background-color: {getPlateColor(usage.plate.weight)};
                      width: 16px;
                      height: {getPlateHeight(usage.plate.weight)}px;
                      writing-mode: vertical-rl;
                      text-orientation: mixed;
                    "
										title="{usage.plate.weight}kg"
									>
										{usage.plate.weight}
									</div>
								{/each}
							{/each}
						</div>

						<!-- Bar -->
						<div
							class="bg-gray-700 mx-2 rounded flex items-center justify-center"
							style="width: 80px; height: 20px;"
						>
							<span class="text-white text-xs font-bold">BAR</span
							>
						</div>

						<!-- Right side plates (mirrored) -->
						<div class="flex items-center justify-start space-x-1">
							{#each sortedPlates as usage}
								{#each Array(usage.countPerSide) as _, i}
									<div
										class="rounded-md flex items-center justify-center text-white text-xs font-bold shadow-md transition-transform hover:scale-105"
										style="
                      background-color: {getPlateColor(usage.plate.weight)};
                      width: 16px;
                      height: {getPlateHeight(usage.plate.weight)}px;
                      writing-mode: vertical-rl;
                      text-orientation: mixed;
                    "
										title="{usage.plate.weight}kg"
									>
										{usage.plate.weight}
									</div>
								{/each}
							{/each}
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<!-- Show single dumbbell -->
			<div class="flex flex-col items-center">
				<p class="text-sm text-gray-600 mb-2">
					Single Dumbbell ({result.totalWeight}kg)
				</p>
				<div class="flex items-center justify-center">
					<!-- Left side plates -->
					<div class="flex items-center justify-end space-x-1">
						{#each sortedPlates as usage}
							{#each Array(usage.countPerSide) as _, i}
								<div
									class="rounded-md flex items-center justify-center text-white text-xs font-bold shadow-md transition-transform hover:scale-105"
									style="
                    background-color: {getPlateColor(usage.plate.weight)};
                    width: 16px;
                    height: {getPlateHeight(usage.plate.weight)}px;
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                  "
									title="{usage.plate.weight}kg"
								>
									{usage.plate.weight}
								</div>
							{/each}
						{/each}
					</div>

					<!-- Bar -->
					<div
						class="bg-gray-700 mx-2 rounded flex items-center justify-center"
						style="width: 80px; height: 20px;"
					>
						<span class="text-white text-xs font-bold">BAR</span>
					</div>

					<!-- Right side plates (mirrored) -->
					<div class="flex items-center justify-start space-x-1">
						{#each sortedPlates as usage}
							{#each Array(usage.countPerSide) as _, i}
								<div
									class="rounded-md flex items-center justify-center text-white text-xs font-bold shadow-md transition-transform hover:scale-105"
									style="
                    background-color: {getPlateColor(usage.plate.weight)};
                    width: 16px;
                    height: {getPlateHeight(usage.plate.weight)}px;
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                  "
									title="{usage.plate.weight}kg"
								>
									{usage.plate.weight}
								</div>
							{/each}
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<p class="text-xs text-gray-500 text-center mt-3">
		Heavier plates are closer to the center for proper balance
	</p>
</div>
