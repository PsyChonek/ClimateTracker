<template>
    <div class="layout">
        <LayoutTop/>
        <LayoutMid/>
        <LayoutBot/>
    </div>
</template>

<script>
export default {
    name: "Page",
};
</script>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
</style>