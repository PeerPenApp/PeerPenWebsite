import { defineConfig } from 'astro/config';
import { settings } from './src/data/settings';
import sitemap from "@astrojs/sitemap";
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  site: settings.site,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    clerk({
      publishableKey: import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY,
      secretKey: import.meta.env.CLERK_SECRET_KEY,
      signInUrl: '/',
      signUpUrl: '/signup',
      afterSignInUrl: '/app',
      afterSignUpUrl: '/app',
      // Enable built-in route protection
      protectedRoutes: ['/app', '/dashboard', '/profile', '/settings'],
    }), 
    react(), 
    tailwind({ applyBaseStyles: false }), 
    sitemap()
  ],
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});