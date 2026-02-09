<script lang="ts">
	import type { CalculationResult } from '../lib/types';
	import { getPlateColor, getPlateLightColor } from '../lib/colors';
	import DumbbellVisual from './DumbbellVisual.svelte';

	export let result: CalculationResult;

	$: perDumbbell =
		result.mode === 'combined'
			? result.totalWeight / 2
			: result.totalWeight;
</script>

{#if !result.success}
	<div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
		<h3 class="font-semibold text-red-900 mb-2">Cannot Calculate</h3>
		<p class="text-red-700">{result.error}</p>
	</div>
{:else}
	<div class="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
		<h3 class="font-semibold text-green-900 mb-4 text-lg">
			Plate Combination Found
		</h3>

		<div class="space-y-2 mb-4">
			{#each result.plates as usage, index}
				<div
					class="flex justify-between items-center py-2 px-3 rounded"
					style="background-color: {getPlateLightColor(
						usage.plate.weight
					)}"
				>
					<div class="flex items-center space-x-3">
						<div
							class="w-4 h-4 rounded-full flex-shrink-0"
							style="background-color: {getPlateColor(
								usage.plate.weight
							)}"
						></div>
						<span class="font-medium text-gray-900">
							{usage.count}x {usage.plate.weight}kg plates
						</span>
					</div>
					<span class="text-gray-700 font-semibold">
						= {(usage.count * usage.plate.weight).toFixed(2)}kg
					</span>
				</div>
			{/each}
		</div>

		<div class="pt-4 border-t border-green-300">
			<div class="flex justify-between items-center font-bold text-lg">
				<span class="text-green-900">Total Weight:</span>
				<span class="text-green-900">{result.totalWeight}kg</span>
			</div>
			{#if result.mode === 'combined'}
				<p class="text-sm text-green-700 mt-2">
					({perDumbbell}kg per dumbbell)
				</p>
			{/if}
		</div>
	</div>

	<DumbbellVisual {result} />
{/if}
