<template>
    <div ref="itemContainer" class="item-container">
        <slot v-for="(item, index) in items" :item="item" :key="index"></slot>
        <div v-for="i in fillers" :key="'filler-' + i" class="filler" :style="{ width: itemWidth + 'px' }"></div>
        <p>{{ fillers }} - {{ items }}</p>
    </div>
</template>

<script>
export default {
    name: 'FlexCenterStartList',
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
    },
    mounted() {
        window.addEventListener('resize', this.calculateItemsInRow);
    },
    methods: {
        calculateItemsInRow() {
            const container = this.$refs.itemContainer; // Get the container reference
            if (container == null) return; // If the container is not available, exit

            const itemItems = container.querySelectorAll('.item'); // Get all item items
            if (itemItems.length === 0) return; // If there are no items, exit

            const containerWidth = container.getBoundingClientRect().width; // Get the container width
            let itemWidth = itemItems[0].getBoundingClientRect().width; // Get the width of one item
            this.itemWidth = itemWidth;

            // Get the gap from the flex container
            const gap = parseFloat(window.getComputedStyle(container).gap) || 0; // Default to 0 if gap is "normal" or undefined

            // Account for gap in total width calculation
            const totalItemWidth = itemWidth + gap;

            console.log('gap', gap);
            
            console.log('containerWidth', containerWidth);
            console.log('totalItemWidth', totalItemWidth);

            // Calculate the number of items that fit in the row
            const itemsInRow = Math.floor(containerWidth / totalItemWidth);

            // Calculate the number of fillers needed
            this.fillers = this.items.length % itemsInRow === 0 ? 0 : itemsInRow - (this.items.length % itemsInRow);
        }
    }
}
</script>

<style scoped>
.item-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    /* Align the items from the start */
    gap: 16px;
}
</style>