const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;   // token bu 3 parametirden birinde ola biler

    if (token) {
        jwt.verify(token, req.app.get('api_secret_key'), (err,decoded)=>{      //token varsa decoded edirik
            if(err){
                res.json({                                                   //token var amma basqadi
                    status:false,
                    message: 'Failed to authenticate token'
                })
            }
            else{                                                   //token var decodedetdik ve middlewareye gore is davam etdirilir
                req.decode = decoded,                              
                next();
            }
        })
    }
    else {
        res.json({
            status: false,
            message: 'No token provided'
        })
    }
}