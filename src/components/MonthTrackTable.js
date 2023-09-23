import React from 'react'
import { Table } from 'react-bootstrap'

const MonthTrackTable = ({ values, disable, setTrainer, month }) => {

    const handleValueChange = (index, value) => {
        values[index] = value
        setTrainer('changeValue', {
            month,
            values
        })
    }

    const handleHeaderChange = (index, value) => {
        values[index] = value
        setTrainer('changeDate', {
            values
        })
    }

    return (
        <div style={{ height: '50px' }}>

            <div dir='rtl' style={{ display: 'flex' }}>
                {
                    month === '' ?
                        values.map((value, index) => {
                            return (<section
                                style={{
                                    backgroundColor: '#C9D1DA',
                                    minWidth: '100px',
                                    margin: '5px',
                                    border: '1px black solid',
                                    padding: '5px'
                                }}
                                key={index}
                            >
                                <input
                                    disabled={disable}
                                    onChange={(e) => handleHeaderChange(index, e.target.value)}
                                    value={value}
                                    style={{
                                        border: 'none',
                                        width: '100%'
                                    }}
                                />
                            </section>
                            )
                        })
                        :
                        values.map((value, index) => (
                            <section style={{
                                backgroundColor: '#C9D1DA',
                                minWidth: '100px',
                                margin: '5px',
                                border: '1px black solid',
                                padding: '5px'
                            }}
                                key={index}
                            >
                                <input
                                    disabled={disable}
                                    onChange={(e) => handleValueChange(index, e.target.value)}
                                    value={value}
                                    style={{
                                        border: 'none',
                                        width: '100%'
                                    }}
                                />
                            </section>
                        ))
                }
            </div>
        </div>
    )
}

export default MonthTrackTable