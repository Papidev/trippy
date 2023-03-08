export const getAttractionsQuery = gql`
  query getAttractions {
    attractions {
      data {
        id
        attributes {
          name
          latitude
          longitude
        }
      }
    }
  }
`;
