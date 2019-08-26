const { addMonths, format } = require('date-fns')
const monthFormat = 'MMMM yyyy'

module.exports.monthFormat = monthFormat

module.exports.createDateRange = (firstRow, lastRow) => {
    let currentDate = Date.parse(firstRow[1])
    const end = format(Date.parse(lastRow[1]), monthFormat)
    const result = [format(currentDate, monthFormat)]
    while (format(currentDate, monthFormat) !== end) {
        currentDate = addMonths(currentDate, 1)
        result.push(format(currentDate, monthFormat))
    }
    return result
}
