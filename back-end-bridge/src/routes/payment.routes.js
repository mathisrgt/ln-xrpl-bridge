const express = require('express')
const { checkLnInvoice } = require('../services/ln.service')
const { checkXrplTransaction } = require('../services/xrpl.service')

const router = express.Router()

router.post('/check-payment', async (req, res) => {
    const { address } = req.body

    try {
        let status = false
        if (address.startsWith('ln')) {
            status = await checkLnInvoice(address)
        } else {
            status = await checkXrplTransaction(address)
        }

        if (status) {
            return res.json({ success: true, message: 'Payment Confirmed ✅' })
        } else {
            return res.json({ success: false, message: 'Payment Pending...' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
