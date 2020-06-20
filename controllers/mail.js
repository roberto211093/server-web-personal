// Documentacion que me ayudo: 
// https://stackoverflow.com/questions/42174317/google-oauth-2-0-api-password-change-username-and-password-not-accepted/42292944#42292944
// https://www.youtube.com/watch?v=JJ44WA_eV8E
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const postSendMail = (req, res) => {
    const { name, email, phone, message } = req.body;

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: "rafa.acosta.sistemas@gmail.com",
            clientId: "460440399306-g4gk89m1th8ke8r4eb1u7rmrvlcnogen.apps.googleusercontent.com",
            clientSecret: "2bKJ8lG8Bw0soGNhunaEX5FR",
            refreshToken: "1//04l41uUguAUpRCgYIARAAGAQSNgF-L9IrAcAPCGYmMf2RrQaVxoDocV4Lw1zVz2svRNw9XGZwd2aNy1qycEI8Ac8f4xKuyx3sPQ",
            accessToken: "ya29.a0AfH6SMDnmuQc2BvJj6Plzh_waLwBXUt0wNLjVYb2UbFsefjmbEhVhwy9ZZRo_iAHtDHM-DLwjaQzB7HfGcYzHeFhcCuF2zd6zKQwJYsFzDf0LtBua37sQEPWtBytAHX9RydFlG3k-20HZ6bDLyHVEkfSnSiwWnmIIUM",
        },
    });

    // send mail with defined transport object
    const info = {
        from: "rafa.acosta.sistemas@gmail.com", // sender address
        to: "rafael.r.acosta.m.93@gmail.com", // list of receivers
        subject: "Web Personal", // Subject line
        html: `<p><b>Mensaje desde rafaelacosta.cl</b></p>
        <div style="width: 300px;margin: 0 auto;margin-top:30px;">
            <div style="padding:10px;border: 3px solid #000;border-bottom:none;">
                <div style="padding-right: 10px; font-weight: bold;display: inline;">Nombre: </div>
                <div style="display: inline;float: right;">${name}</div>
            </div>
            <div style="padding:10px;border: 3px solid #000;border-bottom:none;">
                <div style="padding-right: 10px; font-weight: bold;display: inline;">Email: </div>
                <div style="display: inline;float: right;">${email}</div>
            </div>
            <div style="padding:10px;border: 3px solid #000;border-bottom:none;">
                <div style="padding-right: 10px; font-weight: bold;display: inline;">Telefono: </div>
                <div style="display: inline;float: right;">${phone}</div>
            </div>
            <div style="padding:10px;border: 3px solid #000;display: flex; justify-content: space-between; align-items: center;">
                <div style="padding-right: 10px; font-weight: bold;">Mensaje: </div>
                <div>${message}</div>
            </div>
        </div>`
    };

    transporter.sendMail(info, (err, result) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            res.status(500).send({ err: "Error al intentar enviar email." });
            return;
        }
        res.status(200).send({ status: 'Ok', code: 200, message: 'Email enviado correctamente' })
    })
}


module.exports = { postSendMail }