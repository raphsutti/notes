const turtle = {
    name: 'Bob',
    legs: 4,
    shell: true,
    type: 'amphibious',
    meal: 10,
    diet: 'berries'
}

// Bad

function feed(animal) {
    return `Feed ${animal.name} ${animal.meal}`
}

// Good
function feed({name, meal}) {
    return `Feed ${name} ${meal}`
}
// or
function feed(animal) {
    const { name, meal} = animal;
    return `Feed ${name} ${meal}`
}