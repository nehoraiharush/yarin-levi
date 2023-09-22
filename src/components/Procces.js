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

    const inputsize =
        trainer.trainingInfo.process.replace(/ /g, '').length * 60
        -
        (trainer.trainingInfo.process.replace(/ /g, '').length <= 3 ? 0 : trainer.trainingInfo.process.replace(/ /g, '').length * 5);

    return (
        <div className='box-shadow-container' style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            height: `${inputsize - 20}px`,
            minHeight: '190px'
        }}>
            <div dir='auto'>
                בתהליך:
            </div>
            <input
                disabled={disable}
                onChange={handleChange}
                style={{
                    minWidth: '200px',
                    width: `${inputsize}px`,
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