import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    name: "",
    email: "",
    image: "",
    token:""
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginRedux: ((state, action) => {
            state._id = action.payload._id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.image = action.payload.image;
            state.token = action.payload.token;
        }),
        logoutRedux: ((state, action) => {
            state._id = "";
            state.name = "";
            state.email = "";
            state.image = "";
            state.token = "";
        })
    }
});

export const { loginRedux,logoutRedux } = userSlice.actions;

export default userSlice.reducer;

