<template>
	<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] justify-items-center gap-4 w-full p-4">
		<slot v-for="(item, index) in items" :key="index" :item="item">
			<div class="flex justify-center items-center p-2 border border-gray-300 w-[180px]">
				<p>{{ item.name }} - {{ item.status }}</p>
			</div>
		</slot>
	</div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
	items: {
		type: Array,
		required: true,
	},
});
</script>