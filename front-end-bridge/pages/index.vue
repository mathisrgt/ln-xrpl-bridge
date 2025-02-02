<template>
  <UContainer class="min-h-screen flex items-center justify-center">
    <UCard class="p-6 max-w-xl mx-auto">
      <div class="flex items-center justify-center gap-2 mb-4">
        <img src="/public/ln.svg" class="h-5 w-5 mt-0.5" />
        <h1 class="text-2xl font-bold text-center text-purple-600">
          Lightning Network - XRPL Bridge
        </h1>
      </div>

      <div class="swap-box">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-300">From</label>
          <UButtonGroup>
            <UButton
              :color="swapFrom === 'btc' ? 'purple' : 'gray'"
              @click="swapFrom = 'btc'"
            >
              <img src="/btc.svg" class="h-5 w-5 mr-2" /> BTC
            </UButton>
            <UButton
              :color="swapFrom === 'xrp' ? 'purple' : 'gray'"
              @click="swapFrom = 'xrp'"
            >
              <img src="/xrp.svg" class="h-5 w-5 mr-2" /> XRP
            </UButton>
          </UButtonGroup>
        </div>

        <UInput v-model="amount" placeholder="Enter amount" type="number" class="mb-4" />

        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-300">To</label>
          <UButtonGroup class="opacity-50 pointer-events-none">
            <UButton color="violet">
              <img :src="swapTo === 'btc' ? '/btc.svg' : '/xrp.svg'" class="h-5 w-5 mr-2" />
              {{ swapTo.toUpperCase() }}
            </UButton>
          </UButtonGroup>
        </div>

        <UInput :placeholder="computedToAmount" type="number" class="mb-4" disabled />

        <!-- Deposit Info -->
        <div v-if="depositAddress" class="mt-4 p-3 bg-gray-900 rounded text-white">
          <p class="text-sm font-medium">Deposit Address:</p>
          <p class="text-xs break-all">{{ depositAddress }}</p>
          <UButton class="mt-2 w-full bg-purple-600 hover:bg-purple-700" @click="checkPaymentStatus">
            Check payment status
          </UButton>
        </div>

        <!-- Swap Button -->
        <div class="flex justify-center" v-if="!depositAddress">
          <UButton class="mt-6 w-full bg-purple-600 hover:bg-purple-700" @click="startSwap" :loading="loading" size="lg">
            Start
          </UButton>
        </div>

        <div class="mt-3 text-center text-gray-400">
          <p v-if="conversionRate">
            Est. Price: 1 {{ swapFrom.toUpperCase() }} = {{ conversionRate }} {{ swapTo.toUpperCase() }}
          </p>
        </div>
      </div>

      <div v-if="swapResult" class="mt-4 p-3 border border-orange-500 rounded">
        <p class="text-sm font-medium text-orange-400">Transaction Result:</p>
        <p class="text-xs text-gray-300">{{ swapResult }}</p>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const swapFrom = ref('btc')
const swapTo = computed(() => (swapFrom.value === 'btc' ? 'xrp' : 'btc')) 
const amount = ref('')
const loading = ref(false)
const swapResult = ref(null)
const conversionRate = ref(null)
const depositAddress = ref(null)
const paymentStatus = ref(null)

const computedToAmount = computed(() => {
  return amount.value && conversionRate.value
    ? (amount.value * conversionRate.value).toFixed(4)
    : '0'
})

async function fetchPrice() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ripple&vs_currencies=usd'
    )
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    const btcPrice = data.bitcoin.usd
    const xrpPrice = data.ripple.usd

    conversionRate.value = swapFrom.value === 'btc'
      ? (btcPrice / xrpPrice).toFixed(4)
      : (xrpPrice / btcPrice).toFixed(8)
  } catch (error) {
    console.error('Error fetching price:', error) 
  }
}

watch(swapFrom, fetchPrice)
onMounted(fetchPrice)

async function startSwap() {
  loading.value = true
  depositAddress.value = null

  try {
    let response
    if (swapFrom.value === 'btc') {
      response = await fetch('/api/ln-create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount.value, memo: 'XRPL Swap' })
      })
    } else {
      response = await fetch('/api/xrpl/get-deposit-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
    }

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    
    const data = await response.json()
    depositAddress.value = data.address || data.request 
  } catch (err) {
    console.error('Swap error:', err)
    swapResult.value = `Error: ${err.message}`
  } finally {
    loading.value = false
  }
}

async function checkPaymentStatus() {
  loading.value = true

  try {
    const response = await fetch('/api/check-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: depositAddress.value })
    })

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    paymentStatus.value = data.status

    if (data.success) {
      swapResult.value = 'Swap Completed Successfully ✅'
      depositAddress.value = null
    } else {
      swapResult.value = `Waiting for payment confirmation...`
    }
  } catch (err) {
    console.error('Payment check error:', err)
    swapResult.value = `Error: ${err.message}`
  } finally {
    loading.value = false
  }
}
</script>
