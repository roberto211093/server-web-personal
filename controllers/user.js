const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");

const signUp = (req, res) => {
    const user = new User();
    const {name, lastname, email, password, repeatPassword, privacyPolicy} = req.body;
    if (!name) {
        res.status(404).send({message: "Nombre es obligatorio."});
        return;
    }
    if (!lastname) {
        res.status(404).send({message: "Apellido es obligatorio."});
        return;
    }
    if (!email) {
        res.status(404).send({message: "Email es obligatorio."});
        return;
    }
    if (!privacyPolicy) {
        res.status(404).send({message: "Debe aceptar política de privacidad."});
        return;
    }
    if (!password || !repeatPassword) {
        res.status(404).send({message: "Contraseñas son obligatorias."});
        return;
    }
    if (password !== repeatPassword) {
        res.status(200).send({message: "Contraseñas deben ser iguales."});
        return;
    }
    bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
            res.status(500).send({message: "Error al encriptar contraseña"});
            return;
        }
        user.name = name;
        user.lastname = lastname;
        user.email = email.toLowerCase();
        user.role = "admin";
        user.active = false;
        user.privacyPolicy = privacyPolicy;
        user.password = hash;
        user.save((err, userSave) => {
            if (err) {
                res.status(500).send({message: "Usuario ya existe."});
                return;
            }
            res.status(200).send({user: userSave});
        })
    })
}

const signIn = (req, res) => {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;
    if (!email) {
        res.status(404).send({message: "Email es obligatorio."});
        return;
    }
    if (!password) {
        res.status(404).send({message: "Contraseña es obligatoria."});
        return;
    }
    User.findOne({email}, (err, userStored) => {
        if (err) {
            res.status(500).send({message: "Error del servidor."});
            return;
        }
        if (!userStored) {
            res.status(404).send({message: "Usuario no existe."});
            return;
        }
        bcrypt.compare(password, userStored.password, (err, passwordOk) => {
            if (err) {
                res.status(500).send({message: "Error del servidor."});
                return;
            }
            if (!passwordOk) {
                res.status(404).send({message: "Contraseña incorrecta."});
                return;
            }
            if (!userStored.active) {
                res.status(404).send({message: "No tienes permiso de Admin."});
                return;
            }
            res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored)
            });
        })
    })
}

const getUsers = (req, res) => {
    User.find().then( users => {
        if (!users) {
            res.status(404).send({message: "No existen usuarios"});
        } else {
            res.status(200).send({users: users});
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getUsers
}