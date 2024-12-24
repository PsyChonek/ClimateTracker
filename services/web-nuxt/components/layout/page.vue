<template>
	<div class="layout">
		<LayoutTop />
		<LayoutMid />
		<LayoutBot />
	</div>
</template>

<script setup>
import LayoutTop from './LayoutTop.vue';
import LayoutMid from './LayoutMid.vue';
import LayoutBot from './LayoutBot.vue';
</script>

<style scoped>
.layout {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
</style>
