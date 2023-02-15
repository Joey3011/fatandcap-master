import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let isSeller = false
    let isCustomer = false

    if (token) {
        const decoded = jwtDecode(token)
        const { _id, email, roles } = decoded.customerInfo

        isAdmin = roles.includes('admin')
        isSeller = roles.includes('seller')
        isCustomer = roles.includes('customer')

        if (isAdmin){
            return { _id, email, roles, isAdmin }
        }else if (isSeller){
            return { _id, email, roles, isSeller }
        }else if (isCustomer){
            return { _id, email, roles, isCustomer }
        }   
    }

    return { _id: '', email: '', roles: [], isSeller }
}
export default useAuth