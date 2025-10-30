// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./posts";
import { authReducer } from "./auth";
import userReducer from "./getme";

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        user: userReducer,
    }
});

export default store;