import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/auth';
import dashboardReducer from './slices/dashboard';

const store = configureStore({
    reducer: {
        dashboard: dashboardReducer,
        auth: authReducer,
    }
})

export default store;