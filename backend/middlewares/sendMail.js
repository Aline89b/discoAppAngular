const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.NODE_MAILER_ADDRESS,
        pass: process.env.NODE_MAILER_PW
    }
})



module.exports = transport
