<template>
    <div class="layout">
        <LayoutHeader/>
        <LayoutMain/>
        <LayoutFooter/>
    </div>
</template>

<script>
export default {
    name: "Page",
};
</script>

<style scoped>
/* Base layout styling */
.layout {
    display: flex;
    flex-direction: column;
    /* Ensure page height covers the viewport */
    min-height: 100vh;
}
</style>