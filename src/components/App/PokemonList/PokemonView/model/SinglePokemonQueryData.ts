import { PokemonAbility as ResponsePokemonAbility } from '../../model/PokemonQueryData';

export interface PokemonAbility {
  id: number;
  name: string;
  effect: string;
}

export interface Pokemon {
  name: string;
  abilities: PokemonAbility[];
}

export interface PokemonAxiosResponseData {
  data: {
    pokemon_v2_pokemon_by_pk: {
      id: number;
      name: string;
      pokemon_v2_pokemonabilities: ResponsePokemonAbility[];
    };
  };
}
