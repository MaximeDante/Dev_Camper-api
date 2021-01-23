// @description    logs request to console (Logger middelware)

const logger = (req, res, next) =>{
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};


module.exports = logger;