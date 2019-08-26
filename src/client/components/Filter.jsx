import React from 'react'
import cn from 'classnames'

export default ({ active, loading, setFilter }) => {
    return (
        <div className="filters">
            <button
                className={cn([
                    'button',
                    active === 'byMonth' && loading ? 'is-loading' : false,
                    active === 'byMonth' ? 'active' : false,
                ])}
                onClick={() => setFilter('byMonth')}
            >
                Monthly
            </button>
            <button
                className={cn([
                    'button',
                    active === 'byQuarter' && loading ? 'is-loading' : false,
                    active === 'byQuarter' ? 'active' : false,
                ])}
                onClick={() => setFilter('byQuarter')}
            >
                Quarterly
            </button>
        </div>
    )
}
