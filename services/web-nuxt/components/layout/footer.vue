<template>
    <footer class="footer">
        <div class="content has-text-centered">
            <p>
                &copy; Daniel Vazač. Check out my GitHub: 
                <a href="https://github.com/PsyChonek" target="_blank">PsyChonek</a>
            </p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style scoped>

/* Footer styling */
.footer {
    color: white;
    text-align: center;
    padding: 0.25rem;
}

.footer a {
    color: white;
    text-decoration: underline;
}
</style>