// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css',
        },
      ],
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/apollo',
    '@nuxtjs/strapi',
    'nuxt-headlessui',
  ],
  apollo: {
    clients: { default: { httpEndpoint: 'http://localhost:1337/graphql' } },
  },
  strapi: {},
});
