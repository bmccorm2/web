<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;

	let price: number;
	let gallons: number;
	let miles: number;

	$: mpg = miles && gallons ? (miles / gallons).toFixed(2) : '';
	$: ppg = price && gallons ? (price / gallons).toFixed(2) : '';
</script>

<div class="container mx-auto">
	<div class="card mt-4">
		<div
			class="card-header    {form?.success
				? 'bg-emerald-700'
				: 'card-header-purple'}"
		>
			Input
		</div>
		<form action="?/create" method="post">
			<!-- PRICE -->
			<div class="flex mt-4 mx-6 items-center">
				<span class="border border-white px-4 bg-gray-500 rounded-l-md">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						class="bi bi-currency-dollar text-slate-100 h-8 w-4"
						viewBox="0 0 16 16"
					>
						<path
							d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"
						/>
					</svg>
				</span>
				<input
					type="number"
					class="px-3 py-1 5 border-2 border-slate-500 w-full rounded-r-md h"
					placeholder="Price"
					required
					maxlength={5}
					inputmode="decimal"
					pattern="(\d*)\.?(\d*)"
					name="price"
					bind:value={price}
					step=".01"
				/>
			</div>
			<!-- GALLONS -->
			<div class="flex mt-1 mx-6 items-center">
				<span class="border border-white px-4 bg-gray-500 rounded-l-md">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						class="bi bi-fuel-pump-fill text-slate-100 h-8 w-4"
						viewBox="0 0 16 16"
					>
						<path
							d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1c.564 0 1.034.11 1.412.336.383.228.634.551.794.907.295.655.294 1.465.294 2.081V7.5a.5.5 0 0 1-.5.5H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V2Zm2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-5Z"
						/>
					</svg>
				</span>
				<input
					type="number"
					class="px-3 py-1 5 border-2 border-slate-500 w-full rounded-r-md h"
					placeholder="Gallons"
					required
					maxlength={6}
					inputmode="decimal"
					pattern="(\d*)\.?(\d*)"
					name="gallons"
					bind:value={gallons}
					step=".001"
				/>
			</div>
			<!-- MILES -->
			<div class="flex mt-1 mx-6 items-center">
				<span class="border border-white px-4 bg-gray-500 rounded-l-md">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						class="bi bi-car-front-fill text-slate-100 h-8 w-4"
						viewBox="0 0 16 16"
					>
						<path
							d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"
						/>
					</svg>
				</span>
				<input
					type="number"
					class="px-3 py-1 5 border-2 border-slate-500 w-full rounded-r-md h"
					placeholder="Miles"
					required
					maxlength={6}
					inputmode="decimal"
					pattern="(\d*)\.?(\d*)"
					name="miles"
					bind:value={miles}
					step=".01"
				/>
			</div>
			<!-- NOTES -->
			<div class="flex mt-1 mb-4 mx-6 items-center">
				<span class="border border-white px-4 bg-gray-500 rounded-l-md">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						class="bi bi-sticky-fill h-8 w-4 text-slate-100"
						viewBox="0 0 16 16"
					>
						<path
							d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zm6 8.5a1 1 0 0 1 1-1h4.396a.25.25 0 0 1 .177.427l-5.146 5.146a.25.25 0 0 1-.427-.177V9.5z"
						/>
					</svg>
				</span>
				<input
					type="text"
					class="px-3 py-1 5 border-2 border-slate-500 w-full rounded-r-md h"
					placeholder="Notes"
					name="notes"
				/>
			</div>
			<hr />
			<div class="flex mx-16 mt-4">
				<input
					type="text"
					readonly
					class="px-3 py-1 5 border-2 border-slate-500 w-full rounded-md h"
					placeholder={`MPG: ${mpg}`}
				/>
				<input
					type="text"
					readonly
					class="px-3 py-1 5 border-2 border-slate-500 w-full rounded-md h"
					placeholder={`PPG: ${ppg}`}
				/>
			</div>
			<button
				type="submit"
				class="btn  w-1/2 mb-4 mt-3 {form?.success
					? 'bg-emerald-700'
					: 'bg-purple-700'}"
				disabled={form?.success}>submit</button
			>
		</form>
	</div>
</div>
