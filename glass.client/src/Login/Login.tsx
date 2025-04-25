import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5253/api/mongodb/login", formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            localStorage.setItem("authToken", res.data.token); // or whatever you return
            navigate("/"); // redirect to dashboard
        } catch (err) {
            alert("Login failed.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
            <h2 className="text-xl mb-4">Login</h2>
            <input type="text" name="username" onChange={handleChange} placeholder="Username" className="w-full p-2 border mb-2" />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" className="w-full p-2 border mb-4" />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
    );
};

export default Login;