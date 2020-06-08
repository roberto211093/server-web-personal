const Menu = require("../models/menu");

const postAddMenu = async (req, res) => {
    const menu = new Menu();
    const {title, url, order, active} = req.body;
    try {
        if (!title) {
            res.status(404).send({message: "Titulo es obligatorio."});
            return;
        }
        if (!url) {
            res.status(404).send({message: "Url es obligatorio."});
            return;
        }
        if (!order) {
            res.status(404).send({message: "Orden es obligatorio."});
            return;
        }
        if (!active) {
            res.status(404).send({message: "Active es obligatorio."});
            return;
        }
        menu.title = title;
        menu.url = url;
        menu.order = order
        menu.active = active;
        const menuDB = await menu.save()
        if (!menuDB) {
            res.status(404).send({message: "Error al crear menu."});
        } else {
            res.status(200).send({menu: menuDB});
        }
    }
    catch (error) {
        res.status(500).send({message: "Error del servidor.", err: error.message});
    }
}

const getMenus = async (req, res) => {
    try {
        const menusDB = await Menu.find().sort({order: "asc"})
        if (!menusDB) {
            res.status(404).send({message: "No existen menus"});
        } else {
            res.status(200).send({menus: menusDB});
        }
    }
    catch (error) {
        res.status(500).send({message: "Error del servidor.", err: error.message});
    }
}

const putUpdateMenu = async (req, res) => {
    const {id} = req.params;
    let menuUpdate = req.body;
    try {
        const menuDB = await Menu.findByIdAndUpdate({_id: id}, menuUpdate);
        if (!menuDB) {
            res.status(404).send({message: "Menu no existe."});
            return;
        }
        res.status(200).send({menu: menuUpdate});
    }
    catch (error) {
        res.status(500).send({message: "Error del servidor.", err: error.message});
    }
}

const putActivateMenu = async (req, res) => {
    const {id} = req.params;
    const {active} = req.body;
    try {
        const menuDB = await Menu.findByIdAndUpdate(id, {active});
        if (!menuDB) {
            res.status(404).send({message: `Error al intentar ${active ? "activar" : "desactivar"} el menu.`});
            return;
        }
        res.status(200).send({menu: {...menuDB._doc, active}});
    }
    catch (error) {
        res.status(500).send({message: "Error del servidor.", err: error.message});
    }
}

const deleteMenu = async (req, res) => {
    const {id} = req.params;
    try {
        const menuDelete = await Menu.findByIdAndRemove(id);
        if (!menuDelete) {
            res.status(404).send({message: "Menu no existe."});
            return;
        }
        res.status(200).send({menu: menuDelete});
    }
    catch (error) {
        res.status(500).send({message: "Error del servidor.", err: error.message});
    }
}

module.exports = {
    postAddMenu,
    getMenus,
    putUpdateMenu,
    putActivateMenu,
    deleteMenu
}