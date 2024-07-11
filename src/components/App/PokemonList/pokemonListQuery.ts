const pokemonListQuery = `
query samplePokeAPIquery(
  $limit: Int
  $offset: Int
  $orderBy: [pokemon_v2_pokemon_order_by!]
  $where: pokemon_v2_pokemon_bool_exp
) {
  pokemon_v2_pokemon_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  pokemon_v2_pokemon(
    limit: $limit
    offset: $offset
    order_by: $orderBy
    where: $where
  ) {
    id
    name
    pokemon_v2_pokemonabilities {
      id
      pokemon_v2_ability {
        name
        pokemon_v2_abilityeffecttexts(where: { language_id: { _eq: 9 } }) {
          effect
          language_id
        }
      }
    }
  }
}
`;

export default pokemonListQuery;
