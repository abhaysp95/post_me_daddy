import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
	  vue: '@vue/compat'
    }
  },
  plugins: [vue()
	  /* vue({
		  template: {
			  compilerOptions: {
				  compatConfig: {
					  MODE: 2
				  }
			  }
		  }
	  }) */
  ]
})
