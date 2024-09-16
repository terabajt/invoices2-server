const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../models/user');

// localhost:3000/api/v1/activation?token=$2a$10$WU/ZbrJtYqNcPgaeNkhkz.w91a0DVljLBTs4Q.sI2jQ69TSbghPGe
router.get('/', async (req, res) => {
	try {
		const token = req.query.token;
		if (!token) {
			return res.status(400).send({ message: 'Token is required' });
		}

		const user = await User.findOne({ activationToken: token });

		if (!user) {
			return res.status(404).send({ message: 'User not found' });
		}

		if (user.isActive) {
			return res.status(400).send({ message: 'The user is already activated' });
		}

		user.isActive = true;
		await user.save();

		res.status(200).send({ message: 'User activated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'Internal server error' });
	}
});

module.exports = router;
