const Menu = require("../models/menu");

const addMenu = async (req, res) => {
    try {
        console.log("addMenu");
               res.status(200).send({message: "Funciona"});
    }
    catch (error) {
        res.status(500).send({message: "Error del servidor.", err: error.message});
    }
}

module.exports = {
    addMenu
}