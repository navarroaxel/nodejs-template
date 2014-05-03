var nodemailer = require('nodemailer');
var fs = require('fs');

module.exports.send = function (info) {
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: app.config.email.server, // hostname
        secureConnection: app.config.email.useSSL, // use SSL
        port: app.config.email.port, // port for secure SMTP
        auth: {
            user: app.config.email.user,
            pass: app.config.email.password
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "template - Dashboard <" + app.config.email.user + ">", // sender address
        to: info.to,
        subject: "Password Reset"
    };

    fs.readFile('./templates/resetPasswordEmail.html', function (err, data) {

        var link = '<a href="' + info.link + '">' + info.link + '</a>';

        mailOptions.html = data.toString()
            .replace('{{userName}}', info.name)
            .replace('{{link}}', link);

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function (err) {
            if (err) {
                console.log(err);
            }

            smtpTransport.close();
        });
    });
};