import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice"

const orderToSellerAdapter = createEntityAdapter({})

const orderInitialState = orderToSellerAdapter.getInitialState()

export const customerOrderApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCustomerOrder: builder.query({
                query: (id) => ({
                    url: `/api/auth/getorderbycustomer/${id}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }),
                    // Pick out data and prevent nested properties in a hook or selector
                transformResponse: responseData => {
                    const customerOrderLoader = responseData.map(order => {
                        order.id = order._id
                        return order
                    } );
                    return orderToSellerAdapter.setAll(orderInitialState, customerOrderLoader)
                },
                transformErrorResponse: (response, meta, arg) => response.status,

                providesTags: (result, error, arg) => {
               
                    if (result?.ids) {
                        return [
                            { type: 'orderInfo', id: 'LIST' },
                            ...result.ids.map(id => ({ type: 'orderInfo', id }))
                        ]
                    } else return [{ type: 'orderInfo', id: 'LIST' }]
                }
       
        }),  
        updateOrderStatus: builder.mutation({
            query: credentials => ({
                url: '/api/auth/updateorderstatus',
                method: 'PATCH',
                body: { ...credentials }
            })
        }),      
    }),
})

export const {
    useGetCustomerOrderQuery,
    useUpdateOrderStatusMutation
} = customerOrderApiSlice

// returns the query result object
export const selectSellerOrderResult = customerOrderApiSlice.endpoints.getCustomerOrder.select()

// creates memoized selector
const selectOrderData = createSelector(
    selectSellerOrderResult,
    selectOrderResult => selectOrderResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllOrder,
    selectById: selectOrderById,
    selectIds: selectOrderIds
    // Pass in a selector that returns the users slice of state
} = orderToSellerAdapter.getSelectors(state => selectOrderData(state) ?? orderInitialState)

