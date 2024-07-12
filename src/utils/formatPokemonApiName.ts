// The Pokemon API returns names/ability names in this format:
// the-name
// Transform to this format to meet
const formatPokemonApiName = (name: string): string => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default formatPokemonApiName;
