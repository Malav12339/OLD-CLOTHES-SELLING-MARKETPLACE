import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authState } from "../store/atoms";
import "./styles/Signup.css"; // Reusing Signup styles

export default function Login() {
    const emailRef = useRef();
    const passRef = useRef();
    const isAdminRef = useRef()
    const setAuth = useSetRecoilState(authState);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passRef.current.value;
        const isAdmin = isAdminRef.current.checked

        if (password.length < 5) {
            alert("Password must be at least 5 characters long");
            return;
        }

        try {
            let response = null 
            if(isAdmin) {
                response = await fetch("http://localhost:5000/auth/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, role: "admin" }),
                });
            } else {
                response = await fetch("http://localhost:5000/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
            }
            

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", result.user)
                alert(result.message || "Login successful!");
                setAuth({ isAuthenticated: true, user: result.user });
                navigate("/");
            } else {
                alert(result.message || "Login failed!");
            }
        } catch (error) {
            alert("Error logging in. Please try again.");
            console.error("Login error:", error);
        }
    }

    return (
        <div className="signup-container"> {/* Using the same class */}
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input ref={emailRef} placeholder="Email" type="email" required />
                <input ref={passRef} placeholder="Password" type="password" required />
                <div className="checkbox-container">
                    <input ref={isAdminRef} type="checkbox" id="adminCheckbox" />
                    <label htmlFor="adminCheckbox">Admin</label>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
