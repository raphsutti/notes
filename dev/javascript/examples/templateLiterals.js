const horse = {
    name: 'Topher',
    size: 'large',
    skills: ['jousting', 'racing'],
    age: 7,
}

// Bad
let bio = horse.name + ' is a ' + horse.size + ' horse skilled in ' + horse.skills

// Good
const {name, size, skills} = horse

bio = `${name} is a ${size} horse skilled in ${skills}`

// Advanced tag example
function horseAge(str,age) {
    const ageStr = age > 5 ? 'old': 'young';
    return `${str[0]}${ageStr} at ${age} years`;
}

const bio2 = horseAge`This horse is ${horse.age}`