<script lang="ts">
	import type { CalculatorMode } from '../lib/types';

	export let mode: CalculatorMode;
	export let onChange: (mode: CalculatorMode) => void;
</script>

<div class="space-y-2">
	<label class="block text-sm font-medium text-gray-700">
		Calculation Mode
	</label>
	<div class="flex items-center space-x-4">
		<button
			on:click={() => onChange('single')}
			class="px-4 py-2 rounded-lg font-medium transition-colors {mode ===
			'single'
				? 'bg-blue-600 text-white'
				: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
		>
			Single Dumbbell
		</button>
		<button
			on:click={() => onChange('combined')}
			class="px-4 py-2 rounded-lg font-medium transition-colors {mode ===
			'combined'
				? 'bg-blue-600 text-white'
				: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
		>
			Combined (2 dumbbells)
		</button>
	</div>
	<p class="text-sm text-gray-500">
		{mode === 'single'
			? 'Calculate weight for one dumbbell'
			: 'Calculate total weight across both dumbbells (splits target by 2)'}
	</p>
</div>
