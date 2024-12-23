<template>
    <div class="item">
        <p>{{ item.name }} - {{ item.status }}</p>
    </div>
</template>

<script>
export default {
    name: 'SensorItem',
    props: {
        item: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
.item {
    padding: 0.5rem;
    border: 1px solid #ccc;
    margin: 0.5rem 0;
    width: 150px;
    text-align: center;
}
</style>