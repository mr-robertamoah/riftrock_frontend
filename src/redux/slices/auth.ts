import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        value: null
    },
    reducers: {
        addUser(state, data) {
            state.value = data.payload
        },
        removeUser(state) {
            state.value = null
        }
    }
})

export const { addUser, removeUser } = authSlice.actions
export default authSlice.reducer;