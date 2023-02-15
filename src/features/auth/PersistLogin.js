import { Navigate, Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import Spinner from '../../components/Spinner/Spinner'

const PersistLogin = () => {

    const token = useSelector(selectCurrentToken)
    console.log("token exist?")
    const effectRan = useRef(false)
    
    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()




    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (token) verifyRefreshToken()
            console.log('verify refresh: if token exist redirect to private page else go back to login')
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])


    let content
    if (!token || token === null || token === "") { //  token: no
        console.log('token: no, then go back to login...')
        content = (
        <p  style={{minHeight: '100vh'}}>
            <Navigate to="/fatandcap/auth/login" />
        </p>
        )
    }else{
        if (isLoading) { //persist: yes, token: no
            console.log('loading...')
            content = <Spinner  />
        } else if (isError) { //token: no or error due to lack of token
            console.log('error')
            content = (
                <p className='text-center errmsg mt-5 text-danger' style={{minHeight: '100vh'}}>
                    {`${error?.data?.message} - `}
                    <Link to="/fatandcap/auth/login">Please login again</Link>.
                </p>
            )
        } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
            console.log('success')
            content = <Outlet />
        } else if (token && isUninitialized) { //persist: yes, token: yes
            console.log('token and uninit')
            console.log(isUninitialized)
            content = <Outlet />
        }
    }

    return content
}
export default PersistLogin


