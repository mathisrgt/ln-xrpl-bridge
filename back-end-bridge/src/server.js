const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const lnRoutes = require('./routes/ln.routes')
const xrplRoutes = require('./routes/xrpl.routes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

app.use('/api/ln', lnRoutes)
app.use('/api/xrpl', xrplRoutes)

app.listen(PORT, () => {
    console.log(`⚡ Server running on http://localhost:${PORT}`)
})
