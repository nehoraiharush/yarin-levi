import React from 'react';

const Weight = ({ trainer, setTrainer, disable }) => {

    const handleChange = (e) => {
        const varName = e.target.name

        setTrainer({
            ...trainer,
            trainingInfo: {
                ...trainer.trainingInfo,
                [varName]: e.target.value
            }
        })
    }

    return (
        <div className='box-shadow-container' style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            padding: '10px',
            paddingTop: '3px'
        }}>
            <p style={{ margin: '0' }} dir='rtl'>
                <input
                    disabled={disable}
                    name='weight'
                    onChange={handleChange}
                    style={{
                        height: '195px',
                        width: '185px',
                        fontSize: '5em',
                        fontWeight: '500',
                        background: 'none',
                        border: 'transparent',
                        borderRadius: '10px',
                        color: 'white',
                        textAlign: 'center'
                    }}
                    dir='auto'
                    value={trainer.trainingInfo.weight}
                />
                {/* <span style={{ fontSize: '5em', fontWeight: '500', }}>&nbsp;{trainer.trainingInfo.weight}</span> */}
                <sub style={{ fontSize: '25px', fontWeight: '500' }}>
                    <input
                        disabled={disable}
                        name='trend'
                        onChange={handleChange}
                        style={{
                            width: '50px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            textAlign: 'center'
                        }}
                        dir='auto'
                        value={trainer.trainingInfo.trend}
                    />

                </sub>
            </p>
            <p style={{ textAlign: 'center', height: '10px' }}>Kg</p>

        </div>
    )
}

export default Weight