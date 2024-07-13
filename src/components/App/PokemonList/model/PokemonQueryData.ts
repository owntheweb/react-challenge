export interface PokemonAbilityEffect {
  language_id: number;
  effect: string;
}

// TODO: Maybe there's a way to flatten this in the query itself?
export interface PokemonAbility {
  id: number;
  pokemon_v2_ability: {
    name: string;
    pokemon_v2_abilityeffecttexts: {
      effect: string;
      language_id: number;
    }[];
  };
}

// TODO: I wonder if I can rename properties in graphql query?
// pokemon_v2_pokemonabilities -> abilities
export interface PokemonListItem {
  id: number;
  name: string;
  pokemon_v2_pokemonabilities: PokemonAbility[];
}

export interface PokemonQueryData {
  data: {
    pokemon_v2_pokemon: PokemonListItem[];
    pokemon_v2_pokemon_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}
