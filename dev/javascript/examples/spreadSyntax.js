const pikachu = {name: 'Pikachu'}
const stats = {hp: 40, attack:60, defense: 45}

// Bad
pikachu['hp'] = stats.hp
pikachu['attack'] = stats.attack
pikachu['defense'] = stats.defense


const lvl0bad = Object.assign(pikachu , stats)
const lvl1bad = Object.assign(pikachu , {hp:45})

// Good
const lvl0 = {...pikachu, ...stats}
const lvl1 = {...pikachu, ...stats, hp:45}
console.log({lvl0})
console.log({lvl1})


// Array
let pokemon = ['Arbok', 'Raichu', 'Sandshrew']

// Bad
pokemon.push('Bulbasaur')
pokemon.push('Metapod')
pokemon.push('Weedle')

// Good
// push
pokemon = [...pokemon, 'Bulbasaur', 'Metapod', 'Weedle']
// unshift
pokemon = ['Bulbasaur', 'Metapod', 'Weedle', ...pokemon ]
// splice
pokemon = ['Bulbasaur', ...pokemon, 'Metapod', 'Weedle' ]
console.log(pokemon)

