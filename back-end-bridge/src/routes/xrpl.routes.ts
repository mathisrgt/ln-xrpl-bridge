const express = require('express')
const { sendXrplPayment, checkXrplTransaction } = require('../services/xrpl.service')
const { payLnInvoice } = require('../services/ln.service')

const router = express.Router()

router.post('/transfer', async (req, res) => {
    const { destination, amountDrops } = req.body
    try {
        const result = await sendXrplPayment(destination, amountDrops)
        res.json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/pay-ln', async (req, res) => {
    const { invoice, transactionId } = req.body

    try {
        // Verify
        const xrplPaymentConfirmed = await checkXrplTransaction(transactionId)
        if (!xrplPaymentConfirmed) {
            return res.status(400).json({ error: 'XRPL transaction not confirmed' })
        }

        // If XRP received, pay LN invoice
        const lnPaymentResult = await payLnInvoice(invoice)
        res.json(lnPaymentResult)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
