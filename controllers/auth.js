const jwt = require("../services/jwt");
const moment = require("moment");
const User = require("../models/user");

const willExpiredToken = (token) => {
    const {exp} = jwt.decodedToken(token);
    const currentDate = moment().unix();
    //Si currentDate mayor o igual a exp significa que el token a caducado y devolvera true
    return (currentDate >= exp);
}

const refreshAccessToken = (req, res) => {
    const {refreshToken} = req.body;
   if (willExpiredToken(refreshToken)) {
       res.status(403).send({message: "El refreshToken ha expirado."});
   } else {
       const {id} = jwt.decodedToken(refreshToken);
       User.findOne({_id: id}, (err, userStored) => {
           if (err){
               res.status(500).send({message: "Error del servidor."});
               return;
           }
           if (!userStored) {
               res.status(404).send({message: "Usuario no existe."});
               return;
           }
           res.status(200).send({
               accessToken: jwt.createAccessToken(userStored),
               refreshToken
           });
       })
   }
}


module.exports = {
    refreshAccessToken
}