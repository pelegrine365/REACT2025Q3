export async function fetchPokemonByName(name: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Not found');
  }

  const data = await response.json();
  console.log({ image: data.sprites.other['official-artwork'].front_default });

  return {
    name: data.name,
    image: data.sprites.other['official-artwork'].front_default,
  };
}
