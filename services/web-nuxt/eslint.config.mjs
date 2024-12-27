import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
	// Enable Prettier integration
	plugins: ['prettier'],
	extends: ['plugin:prettier/recommended'],
	rules: {
		'prettier/prettier': 'error',
	},
}).prepend({
	ignores: ['clients/**'],
});
