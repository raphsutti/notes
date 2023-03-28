// Enums are bad
enum AdType {
    classic= 'CLASSIC AD',
    standout= 'STANDOUT AD',
    premium = 'PREMIUM AD'
}

const getAdType = (input: AdType) => console.log(input)

getAdType('CLASSIC AD') // Argument of type '"CLASSIC"' is not assignable to parameter of type 'AdType'
getAdType(AdType.classic)

// String unions
const adType = {
    classic: 'CLASSIC AD',
    standout: 'STANDOUT AD',
    premium: 'PREMIUM AD'
} as const

type AdType2 = typeof adType[keyof typeof adType]

const getAdType2 = (input: AdType2) => console.log(input)

getAdType2('CLASSIC AD')