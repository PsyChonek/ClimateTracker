<template>
    <div class="grid-container">
        <slot v-for="(item, index) in items" :key="index" :item="item">
            <div class="grid-item">
                <p>{{ item.name }} - {{ item.status }}</p>
            </div>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'SensorItems',
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            fillers: 0,
            itemWidth: 0
        }
    }
}
</script>

<style scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
    justify-items: center; 
    gap: 16px;
    width: 100%;
    padding: 16px;
}

.grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    box-sizing: border-box;
}
</style>