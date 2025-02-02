const xrpl = require('xrpl')
const { seed } = require('../../environment/xrpl')

async function getXrplDepositAddress() {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()
    const wallet = xrpl.Wallet.fromSeed(seed)
    await client.disconnect()
    return wallet.classicAddress
}

async function sendXrplPayment(destination, amountDrops) {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    const wallet = xrpl.Wallet.fromSeed(seed)

    const paymentTx = {
        TransactionType: 'Payment',
        Account: wallet.classicAddress,
        Amount: amountDrops.toString(),
        Destination: destination
    }

    const prepared = await client.autofill(paymentTx)
    const signed = wallet.sign(prepared)
    const submitResult = await client.submitAndWait(signed.tx_blob)

    await client.disconnect()

    return { success: true, result: submitResult.result }
}

async function checkXrplTransaction(transactionId) {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    try {
        const txResponse = await client.request({
            command: 'tx',
            transaction: transactionId
        })

        await client.disconnect()

        if (txResponse.result && txResponse.result.validated) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error('XRPL transaction check error:', error)
        return false
    }
}

async function payXrplInvoice(destination, amountDrops) {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    try {
        const wallet = xrpl.Wallet.fromSeed(seed)

        const paymentTx = {
            TransactionType: 'Payment',
            Account: wallet.classicAddress,
            Amount: amountDrops.toString(),
            Destination: destination
        }

        const prepared = await client.autofill(paymentTx)
        const signed = wallet.sign(prepared)
        const submitResult = await client.submitAndWait(signed.tx_blob)

        await client.disconnect()

        return { success: true, result: submitResult.result }
    } catch (error) {
        console.error('XRP payment error:', error)
        await client.disconnect()
        return { success: false, error: error.message }
    }
}

module.exports = { sendXrplPayment, checkXrplTransaction, payXrplInvoice, getXrplDepositAddress }
