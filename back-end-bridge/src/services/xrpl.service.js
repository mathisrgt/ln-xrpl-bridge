const xrpl = require('xrpl')
const { seed } = require('../../environment/xrpl')

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

module.exports = { sendXrplPayment }
