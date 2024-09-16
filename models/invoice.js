const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
	invoiceNumber: {
		type: String,
		required: true,
	},
	invoiceDate: {
		type: Date,
		default: Date.now,
	},
	dueDate: {
		type: String,
		required: true,
	},
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Customer',
	},
	entryItem: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'EntryItem',
			required: true,
		},
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	netAmountSum: {
		type: Number,
		required: true,
	},
	grossSum: {
		type: Number,
		required: true,
	},
});

invoiceSchema.virtual('id').get(function () {
	return this._id.toHexString();
});
invoiceSchema.set('toJSON', {
	virtuals: true,
});

exports.Invoice = mongoose.model('Invoice', invoiceSchema);
