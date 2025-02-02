const express = require('express')
const { createLnInvoice, checkLnInvoice } = require('../services/ln.service')

const router = express.Router()

router.post('/create-invoice', async (req, res) => {
    const { amount, memo } = req.body
    try {
        const invoice = await createLnInvoice(amount, memo)
        res.json(invoice)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/check-invoice', async (req, res) => {
    const { invoiceId } = req.body
    try {
        const status = await checkLnInvoice(invoiceId)
        res.json(status)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
