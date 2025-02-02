const express = require('express')
const { getXrplDepositAddress, sendXrplPayment, checkXrplTransaction } = require('../services/xrpl.service')
const { payLnInvoice } = require('../services/ln.service')

const router = express.Router()

router.post('/get-deposit-address', async (req, res) => {
    try {
        const address = await getXrplDepositAddress()
        res.json({ address })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/check-xrpl-payment', async (req, res) => {
    const { transactionId, lnInvoice } = req.body
    try {
        const xrplPaymentConfirmed = await checkXrplTransaction(transactionId)

        if (!xrplPaymentConfirmed) {
            return res.json({ success: false, message: 'XRP payment not confirmed yet' })
        }

        const lnPaymentResult = await payLnInvoice(lnInvoice)

        return res.json({ success: lnPaymentResult.success, lnPaymentResult })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
