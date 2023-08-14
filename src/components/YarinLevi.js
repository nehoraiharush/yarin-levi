import React from "react";

const YarinLevi = (props) => {

    return (
        <>
            <h1 style={{
                fontFamily: 'Bacasime Antique, serif',
                fontSize: '4rem',
                textAlign: 'center',
                fontWeight: '700',
                color: `${props.color}`,
                userSelect: 'none'
            }}>
                Yarin Levi
            </h1>
        </>
    );

}

export default YarinLevi