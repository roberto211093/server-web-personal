const jwt = require("jwt-simple");
const moment = require("moment");
const {SECRET_KEY} = require("../config");

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({message:"Peticion no tiene headers de Auth."});
    }

    let payload = "";
    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        payload = jwt.decode(token, SECRET_KEY);
        if (payload.exp <= moment.unix()) {
            return res.status(404).send({message: "El token ha expirado."})
        }
    } catch (e) {
        console.log("Token invalido: ",e)
        return res.status(404).send({message: "Token invalido."})
    }

    req.user = payload;
    next();
}