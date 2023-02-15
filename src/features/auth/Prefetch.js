import { store } from '../../app/store'
import { customerApiSlice } from '../../pages/AccountControler/customerApiSlice';
import { AuthSellerApiSlice } from '../../pages/AccountControler/AuthUserApiSlice';
import { OrderApiSlice } from '../../pages/AccountControler/OrderApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        store.dispatch(customerApiSlice.util.prefetch('getCustomer', 'customerList', { force: true }))
        store.dispatch(AuthSellerApiSlice.util.prefetch('getProduct', 'productList', { force: true }))
        store.dispatch(OrderApiSlice.util.prefetch('getOrder', 'orderList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch