import { atom } from "recoil";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

export const authState = atom({
    key: "authState",
    default: {
        isAuthenticated: !!storedToken, // If token exists, user is authenticated
        user: storedUser || null
    }
});
