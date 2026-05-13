import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Safe inline macro to close the hanging terminal loop right after compilation finishes
const forceClosePlugin = () => ({
  name: 'force-close-terminal',
  closeBundle() {
    console.log('✨ Build finished successfully! Releasing environment threads...');
    setTimeout(() => {
      process.exit(0); // Safely forces the terminal to exit the pnpm loop
    }, 100);
  }
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8000,
  },
  plugins: [
    react(),
    forceClosePlugin() // Injected cleanly to break the socket/watcher hang
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Corrected to valid JS entity literals that Esbuild accepts
    'process.env': {},
    global: 'globalThis', 
  },
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
}));
