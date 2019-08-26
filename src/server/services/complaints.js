const { readFileSync } = require('fs')
const parse = require('csv-parse/lib/sync')
const { format } = require('date-fns')
const { monthFormat, createDateRange } = require('./date')
const { ROW, QROW } = require('../../helper/rowShape')

const rawData = readFileSync(`${__dirname}/../../data/complaints.csv`, 'utf-8')
const rows = parse(rawData)
const headers = rows.shift()
headers.push('CPMU')

function calculateCPMU(complaints, unitsSold) {
    return ((complaints / unitsSold) * 1000000).toFixed(5)
}

const byDate = rows.reduce((acc, row) => {
    const rowDate = Date.parse(row[ROW.MONTH])
    const month = format(rowDate, monthFormat)
    row[ROW.QUARTER] = `Q${format(rowDate, `Q yyyy`)}`
    row[ROW.MONTH] = month
    row[ROW.COMPLAINTS] = Number(row[ROW.COMPLAINTS])
    row[ROW.UNITS_SOLD] = Number(row[ROW.UNITS_SOLD])
    row[ROW.CPMU] = calculateCPMU(row[ROW.COMPLAINTS], row[ROW.UNITS_SOLD])
    acc[month] = row
    return acc
}, {})

const newSeries = createDateRange(rows[0], rows[rows.length - 1]).map(date => {
    return byDate[date]
        ? byDate[date]
        : ['No Value', date, 'No Value', 'No Value', 'No Value']
})

module.exports = {
    byMonth: () => {
        return {
            rows: newSeries,
            headers: headers,
        }
    },
    byQuarter: () => {
        const headers = ['Quarter', 'Complaints', 'UnitsSold', 'CPMU']
        let newRows = newSeries.reduce((acc, row) => {
            if (row[0] === 'No Value') return acc
            if (!acc[row[0]]) {
                acc[row[ROW.QUARTER]] = [
                    row[ROW.QUARTER],
                    row[ROW.COMPLAINTS],
                    row[ROW.UNITS_SOLD],
                    0,
                ]
            } else {
                const prev = acc[row[ROW.QUARTER]]
                acc[row[ROW.QUARTER]] = [
                    prev[QROW.QUARTER],
                    prev[QROW.COMPLAINTS] + row[ROW.COMPLAINTS],
                    prev[QROW.UNITS_SOLD] + row[ROW.UNITS_SOLD],
                    0,
                ]
            }
            return acc
        }, {})
        newRows = Object.values(newRows).map(newRow => {
            newRow[QROW.CPMU] = calculateCPMU(
                newRow[QROW.COMPLAINTS],
                newRow[QROW.UNITS_SOLD]
            )
            return newRow
        })
        return {
            rows: newRows,
            headers,
        }
    },
}
