const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");

function signUp(req, res) {
    const user = new User();
    const {name, lastname, email, password, repeatPassword} = req.body;
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
        user.email = email;
        user.role = "admin";
        user.active = false;
        user.password = hash;
        user.save((err, userSave) => {
            if (err) {
                res.status(500).send({message: "Usuario ya existe."});
                return;
            }
            res.status(200).send({message: `¡Usuario ${userSave.name} ${userSave.lastname} creado!`});
        })
    })
}

module.exports = {
    signUp
}