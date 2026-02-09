<script lang="ts">
	import { onMount } from 'svelte';
	import type { WeightPlate } from '../lib/types';
	import { loadPlates, savePlates, generatePlateId } from '../lib/storage';
	import PlateList from './PlateList.svelte';

	let plates: WeightPlate[] = [];
	let newWeight = '';
	let newQuantity = '';

	onMount(() => {
		plates = loadPlates();
	});

	function handleAddPlate(e: Event) {
		e.preventDefault();

		const weight = parseFloat(newWeight);
		const quantity = parseInt(newQuantity, 10);

		if (isNaN(weight) || weight <= 0) {
			alert('Weight must be a positive number');
			return;
		}

		if (isNaN(quantity) || quantity < 0) {
			alert('Quantity must be a non-negative number');
			return;
		}

		const newPlate: WeightPlate = {
			id: generatePlateId(),
			weight,
			quantity,
		};

		plates = [...plates, newPlate];
		savePlates(plates);

		newWeight = '';
		newQuantity = '';
	}

	function handleUpdatePlate(id: string, updates: Partial<WeightPlate>) {
		plates = plates.map((plate) =>
			plate.id === id ? { ...plate, ...updates } : plate
		);
		savePlates(plates);
	}

	function handleDeletePlate(id: string) {
		plates = plates.filter((plate) => plate.id !== id);
		savePlates(plates);
	}
</script>

<div class="card">
	<h2 class="text-2xl font-bold text-gray-900 mb-4">Manage Plates</h2>

	<form on:submit={handleAddPlate} class="mb-6">
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">
					Weight (kg)
				</label>
				<input
					type="number"
					bind:value={newWeight}
					class="input-field w-full"
					placeholder="e.g., 2.5"
					step="any"
					min="0.01"
					required
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">
					Quantity
				</label>
				<input
					type="number"
					bind:value={newQuantity}
					class="input-field w-full"
					placeholder="e.g., 4"
					min="0"
					required
				/>
			</div>

			<button type="submit" class="btn-primary w-full">
				Add Plate
			</button>
		</div>
	</form>

	<div>
		<h3 class="text-lg font-semibold text-gray-900 mb-3">Your Plates</h3>
		<PlateList
			{plates}
			onUpdate={handleUpdatePlate}
			onDelete={handleDeletePlate}
		/>
	</div>
</div>
