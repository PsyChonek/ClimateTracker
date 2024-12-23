<template>
    <div class="header">
        <h1 class="title">Climate Tracker</h1>
        <CommonFlexCenterStartList :items="items">
            <template v-slot:default="slotProps">
                <SensorItem :item="slotProps.item"/>
            </template>
        </CommonFlexCenterStartList>
    </div>
</template>

<script>

export default {
    name: 'Header',
    data() {
        return {
            items: []
        }
    },
    mounted() {
        const generatedItems = [
            { name: 'Sensor A', status: 'active' },
            { name: 'Sensor B', status: 'inactive' },
            { name: 'Sensor C', status: 'active' },
            { name: 'Sensor C', status: 'active' },
            { name: 'Sensor C', status: 'active' },
            { name: 'Sensor C', status: 'active' },
            { name: 'Sensor C', status: 'active' },
            { name: 'Sensor C', status: 'active' },
            { name: 'Sensor C', status: 'active' },
        ];

        this.items = generatedItems;
    }
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    padding-left: 2rem;
    padding-right: 2rem;
    background-color: black;
    flex-direction: column;
}

.title {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    word-wrap: none;
    word-break: keep-all;
    white-space: nowrap;
}
</style>