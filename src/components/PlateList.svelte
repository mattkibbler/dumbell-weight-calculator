<script lang="ts">
	import type { WeightPlate } from '../lib/types';
	import { getPlateColor } from '../lib/colors';

	export let plates: WeightPlate[];
	export let onUpdate: (id: string, updates: Partial<WeightPlate>) => void;
	export let onDelete: (id: string) => void;

	let editingId: string | null = null;
	let editWeight = '';
	let editQuantity = '';

	$: sortedPlates = [...plates].sort((a, b) => a.weight - b.weight);

	function startEdit(plate: WeightPlate) {
		editingId = plate.id;
		editWeight = plate.weight.toString();
		editQuantity = plate.quantity.toString();
	}

	function saveEdit(id: string) {
		const weight = parseFloat(editWeight);
		const quantity = parseInt(editQuantity, 10);

		if (isNaN(weight) || weight <= 0) {
			alert('Weight must be a positive number');
			return;
		}

		if (isNaN(quantity) || quantity < 0) {
			alert('Quantity must be a non-negative number');
			return;
		}

		onUpdate(id, { weight, quantity });
		editingId = null;
	}

	function cancelEdit() {
		editingId = null;
		editWeight = '';
		editQuantity = '';
	}

	function handleDelete(id: string, weight: number) {
		if (confirm(`Delete ${weight}kg plate?`)) {
			onDelete(id);
		}
	}
</script>

{#if plates.length === 0}
	<div class="text-center py-8 text-gray-500">
		No plates added yet. Add some plates to get started.
	</div>
{:else}
	<div class="space-y-2">
		{#each sortedPlates as plate (plate.id)}
			<div
				class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
			>
				{#if editingId === plate.id}
					<div class="flex items-center space-x-2 flex-1">
						<input
							type="number"
							bind:value={editWeight}
							class="input-field w-24"
							placeholder="Weight"
							step="any"
							min="0.01"
						/>
						<span class="text-gray-600">kg</span>
						<span class="text-gray-400">×</span>
						<input
							type="number"
							bind:value={editQuantity}
							class="input-field w-20"
							placeholder="Qty"
							min="0"
						/>
					</div>
					<div class="flex items-center space-x-2">
						<button
							on:click={() => saveEdit(plate.id)}
							class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
						>
							Save
						</button>
						<button
							on:click={cancelEdit}
							class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
						>
							Cancel
						</button>
					</div>
				{:else}
					<div class="flex items-center space-x-3">
						<div
							class="w-4 h-4 rounded-full flex-shrink-0"
							style="background-color: {getPlateColor(
								plate.weight
							)}"
						></div>
						<span class="font-semibold text-gray-900"
							>{plate.weight}kg</span
						>
						<span class="text-gray-500">× {plate.quantity}</span>
					</div>
					<div class="flex items-center space-x-2">
						<button
							on:click={() => startEdit(plate)}
							class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
						>
							Edit
						</button>
						<button
							on:click={() =>
								handleDelete(plate.id, plate.weight)}
							class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
						>
							Delete
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
