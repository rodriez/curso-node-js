import winston from 'winston'

const consoleFormat = winston.format.combine(
    winston.format.colorize({ level: true, colors: { 'info': 'green', 'error': 'red' } }),
    winston.format.timestamp({ format: 'YYYY-MM-DD-HH:mm:ss' }),
    winston.format.printf((info) => `${info.timestamp} - ${info.level} - ${info.message}`)
)

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD-HH:mm:ss' }),
    winston.format.printf((info) => `${info.timestamp} - ${info.level} - ${info.message}`)
)

const logger = winston.createLogger({
    level: `${process.env.LOG_LEVEL}`,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: `${process.env.LOG_FILE}`, format: fileFormat }),
        new winston.transports.Console({ format: consoleFormat, level: 'error'})
    ]
})

export function sequelizeStream(msg) {
    logger.debug(msg)
}

export function morganStream() {
    return {
        write: (msg) => logger.info(msg)
    }
}

export default logger;