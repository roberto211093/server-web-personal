const NewsLetter = require("../models/newsLetter");

const postSuscribeEmail = async (req, res) => {
    const news = new NewsLetter();
    const {email} = req.params;
    try {
        if (!email) {
            res.status(404).send({code: 404, message: "Email es obligatorio."});
            return;
        }
        news.email = email.toLowerCase();
        const result = await news.save()
        if (!result) {
            res.status(404).send({code: 404, message: "Error al suscribir email."});
        } else {
            res.status(200).send({code: 200, newsLetter: `email ${email} suscrito correctamente`});
        }
    }
    catch (error) {
        res.status(500).send({code: 500, message: "Error del servidor.", err: error.message});
    }
}

module.exports = {
    postSuscribeEmail
}