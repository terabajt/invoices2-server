const express = require('express');
const { Invoice } = require('../models/invoice');
const { EntryItem } = require('../models/entry-item');
const { User } = require('../models/user');
const mongoose = require('mongoose');

const router = express.Router();

//localhost:3000/api/v1/invoices

// router.get('/', async (req, res) => {
// 	const invoiceList = await Invoice.find()
// 		.populate('entryItem', 'user')
// 		.populate({ path: 'entryItem' })
// 		.populate('customer')
// 		.sort({ invoiceDate: -1 });
// 	if (!invoiceList) {
// 		res.status(500).json({ success: false });
// 	}
// 	res.send(invoiceList);
// });

router.get('/foruser/:userID', async (req, res) => {
	const { userID } = req.params;
	if (!mongoose.Types.ObjectId.isValid(userID)) {
		return res.status(400).json({ message: 'Invalid ID format.' });
	}

	try {
		const user = await User.findOne({ _id: req.params.userID });
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}
		const invoiceList = await Invoice.find({ user: req.params.userID })
			.populate('entryItem', 'user')
			.populate({ path: 'entryItem' })
			.populate('customer')
			.sort({ invoiceDate: -1 });

		if (!invoiceList || invoiceList.length === 0) {
			return res.status(404).json({ success: false, message: 'No invoices found for the user' });
		}
		res.send(invoiceList);
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'Invalid ID format.' });
	}
	const invoice = await Invoice.findById(req.params.id).populate('user', 'entryItem').populate({ path: 'entryItem' });
	if (!invoice) {
		res.status(500).json({ success: false });
	}
	res.send(invoice);
});

router.post('/', async (req, res) => {
	try {
		// Creating new EntryItems i feedback it's ids
		const entryItemsIds = await Promise.all(
			req.body.entryItem.map(async entryItem => {
				let newEntryItem = new EntryItem({
					nameEntry: entryItem.nameEntry,
					quantityEntry: entryItem.quantityEntry,
					taxEntry: entryItem.taxEntry,
					netAmountEntry: entryItem.netAmountEntry,
					grossEntry: entryItem.grossEntry,
				});
				newEntryItem = await newEntryItem.save();
				return newEntryItem._id;
			})
		);
		// Creating a new invoice
		let invoice = new Invoice({
			invoiceNumber: req.body.invoiceNumber,
			invoiceDate: req.body.invoiceDate,
			dueDate: req.body.dueDate,
			customer: req.body.customer,
			entryItem: entryItemsIds,
			user: req.body.user,
			netAmountSum: req.body.netAmountSum,
			grossSum: req.body.grossSum,
		});
		invoice = await invoice.save();
		if (!invoice) return res.status(400).send('The invoice cannot be created');
		// add new incovice to  'invoices' of User
		const newInvoiceId = invoice._id;
		const userId = req.body.user;

		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			{ $inc: { lastNumberOfInvoice: 1 }, $push: { invoices: newInvoiceId } },
			{ new: true }
		);
		if (!updatedUser) {
			return res.status(404).json({ error: 'User not found' });
		}
		return res.status(200).json(invoice);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

router.post('/entryitem', async (req, res) => {
	let entryItem = new EntryItem({
		nameEntry: req.body.nameEntry,
		quantityEntry: req.body.quantityEntry,
		taxEntry: req.body.taxEntry,
		netAmountEntry: req.body.netAmountEntry,
		grossEntry: req.body.grossEntry,
	});

	entryItem = await entryItem.save();

	const newEntryItemId = entryItem._id;
	const invoiceId = req.body.invoiceId;
	const result = await Invoice.updateOne({ _id: invoiceId }, { $push: { entryItem: newEntryItemId } });

	if (!result) return res.send(400).send('Cant find invoice with this number');
	if (!entryItem) return res.status(400).send('Entry item cannot be created!');

	res.send(entryItem);
});

router.delete('/entryitem/:id', async (req, res) => {
	try {
		const entryItemId = req.params.id;
		const invoice = await Invoice.findOne({ entryItem: entryItemId });
		if (!invoice) {
			return res.status(404).json({ success: false, message: 'Invoice not found for the given entry item.' });
		}
		const updatedEntryItems = invoice.entryItem.filter(item => item.toString() !== entryItemId);
		invoice.entryItem = updatedEntryItems;
		await invoice.save();
		await EntryItem.findByIdAndRemove(entryItemId);

		return res.status(200).json({ success: true, message: 'The item is deleted.' });
	} catch (err) {
		return res.status(400).json({ success: false, error: err });
	}
});

router.put('/entryitem/:id', async (req, res) => {
	const entryItem = await EntryItem.findByIdAndUpdate(
		req.params.id,
		{
			nameEntry: req.body.nameEntry,
			quantityEntry: req.body.quantityEntry,
			taxEntry: req.body.taxEntry,
			netAmountEntry: req.body.netAmountEntry,
			grossEntry: req.body.grossEntry,
		},
		{
			new: true,
		}
	);
	if (!entryItem) return res.status(400).send('Entry item cannot be updated.');

	res.send(entryItem);
});

router.put('/:id', async (req, res) => {
	const invoice = await Invoice.findByIdAndUpdate(
		req.params.id,
		{
			invoiceNumber: req.body.invoiceNumber,
			invoiceDate: req.body.invoiceDate,
			dueDate: req.body.dueDate,
			customer: req.body.customer,
			user: req.body.user,
			netAmountSum: req.body.netAmountSum,
			grossSum: req.body.grossSum,
		},
		{
			new: true,
		}
	);
	if (!invoice) return res.status(400).send('The invoice cannot be updated');

	res.send(invoice);
});

router.delete('/:id', (req, res) => {
	Invoice.findByIdAndRemove(req.params.id)
		.then(user => {
			if (user) {
				return res.status(200).json({ success: true, message: 'The invoice is deleted.' });
			} else {
				return res.status(404).json({ success: false, message: 'Invoices not found.' });
			}
		})
		.catch(err => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.get('/get/invoicesNumber', async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'Invalid ID format.' });
	}
	const invoicesCount = await Invoice.countDocuments();

	if (!invoicesCount) {
		res.status(500).json({ success: false });
	}
	res.send({
		invoicesCount: invoicesCount,
	});
});

//STATISTICS
router.get('/statistics/:userID', async (req, res) => {
	try {
		console.log('Dotarło do endpointu /statistics');

		// Pobierz identyfikator użytkownika z parametrów ścieżki
		const userID = req.params.userID;

		// Sprawdź, czy identyfikator użytkownika jest poprawny
		if (!mongoose.Types.ObjectId.isValid(userID)) {
			console.log('Nieprawidłowy identyfikator użytkownika');
			return res.status(400).json({ error: 'Invalid ID format for user.' });
		}

		// Pobierz faktury tylko dla określonego użytkownika
		const invoices = await Invoice.find({ user: userID });

		// Grupuj faktury według roku i miesiąca, oblicz sumy brutto
		const yearlyGrossSums = invoices.reduce((acc, invoice) => {
			const year = invoice.invoiceDate.getFullYear();
			const month = invoice.invoiceDate.getMonth();
			const key = `${year}-${month}`;
			acc[key] = (acc[key] || 0) + invoice.grossSum;
			return acc;
		}, {});

		res.json(yearlyGrossSums);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Wystąpił błąd serwera', details: error.message });
	}
});

module.exports = router;
