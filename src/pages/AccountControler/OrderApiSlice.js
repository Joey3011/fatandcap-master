import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const orderAdapter = createEntityAdapter({})

const initialState = orderAdapter.getInitialState()

const customerOrderAdapter = createEntityAdapter({})

const orderInitialState = customerOrderAdapter.getInitialState()

export const OrderApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrder: builder.query({
            query: () => ({
                url: `/api/auth/getorder`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedOrder = responseData.map(order => {
                    order.id = order._id
                    return order
                });
                return orderAdapter.setAll(initialState, loadedOrder)
            },
            providesTags: (result, error, arg) => {
               
                if (result?.ids) {
                    return [
                        { type: 'orderInfo', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'orderInfo', id }))
                    ]
                } else return [{ type: 'orderInfo', id: 'LIST' }]
            }
        }),
        getCustomerOrderBySellerID: builder.query({
                query: (id) => ({
                    url: `/api/auth/getorderbyseller/${id}`,
                    method: 'GET',
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }),
                    // Pick out data and prevent nested properties in a hook or selector
                transformResponse: responseData => {
                    const sellerProductLoader = responseData.map(order => {
                        order.id = order._id
                        return order
                    } );
                    return customerOrderAdapter.setAll(orderInitialState, sellerProductLoader)
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

        addOrder: builder.mutation({
            query: initialUserData => ({
                url: '/api/auth/addOrder',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: [
                { type: 'orderInfo', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetOrderQuery,
    useGetCustomerOrderBySellerIDQuery,
    useAddOrderMutation
} = OrderApiSlice

// returns the query result object
export const selectOrderResult = OrderApiSlice.endpoints.getOrder.select()

// creates memoized selector
const selectOrderData = createSelector(
    selectOrderResult,
    selectOrderData => selectOrderData.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllOrder,
    selectById: selectOrderById,
    selectIds: selectOrderIds
    // Pass in a selector that returns the users slice of state
} = orderAdapter.getSelectors(state => selectOrderData(state) ?? initialState)


