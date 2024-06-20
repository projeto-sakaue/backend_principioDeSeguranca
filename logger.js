
const { createLogger, transports, format } = require('winston');
const fs = require('fs');
const path = require('path');


const logDirectory = path.resolve(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logger = createLogger({
    level: 'info', 
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        
        new transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
        
        new transports.File({ filename: path.join(logDirectory, 'combined.log') }),
    ],
});

module.exports = logger;
