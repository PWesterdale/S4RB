import fetch from 'isomorphic-fetch'

export async function getComplaints(filter) {
    return await fetch(`/complaints${filter ? `?filter=${filter}` : ''}`).then(
        res => res.json()
    )
}
