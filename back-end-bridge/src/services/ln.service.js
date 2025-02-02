const { auth, createInvoice, getInvoice, pay } = require('ln-service')
const { Buffer } = require('buffer')
const { socket, macaroonBase64, tlsCertBase64 } = require('../../environment/lightning')

const { lnd } = auth({
    socket,
    macaroon: Buffer.from(macaroonBase64, 'base64').toString('hex'),
    cert: Buffer.from(tlsCertBase64, 'base64').toString()
})

async function createLnInvoice(amount, memo) {
    const invoice = await createInvoice({
        lnd,
        tokens: amount,
        description: memo || 'LN<>XRPL Bridge Payment',
        expires_at: new Date(Date.now() + 5 * 60_000).toISOString()
    })
    return {
        success: true,
        request: invoice.request,
        id: invoice.id,
        expires_at: invoice.expires_at
    }
}

async function checkLnInvoice(invoiceId) {
    const { is_confirmed, is_canceled } = await getInvoice({ lnd, id: invoiceId })
    return { success: true, isConfirmed: is_confirmed, isCanceled: is_canceled }
}

async function payLnInvoice(invoice) {
    try {
        const payment = await pay({
            lnd,
            request: invoice
        })

        return {
            success: true,
            payment
        }
    } catch (error) {
        console.error('Lightning payment error:', error)
        return { success: false, error: error.message }
    }
}

module.exports = { createLnInvoice, checkLnInvoice, payLnInvoice }
