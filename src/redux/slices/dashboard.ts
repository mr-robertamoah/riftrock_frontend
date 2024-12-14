import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        value: {
            contacts: [],
            details: [],
            services: [],
            users: [],
            emails: [],
        }
    },
    reducers: {
        addService(state, data) {
            const service = state.value.services.find((service) => service.id == data.payload.id)

            if (service) return

            state.value.services.unshift(data.payload)
        },
        addServices(state, data) {
            state.value.services = [...state.value.services, ...data.payload]
        },
        updateService(state, data) {
            state.value.services.splice(
                state.value.services.findIndex(service => service.id == data.payload.id),
                1,
                data.payload
            )
        },
        deleteService(state, data) {
            state.value.services.splice(
                state.value.services.findIndex(service => service.id == data.payload.id),
                1,
            )
        },
        addUser(state, data) {
            const user = state.value.users.find((user) => user.id == data.payload.id)

            if (user) return

            state.value.users.unshift(data.payload)
        },
        addUsers(state, data) {
            state.value.users = [...state.value.users, ...data.payload]
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
        addContacts(state, data) {
            state.value.contacts = [...state.value.contacts, ...data.payload]
        },
        updateContact(state, data) {
            state.value.contacts.splice(
                state.value.contacts.findIndex(contact => contact.id == data.payload.id),
                1,
                data.payload
            )
        },
        deleteContact(state, data) {
            state.value.contacts.splice(
                state.value.contacts.findIndex(contact => contact.id == data.payload.id),
                1,
            )
        },
        addDetails(state, data) {
            state.value.details = [...data.payload]
        },
        updateDetail(state, data) {
            state.value.details.splice(
                state.value.details.findIndex(detail => detail.id == data.payload.id),
                1,
                data.payload
            )
        },
        addEmails(state, data) {
            state.value.emails = [...state.value.emails, ...data.payload]
        },
        updateEmail(state, data) {
            state.value.emails.splice(
                state.value.emails.findIndex(email => email.id == data.payload.id),
                1,
                data.payload
            )
        },
    }
})

export const {
    addService,
    addServices,
    addUser,
    addUsers,
    updateUser,
    deleteUser,
    addContacts,
    updateContact,
    deleteContact,
    addDetails,
    updateDetail,
    updateService,
    deleteService,
    addEmails,
    updateEmail,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;