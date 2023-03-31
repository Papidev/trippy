import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:1337/graphql',
  documents: 'utils/map/Queries.ts',
  generates: {
    'types/models/strapi/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
