// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/apollo'],
  apollo: {
    clients: { default: { httpEndpoint: 'http://localhost:1337/graphql' } },
  },
});
