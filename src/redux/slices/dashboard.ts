import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        value: {
            services: [],
            users: [],
        }
    },
    reducers: {
        addService(state, data) {
            const service = state.value.services.find((service) => service.id == data.payload.id)

            if (service) return

            state.value.services.unshift(data.payload)
        },
        addServices(state, data) {
            state.value.services = [...data.payload]
        },
        addUser(state, data) {
            const user = state.value.users.find((user) => user.id == data.payload.id)

            if (user) return

            state.value.users.unshift(data.payload)
        },
        addUsers(state, data) {
            state.value.users = [...data.payload]
        },
        updateUser(state, data) {
            state.value.users.splice(
                state.value.users.findIndex(user => user.id == data.payload.id),
                1,
                data.payload
            )
        },
        deleteUser(state, data) {
            state.value.users.splice(
                state.value.users.findIndex(user => user.id == data.payload.id),
                1,
            )
        },
    }
})

export const { addService, addServices, addUser, addUsers, updateUser, deleteUser } = dashboardSlice.actions;
export default dashboardSlice.reducer;