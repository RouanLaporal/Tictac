const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.auhtorization.split(' ')[1];
        console.log(token)
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decoded) =>{
            if (err){
                return next(createError(401, {
                    succes: false,
                    message: 'Token is not valid'
                }));
            }
            else{
                
            }
        })
    }
    catch (error){
        
    }
};