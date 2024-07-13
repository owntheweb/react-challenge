const pokemonViewQuery = `
query pokemonByIdQuery($id: Int!) {
  pokemon_v2_pokemon_by_pk(id: $id) {
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

export default pokemonViewQuery;
