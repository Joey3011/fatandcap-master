import React from 'react'
import { FaGrinBeamSweat } from 'react-icons/fa'


export const EmptyCart = () => {
    return (
        <tr className='d-flex justify-content-center align-items-center'>
            <td style={{height: '20rem', marginTop: '10rem'}}>
                <FaGrinBeamSweat style={{fontSize: '10rem', color: '#4B4A80'}}/>
            </td>
        </tr>
    )
}

export default EmptyCart

