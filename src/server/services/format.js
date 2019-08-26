module.exports.json = ({ rows, headers }) => {
    return rows.map(row => {
        const newRow = {}
        headers.forEach((header, i) => {
            newRow[header] = row[i]
        })
        return newRow
    })
}

module.exports.csv = ({ rows, headers }) => {
    return `${headers.join(',')}
${rows.map(r => r.join(',')).join('\n')}
`
}
