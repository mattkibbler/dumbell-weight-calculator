<script lang="ts">
	import type { CalculatorMode, CalculationResult } from '../lib/types';
	import { loadPlates } from '../lib/storage';
	import { calculateOptimalCombination } from '../lib/calculator';
	import ModeToggle from './ModeToggle.svelte';
	import CalculationResultDisplay from './CalculationResult.svelte';

	let targetWeight = '';
	let mode: CalculatorMode = 'single';
	let result: CalculationResult | null = null;
	let isCalculating = false;

	// Reset result when mode or target changes
	$: if (mode || targetWeight) {
		result = null;
	}

	function handleModeChange(newMode: CalculatorMode) {
		mode = newMode;
	}

	function handleCalculate(e: Event) {
		e.preventDefault();

		const target = parseFloat(targetWeight);

		if (isNaN(target) || target <= 0) {
			alert('Please enter a valid target weight greater than 0');
			return;
		}

		isCalculating = true;

		// Use setTimeout to allow UI to update with loading state
		setTimeout(() => {
			const plates = loadPlates();
			const calculationResult = calculateOptimalCombination(
				plates,
				target,
				mode
			);
			result = calculationResult;
			isCalculating = false;
		}, 100);
	}
</script>

<div class="card">
	<h2 class="text-2xl font-bold text-gray-900 mb-4">Calculate Weight</h2>

	<form on:submit={handleCalculate} class="space-y-6">
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1">
				Target Weight (kg)
			</label>
			<input
				type="number"
				bind:value={targetWeight}
				class="input-field w-full text-lg"
				placeholder="e.g., 15"
				step="any"
				min="0.01"
				required
			/>
		</div>

		<ModeToggle {mode} onChange={handleModeChange} />

		<button
			type="submit"
			class="btn-primary w-full text-lg"
			disabled={isCalculating}
		>
			{isCalculating ? 'Calculating...' : 'Calculate'}
		</button>
	</form>

	{#if result}
		<CalculationResultDisplay {result} />
	{/if}
</div>
