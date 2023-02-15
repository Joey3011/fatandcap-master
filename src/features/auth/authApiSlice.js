import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials, setPublicCredentials } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/api/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/api/auth/logout',
                method: 'POST'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/api/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        accessToken: builder.mutation({
            query: () => ({
                url: '/api/auth/access',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    const { fat_w_acc } = data
                    dispatch(setPublicCredentials({ fat_w_acc }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        emailRegister: builder.mutation({
            query: credentials => ({
                url: '/api/auth/emailregistercustomer',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        // smsRegister: builder.mutation({
        //     query: credentials => ({
        //         url: '/api/auth/smsregistercustomer',
        //         method: 'POST',
        //         body: { ...credentials }
        //     })
        // }),

        requestPasswordEmail: builder.mutation({
            query: credentials => ({
                url: '/api/auth/requestpassword',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        resetPassword: builder.mutation({
            query: credentials => ({
                url: '/api/auth/resetpassword',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        requestsmsOTP: builder.mutation({
            query: credentials => ({
                url: '/api/auth/requestsmsOTP',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        verifyCode: builder.mutation({
            query: credentials => ({
                url: '/api/auth/verifysmsOTPLogin',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        //submit request to verify email otp
        verifyEmailOtp: builder.mutation({
            query: credentials => ({
                url: '/api/auth/verifyEmailotp',
                method: 'POST',
                body: { ...credentials }
            })
        }),
     //request email otp
        getEmailOtp: builder.mutation({
            query: credentials => ({
                url: '/api/auth/getEmailotp',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        // create password after email verified
        createUserPasswordEmail: builder.mutation({
            query: credentials => ({
                url: '/api/auth/createPasswordwithEmail',
                method: 'POST',
                body: { ...credentials }
            })
        }),
    })
})

export const {
    useLoginMutation, 
    useSendLogoutMutation,
    useRefreshMutation,
    useAccessTokenMutation,
    useEmailRegisterMutation,
    // useSmsRegisterMutation,
    useRequestPasswordEmailMutation,
    useResetPasswordMutation,
    useRequestsmsOTPMutation,
    useVerifyCodeMutation,
    useVerifyEmailOtpMutation,
    useGetEmailOtpMutation,
    useCreateUserPasswordEmailMutation,
    // useCreateUserPasswordSMSMutation
} = authApiSlice 