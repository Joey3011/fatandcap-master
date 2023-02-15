import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const customerAdapter = createEntityAdapter({})

const sellerInfoInitialState = customerAdapter.getInitialState()

const productAdapter = createEntityAdapter({})

const initialState = productAdapter.getInitialState()

const sellerProductAdapter = createEntityAdapter({})

const sellerInitialState = sellerProductAdapter.getInitialState()

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProduct: builder.query({
            query: () => ({
                url: '/api/auth/getproduct',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedProduct = responseData.map(product => {
                    product.id = product._id
                    return product
                });
                return productAdapter.setAll(initialState, loadedProduct)
            },
            providesTags: (result, error, arg) => {
               
                if (result?.ids) {
                    return [
                        { type: 'productList', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'productList', id }))
                    ]
                } else return [{ type: 'productList', id: 'LIST' }]
            }
        }),
        getSeller: builder.query({
            query: () => ({
                url: '/api/auth/getseller',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedSeller = responseData.map(seller => {
                    seller.id = seller._id
                    return seller
                });
                return customerAdapter.setAll(sellerInfoInitialState, loadedSeller)
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
        getSellerProduct: builder.query({
            query: (id) => ({ url: `/api/auth/getsellerproduct/${id}` }),
                    // Pick out data and prevent nested properties in a hook or selector
                    transformResponse: responseData => {
                        const sellerLoadedProduct = responseData.map(product => {
                            product.id = product._id
                            console.log(product)
                            return product
                        });
                        return sellerProductAdapter.setAll(sellerInitialState, sellerLoadedProduct)
                    },
                transformErrorResponse: (response, meta, arg) => response.status,
                providesTags: (result, error, arg) => {
               
                    if (result?.ids) {
                        return [
                            { type: 'sellerList', id: 'LIST' },
                            ...result.ids.map(id => ({ type: 'sellerList', id }))
                        ]
                    } else return [{ type: 'sellerList', id: 'LIST' }]
                }
       
        }),
    }),
})

export const {
    useGetProductQuery,
    useGetSellerQuery,
    useGetSellerProductQuery
} = productApiSlice



//get seller info
// returns the query result object
export const selectSellerResult = productApiSlice.endpoints.getSeller.select()


//get product info
// returns the query result object
export const selectProductResult = productApiSlice.endpoints.getProduct.select()


// creates memoized selector
//get seller info
const selectCustomerData = createSelector(
    selectSellerResult,
    sellerResult => sellerResult.data // normalized state object with ids & entities
)

//get product info
// creates memoized selector
const selectProductData = createSelector(
    selectProductResult,
    productResult => productResult.data // normalized state object with ids & entities
)

//get seller info
//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCustomer,
    selectById: selectCustomerById,
    selectIds: selectCustomerIds
    // Pass in a selector that returns the users slice of state
} = customerAdapter.getSelectors(state => selectCustomerData(state) ?? sellerInfoInitialState)


//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllProduct,
    selectById: selectProductById,
    selectIds: selectProductIds
    // Pass in a selector that returns the users slice of state
} = productAdapter.getSelectors(state => selectProductData(state) ?? initialState)
