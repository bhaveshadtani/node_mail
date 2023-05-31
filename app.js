require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();

const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.render('contact');
});

app.post('/send', (req, res) => {
	const output = `
    <p>You have a new contact request</p>
    <h3>Contact details</h3>
    <ul>
        <li>Firstname: ${req.body.fname} </li>
        <li>Lastname: ${req.body.lname} </li>
        <li>Email: ${req.body.email} </li>
		<li>Phone: ${req.body.phone} </li>
		<li>Message: ${req.body.message} </li>
    </ul>
	`;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.SENDER_MAIL,
			pass: process.env.SENDER_PASSWORD
		}
	});

	transporter.sendMail({
		from: process.env.SENDER_MAIL,
		to: req.body.email,
		subject: "Contact Request",
		html: output
	})
		.then(() => {
			console.log("MAIL SENT");
			res.redirect('/');
		})
		.catch(err => { console.log("MAIL NOT SENT") });

});

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
