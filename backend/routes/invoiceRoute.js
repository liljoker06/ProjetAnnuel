const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/controllerInvoice');

router.get('/', invoiceController.getAllInvoices);
router.post('/create', invoiceController.createInvoice);
// router.get('/:id', invoiceController.getInvoiceById);
router.post('/getInvoicesByUserId', invoiceController.getInvoicesByUserId);


module.exports = router;
