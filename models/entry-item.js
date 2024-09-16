const mongoose = require('mongoose');

const entryItemSchema = mongoose.Schema({
	nameEntry: {
		type: String,
		require: true,
	},
	quantityEntry: {
		type: Number,
		default: 1,
	},
	taxEntry: {
		type: Number,
		default: 23,
	},
	netAmountEntry: {
		type: Number,
		required: true,
	},
	grossEntry: {
		type: Number,
		required: true,
	},
});

exports.EntryItem = mongoose.model('EntryItem', entryItemSchema);
