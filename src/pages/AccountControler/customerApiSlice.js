import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const customerAdapter = createEntityAdapter({})

const initialState = customerAdapter.getInitialState()

export const customerApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCustomer: builder.query({
            query: () => ({
                url: '/api/auth/getcustomer',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedCustomer = responseData.map(customer => {
                    customer.id = customer._id
                    return customer
                });
                return customerAdapter.setAll(initialState, loadedCustomer)
            },
            providesTags: (result, error, arg) => {
               
                if (result?.ids) {
                    return [
                        { type: 'customerInfo', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'customerInfo', id }))
                    ]
                } else return [{ type: 'customerInfo', id: 'LIST' }]
            }
        }),

        userUpdatePassword: builder.mutation({
            query: credentials => ({
                url: '/api/auth/updatepassword',
                method: 'PATCH',
                body: { ...credentials }
            })
        }),
        addAddress: builder.mutation({
            query: credentials => ({
                url: '/api/auth/addaddress',
                method: 'PATCH',
                body: { ...credentials }
            })
        }),
    }),
})

export const {
    useGetCustomerQuery,
    useUserUpdatePasswordMutation,
    useAddAddressMutation
} = customerApiSlice

// returns the query result object
export const selectUsersResult = customerApiSlice.endpoints.getCustomer.select()

// creates memoized selector
const selectCustomerData = createSelector(
    selectUsersResult,
    customerResult => customerResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCustomer,
    selectById: selectCustomerById,
    selectIds: selectCustomerIds
    // Pass in a selector that returns the users slice of state
} = customerAdapter.getSelectors(state => selectCustomerData(state) ?? initialState)