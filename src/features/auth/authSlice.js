import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'api/auth',
    initialState: { 
        fat_w_acc: null,
        token: null,
        cart: [],
     },
    reducers: {
        setPublicCredentials: (state, action) => {
            const { fat_w_acc } = action.payload
            state.fat_w_acc = fat_w_acc
        },
        setCredentials: (state, action) => {
            const { accessToken } = action.payload
            state.token = accessToken
        },
        logOut: (state, action) => {
            state.token = null
        },
        addToCart: (state, action) => {
            const itemInCart = state.cart.find((item) => item.id === action.payload.id);
            if (itemInCart) {
                itemInCart.quantity++;
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
        },
        updateSize: (state, action) => {
            const item = state.cart.find((item) => item.id === action.payload.id);
            if(item){
                 item.size = action.payload.sizes
            }
        },
        updateColor: (state, action) => {
            const item = state.cart.find((item) => item.id === action.payload.id);
            if(item){
                 item.color = action.payload.colors
            }
        },
        updateAddress: (state, action) => {
            const item = state.cart.find((item) => item.id === action.payload.id);
            if(item){
                 item.addr = action.payload.address
            }
        },
        updateFee: (state, action) => {
            const item = state.cart.find((item) => item.id === action.payload.id);
            if(item){
                 item.fee = action.payload.fees
            }
        },
        incrementQuantity: (state, action) => {
            const item = state.cart.find((item) => item.id === action.payload);
                if(item){
                    item.quantity++;
                }
        },
        decrementQuantity: (state, action) => {
            const item = state.cart.find((item) => item.id === action.payload);
                if(item){
                    if (item.quantity === 1) {
                        item.quantity = 1
                    } else {
                        item.quantity--;
                    }
                }
        },
        removeItem: (state, action) => {
            const removeItem = state.cart.filter((item) => item.id !== action.payload);
            if(removeItem){
                state.cart = removeItem;
            }
        },
    },  
})

export const { 
     setPublicCredentials,
     setCredentials,
     logOut,
     addToCart,
     updateSize,
     incrementQuantity,
     decrementQuantity,
     removeItem,
     updateColor,
     updateAddress,
     updateFee,
     } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token

export const selectCurrentCart = (state) =>  state.auth.cart

export const selectPublicToken = (state) => state.auth.fat_w_acc

