const express = require('express')
const { createLnInvoice, checkLnInvoice } = require('../services/ln.service')
const { payXrplInvoice } = require('../services/xrpl.service')

const router = express.Router()

router.post('/create-invoice', async (req, res) => {
    const { amount, destination } = req.body
    try {
        const invoice = await createLnInvoice(amount, 'BTC → XRP Swap')
        res.json({ invoice, destination })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/check-invoice', async (req, res) => {
    const { invoiceId, destination } = req.body
    try {
        const status = await checkLnInvoice(invoiceId)

        if (status.isConfirmed) {
            const xrpResult = await payXrplInvoice(destination, status.amount * 1_000_000)
            return res.json({ success: xrpResult.success, xrpResult })
        } else {
            return res.json({ success: false, message: 'Waiting for BTC payment confirmation...' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
