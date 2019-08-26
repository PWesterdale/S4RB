require('dotenv').config()
const express = require('express')
const app = express()
const complaints = require('./services/complaints')
const formatters = require('./services/format')

app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

app.get('/complaints', (req, res) => {
    const hasFormat =
        req.query.format && ['json', 'csv'].includes(req.query.format)
    const format = hasFormat ? req.query.format : 'json'

    const hasFilter =
        req.query.filter && ['byMonth', 'byQuarter'].includes(req.query.filter)
    const filter = hasFilter ? req.query.filter : 'byMonth'

    const data = complaints[filter]()

    if (format === 'csv') {
        res.setHeader(
            'Content-disposition',
            'attachment; filename=complaints.csv'
        )
    }

    return res.type(format).send(formatters[format](data))
})

const port = 3000 || process.env.PORT
console.log(`Running on ${port}`)
app.listen(port)
