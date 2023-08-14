import React from 'react'
import { Table } from 'react-bootstrap'

import '../style/Table.css'

const parameters = [
    'תאריך',
    'חזה',
    'יד',
    'אמה',
    'בטן',
    'ירך',
    'תאומים'
]


const ScopeTable = ({ trainer, setTrainer }) => {

    const dates = trainer?.trainingInfo.dates;
    const values = trainer?.trainingInfo.values

    const handleFirstInfoChange = (index, value) => {
        setTrainer({
            ...trainer,
            trainingInfo: {
                ...trainer.trainingInfo,
                values: values.map((val, i) => i === index ? { ...val, firstValue: value } : val)
            }
        });
    }
    const handleSecondInfoChange = (index, value) => {
        setTrainer({
            ...trainer,
            trainingInfo: {
                ...trainer.trainingInfo,
                values: values.map((val, i) => i === index ? { ...val, secondValue: value } : val)
            }
        });
    }

    const handleDateChange = (index, value) => {
        setTrainer({
            ...trainer,
            trainingInfo: {
                ...trainer.trainingInfo,
                dates: dates.map((date, i) => i === index ? value : date)
            }
        });
    }

    // console.log(dates)

    return (
        <div style={{ display: 'flex', gap: '10px' }} >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                    parameters.map((param, index) => (
                        <h5 style={{ height: '28px', textAlign: 'left' }} key={index} >{param}</h5>
                    ))
                }
            </div>
            <Table style={{
                border: '1px solid #000',


            }} size='sm' bordered striped hover responsive>
                <thead >
                    <tr style={{ width: '50px' }}>
                        {
                            dates.map((date, index) => (
                                <th key={index}>
                                    <input onChange={(e) => { handleDateChange(index, e.target.value) }} value={date} style={{ border: 'none', width: '100%' }} />
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>

                    {
                        values.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        onChange={(e) => handleFirstInfoChange(index, e.target.value)}
                                        value={row.firstValue}
                                        style={{ border: 'none', width: '100%' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        onChange={(e) => { handleSecondInfoChange(index, e.target.value) }}
                                        value={row.secondValue}
                                        style={{ border: 'none', width: '100%' }}
                                    />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h5 style={{ height: '28px', visibility: 'hidden' }}>5</h5>
                {
                    values && values.length > 0 &&
                    values.map((value, index) => {
                        return (
                            <h5
                                style={{
                                    height: '28px',
                                    textAlign: 'right',
                                    visibility: value.firstValue === '' || value.secondValue === '' ?
                                        'hidden' : ''
                                }}
                                key={index}
                                dir='auto'
                            >
                                {
                                    parseFloat(value.secondValue) - parseFloat(value.firstValue) > 0 ?
                                        `+${parseFloat(value.secondValue) - parseFloat(value.firstValue)}`
                                        :
                                        `${parseFloat(value.secondValue) - parseFloat(value.firstValue)}`
                                }
                            </h5>
                        );
                    })
                }
            </div>

        </div >
    )
}

export default ScopeTable