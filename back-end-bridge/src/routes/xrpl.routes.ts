const express = require('express')
const { sendXrplPayment } = require('../services/xrpl.service')

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

module.exports = router
