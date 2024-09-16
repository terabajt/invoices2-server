const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const sendActivationEmail = require('../helpers/mailer');
const uuid = require('uuid');

//localhost:3000/api/v1/users
// FOR TESTING ONLY!!!
// router.get('/', async (req, res) => {
// 	const userList = await User.find()
// 		.populate('invoices')
// 		.populate({ path: 'invoices', populate: { path: 'entryItem' } })
// 		.select('-passwordHash');
// 	if (!userList) {
// 		res.status(400).json({ success: false });
// 	}
// 	res.send(userList);
// });

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'Invalid ID format.' });
	}
	const user = await User.findById(id)
		.populate('invoices')
		.populate({ path: 'invoices', populate: { path: 'entryItem' } })
		.populate({ path: 'invoices', populate: { path: 'customer' } })
		.select('-passwordHash');
	if (!user) {
		return res.status(404).json({ message: 'User not found.' });
	}
	res.status(200).send(user);
});

//Register
router.post('/register', async (req, res) => {
	try {
		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			return res.status(400).send('User already exists');
		}
		const activationToken = uuid.v4();
		const user = new User({
			email: req.body.email,
			name: req.body.email,
			passwordHash: bcrypt.hashSync(req.body.password, 10),
			isActive: false,
			activationToken,
		});

		const savedUser = await user.save();
		//Send activation mail
		sendActivationEmail(req.body.email, activationToken);

		if (!savedUser) {
			return res.status(400).send('The user cannot be created.');
		}
		res.send(savedUser);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

router.post('/', async (req, res) => {
	let user = new User({
		email: req.body.email,
		name: req.body.name,
		city: req.body.city,
		address1: req.body.address1,
		address2: req.body.address2,
		zip: req.body.zip,
		phone: req.body.phone,
		isAdmin: req.body.isAdmin,
		passwordHash: bcrypt.hashSync(req.body.password, 10),
	});
	user = await user.save();

	if (!user) return res.status(400).send('The user cannot be created.');
	res.send(user);
});
router.put('/:id', async (req, res) => {
	const userExist = await User.findById(req.params.id);
	// Sprawdź, czy użytkownik istnieje
	if (!userExist) {
		return res.status(404).json({ success: false, message: 'User not found!' });
	}
	let newPassword;

	if (req.body.password) {
		newPassword = bcrypt.hashSync(req.body.password, 10);
	} else {
		newPassword = userExist.passwordHash;
	}
	const user = await User.findByIdAndUpdate(
		req.params.id,
		{
			email: req.body.email,
			name: req.body.name,
			city: req.body.city,
			address1: req.body.address1,
			address2: req.body.address2,
			zip: req.body.zip,
			phone: req.body.phone,
			isAdmin: req.body.isAdmin,
			passwordHash: newPassword,
			taxNumber: req.body.taxNumber,
			accountNumber: req.body.accountNumber,
			country: req.body.country,
		},
		{
			new: true,
		}
	);
	if (!user) return res.status(400).send('The user cannot be updated!');

	res.send(user);
});
router.post('/login', async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	const secret = process.env.SECRET;
	if (!user) {
		return res.status(404).send('The user not found! Please check user credentials');
	}
	if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
		const token = jwt.sign(
			{
				userId: user.id,
				isAdmin: user.isAdmin,
			},
			secret,
			{ expiresIn: '1d' }
		);
		if (user.isActive) {
			res.status(200).send({ user: user.email, token: token });
		} else {
			res.status(404).send('User not activated');
		}
	} else {
		return res.status(404).send('Password is wrong');
	}
});

router.delete('/:id', (req, res) => {
	User.findByIdAndRemove(req.params.id)
		.then(user => {
			if (user) {
				return res.status(200).json({ success: true, message: 'The user is deleted.' });
			} else {
				return res.status(400).json({ success: false, message: 'User not found!' });
			}
		})
		.catch(err => {
			return res.status(400).json({ success: false, error: err });
		});
});

module.exports = router;
