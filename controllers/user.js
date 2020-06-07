const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");

const postSignUp = (req, res) => {
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

const postSignIn = (req, res) => {
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

const getUsersActive = (req, res) => {
    const query = req.query;
    User.find({active: query.active}).then( users => {
        if (!users) {
            res.status(404).send({message: "No existen usuarios"});
        } else {
            res.status(200).send({users: users});
        }
    })
}

const putUpdateAvatar = (req, res) => {
    const params = req.params;
    User.findById({_id: params.id}, (err,userData) => {
        if (err) {
            res.status(500).send({message: "Error del servidor."});
            return;
        }
        if (!userData) {
            res.status(404).send({message: "Usuario no existe."});
            return;
        } 

        let user = userData;

        if (req.files) {
            let filePath = req.files.avatar.path;
            let fileSplit = filePath.split("/");
            let fileName = fileSplit[2];
            let extSplit = fileName.split(".");
            let fileExt = extSplit[1];

            if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg") {
                res.status(400).send({message: "Formato de img invalido."});
                return;
            }
            
            user.avatar = fileName;
            User.findByIdAndUpdate({_id: params.id}, user, (err, userResult) => {
                if (err) {
                    res.status(500).send({message: "Error del servidor."});
                    return;
                }
                if (!userResult) {
                    res.status(404).send({message: "Usuario no existe."});
                    return;
                } 
                res.status(200).send({user});
            })
        }
    })
}

const getAvatar = (req, res) => {
    const {avatarName} = req.params;
    const filePath = "./uploads/avatar/" + avatarName;
    fs.exists(filePath, exists => {
        if (!exists) {
            res.status(404).send({message: "Avatar no existe"});
        } else {
            res.sendFile(path.resolve(filePath));
        }
    })
}

const putUpdateUser = async (req, res) => {
    const params = req.params;
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    try {
        if (userData.password) {
            let hashedPassword = await new Promise((resolve) => {
                bcrypt.hash(userData.password, null, null, (err, hash) => {
                  if (err) {
                    res.status(500).send({message: "Error al intentar encriptar la clave."});
                    return;
                  }
                  resolve(hash)
                });
            });
            userData.password = hashedPassword;
        }
        const userDB = await User.findByIdAndUpdate({_id: params.id}, userData);
        if (!userDB) {
            res.status(404).send({message: "Usuario no existe."});
            return;
        }
        res.status(200).send({user: userData});
    }
    catch (error) {
        res.status(500).send({message: "Error del servidor.", err: error.message});
    }
}

module.exports = {
    postSignUp,
    postSignIn,
    getUsers,
    getUsersActive,
    putUpdateAvatar,
    getAvatar,
    putUpdateUser
}