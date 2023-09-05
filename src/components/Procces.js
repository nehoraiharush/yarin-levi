import React from 'react'

const Procces = ({ trainer, setTrainer, disable }) => {

    const handleChange = (e) => {
        setTrainer({
            ...trainer,
            trainingInfo: {
                ...trainer.trainingInfo,
                process: e.target.value
            }
        })
    }


    return (
        <div className='box-shadow-container' style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            padding: '10px',
            paddingTop: '5px',
            paddingRight: '10px',
            paddingLeft: '15px',
            height: '180px'
        }}>
            <div dir='auto'>
                בתהליך:
            </div>
            <input
                disabled={disable}
                onChange={handleChange}
                style={{
                    width: '170px',
                    fontSize: '4em',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    textAlign: 'center'
                }}
                value={trainer.trainingInfo.process}
            />

        </div>
    )
}

export default Procces