import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Signup.css"; // Import CSS file

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();
    const isAdminRef = useRef()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passRef.current.value;
        const isAdmin = isAdminRef.current.checked;

        if (password.length < 5) {
            alert("Password must be at least 5 characters long");
            return;
        }
        let response = null 
        try {
            if(isAdmin) {
                response = await fetch("http://localhost:5000/auth/admin/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, role: "admin" })
                })
            } else {
                response = await fetch("http://localhost:5000/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });
            }
            

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Signup successful!");
                navigate("/login");
            } else {
                alert(result.message || "Signup failed!");
            }
        } catch (error) {
            alert("Error signing up. Please try again.");
            console.error("Signup error:", error);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <input ref={nameRef} placeholder="Name" required />
                <input ref={emailRef} type="email" placeholder="Email" required />
                <input ref={passRef} type="password" placeholder="Password" required />

                <div className="checkbox-container">
                    <input ref={isAdminRef} type="checkbox" id="adminCheckbox" />
                    <label htmlFor="adminCheckbox">Admin</label>
                </div>


                <button type="submit">Sign up</button>
            </form>
        </div>
    );
}
