// const sgMail = require('sendgrid')

const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const sendGridApiKey = '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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = ({
    to: 'tharakadil22@gmail.com',
    from: 'tharakadil22@gmail.com',
    subject: 'Testing my mail function',
    text: 'Email form your task-app'
})

// sgMail.send(msg).then(() => {
//     console.log('Message sent')
// }).catch((error) => {
//     console.log(error)
//     // console.log(error.response.body.errors[0].message)
// })

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'tharakadil22@gmail.com',
        subject: 'Welcome to the Task-App',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

const sendCancelatinEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'tharakadil22@gmail.com',
        subject: 'Bye bye',
        text: `Good Bye, ${name}. Hope to see you back`
    })
}

module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendCancelatinEmail: sendCancelatinEmail
}