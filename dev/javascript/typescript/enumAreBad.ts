enum LogLevel {
    "INFO",
    "WARNING",
    "DEBUG"
}

enum LogLevel2 {
    "INFO",
    "WARNING",
    "DEBUG"
}


const log = (message:string, level: LogLevel) => {
}

log('Hey', 'DEBUG') // Argument of type '"DEBUG"' is not assignable to parameter of type 'LogLevel'
log('Hey', LogLevel.DEBUG) // Argument of type '"DEBUG"' is not assignable to parameter of type 'LogLevel'
log('Hey', LogLevel2.DEBUG) // Argument of type 'LogLevel2.DEBUG' is not assignable to parameter of type 'LogLevel'

// Run time enums gone
// Bad in using libraries
const enum ConstLogLevel {
    "INFO",
    "WARNING",
    "DEBUG"
}

// Instead use Plain Old Javascript Object
const LOG_LEVEL = {
    DEBUG: 'DEBUG',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
} as const

type ObjectValues<T> = T[keyof T]

type LogLevel3 = ObjectValues<typeof LOG_LEVEL>
const log2 = (message:string, level: LogLevel3) => {
    console.log(`${LOG_LEVEL[level]}: ${message}`)
}

log2('hey', "DEBUG")

