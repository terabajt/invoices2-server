const nodemailer = require('nodemailer');

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

// Activation mail sender
function sendActivationEmail(email, token) {
	const transporter = nodemailer.createTransport({
		host: MAIL_HOST,
		port: MAIL_PORT,
		secure: true,
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASS,
		},
	});

	const mailOptions = {
		from: 'activation@invoices2.ewebpartner.pl',
		to: email,
		subject: 'Aktywacja konta',
		text: `
		Witamy Cię w naszej aplikacji Invoices2.

		Właśnie utworzyłeś nowe konto, jest ono jednak nieaktywne.

		Aby móc się zalogować, musisz potwierdzić swoje konto klikając w link: https://app.invoices2.ewebpartner.pl/activation/${token} 
		
		Jeśli to nie Ty zainicjowałeś chęć utworzenia nowego konta, zignoruj tą wiadomość.
		
		Pozdrawiamy, 
		Zespół Invoices2
		https://invoices2.ewebpartner.pl/
		Twoje faktury online dostępne 24h/dobę.
		`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

module.exports = sendActivationEmail;
