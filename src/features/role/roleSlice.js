// src/features/role/roleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedRole: null,
};

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.selectedRole = action.payload;
            console.log("Setting role:", action.payload); // Log action payload
        },
        clearRole: (state) => {
            state.selectedRole = null;
        },
    },
});

export const { setRole, clearRole } = roleSlice.actions;
export const roleReducer = roleSlice.reducer;
