import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
	// Enable Prettier integration
	plugins: ['prettier'],
	extends: ['plugin:prettier/recommended'],
	rules: {
		// Add Prettier-specific rules
		'prettier/prettier': 'error',
		// Optional: Customize other rules if needed
	},
});
