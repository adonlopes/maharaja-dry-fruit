const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

const fs = require('fs')

// Serve the admin UI if built, otherwise provide helpful notice
const adminDistPath = path.join(__dirname, 'admin-ui/dist')
const adminIndexPath = path.join(adminDistPath, 'index.html')
if (fs.existsSync(adminIndexPath)) {
  app.use('/admin', express.static(adminDistPath))
  app.get(/^\/admin.*/, (req, res) => {
    res.sendFile(adminIndexPath)
  })
} else {
  app.get(/^\/admin.*/, (req, res) => {
    res.send('<h2>Admin UI is not built yet.</h2><p>Please run <code>cd admin-ui && npm install && npm run build</code> to build the admin dashboard.</p>')
  })
}

// Serve public static files (the customer facing site)

// Serve the customer storefront homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Serve storefront assets and images
app.use(express.static(path.join(__dirname)))


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
