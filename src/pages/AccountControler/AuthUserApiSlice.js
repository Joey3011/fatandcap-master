import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const sellerProductAdapter = createEntityAdapter({})

const initialState = sellerProductAdapter.getInitialState()

export const AuthSellerApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSellerProduct: builder.query({
            query: (id) => ({
                url: `/api/auth/getsellerproduct/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedCustomer = responseData.map(product => {
                    product.id = product._id
                    return product
                });
                return sellerProductAdapter.setAll(initialState, loadedCustomer)
            },
            providesTags: (result, error, arg) => {
               
                if (result?.ids) {
                    return [
                        { type: 'itemInfo', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'itemInfo', id }))
                    ]
                } else return [{ type: 'itemInfo', id: 'LIST' }]
            }
        }),

        deleteProduct: builder.mutation({
            query: credentials => ({
                url: '/api/auth/deleteproduct',
                method: 'Delete',
                body: { ...credentials }
            })
        }),
    }),
})

export const {
    useGetSellerProductQuery,
    useDeleteProductMutation
} = AuthSellerApiSlice

// returns the query result object
export const selectUsersResult = AuthSellerApiSlice.endpoints.getSellerProduct.select()

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
} = sellerProductAdapter.getSelectors(state => selectCustomerData(state) ?? initialState)