const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		default: '',
	},
	address1: {
		type: String,
		default: '',
	},
	address2: {
		type: String,
		default: '',
	},
	zip: {
		type: String,
		default: '',
	},
	phone: {
		type: String,
		default: '',
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	invoices: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Invoice',
		},
	],
	passwordHash: {
		type: String,
		required: true,
	},
	taxNumber: {
		type: String,
		default: '',
	},
	accountNumber: {
		type: String,
		default: '',
	},
	country: {
		type: String,
		default: '',
	},
	lastNumberOfInvoice: {
		type: Number,
		required: true,
		default: 0,
	},
	isActive: {
		type: Boolean,
		default: 0,
	},
	activationToken: {
		type: String,
		default: 0,
	},
});

userSchema.virtual('id').get(function () {
	return this._id.toHexString();
});
userSchema.set('toJSON', {
	virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
