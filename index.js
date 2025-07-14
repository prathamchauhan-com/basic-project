async function fetchData(){
  try{
    const nameOfPokemon = document.getElementById("pokemonName").value.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOfPokemon}`);

    if(!response.ok){
       throw new Error("Couldn't fetch resources.");
    }
    const data = await response.json();
    const pokemonSprite = data.sprites.front_default;
    const imgE = document.getElementById("pokemonSprite");

    imgE.src = pokemonSprite;
    imgE.style.display = "block";

  }
  catch(error){
    console.error(error);
  }
}

