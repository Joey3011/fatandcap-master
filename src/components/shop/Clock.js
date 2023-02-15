import React,{useState, useEffect} from 'react'
import { Col, Container, Row } from 'reactstrap'
import '../../styles/clock.css'

const Clock = () => {
    //for counting days/hours left for limited offer.
    const [days, setDays] = useState()
    const [hours, setHours] = useState()
    const [minutes, setMinutes] = useState()
    const [seconds, setSeconds] = useState()
    let interval;
    const  countDown =() => {
        const destination = new Date('Feb, 04 2023').getTime()
        interval = setInterval(()=> {
            const now = new Date().getTime()
            const different = destination - now
            const days = Math.floor(different / (1000 * 60 * 60 * 24))
            const hours = Math.floor(different % (1000 * 60 * 60 * 24) / (1000 *60*60))
            const minutes = Math.floor(different % (1000 * 60 * 60 ) / (1000 *60))
            const seconds = Math.floor(different % (1000 * 60) / 1000 )
            if(destination < 0 ) clearInterval(interval.current)
            else {
                setDays(days)
                setHours(hours)
                setMinutes(minutes)
                setSeconds(seconds)
            }
        });
    };
    useEffect(()=>{
        countDown()
    })

  return (
        <>
            <div className="clock_wrapper d-flex align-items-center gap-2">
                <div className="clock_data d-flex align-items-center gap-3">
                    <div>
                        <h1 className="text-center text-white fs-2 mb-2">{days}</h1>
                        <h5 className="text-white">Days</h5>
                    </div>
                    <span className="text-white mb-3 fs-1">:</span>
                </div>

                <div className="clock_data d-flex align-items-center gap-3">
                    <div>
                        <h1 className="text-center text-white fs-2 mb-2">{hours}</h1>
                        <h5 className="text-white">Hours</h5>
                    </div>
                    <span className="text-white mb-3 fs-1">:</span>
                </div>

                <div className="clock_data d-flex align-items-center gap-3">
                    <div>
                        <h1 className="text-center text-white fs-2 mb-2">{minutes}</h1>
                        <h5 className="text-white">Minutes</h5>
                    </div>
                    <span className="text-white mb-3 fs-1">:</span>
                </div>

                <div className="clock_data d-flex align-items-center gap-3">
                    <div>
                        <h1 className="text-center text-white fs-2 text-center">{seconds}</h1>
                        <h5 className="text-white mt-2">Seconds</h5>
                    </div>
                </div>
            </div>
        </>
  )
}

export default Clock
