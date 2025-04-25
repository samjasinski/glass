import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Section } from "@radix-ui/themes";

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
        <Section>
            <div className="flex justify-center pl-5 pr-5">
        <Box width="500px">
            <form onSubmit={handleSubmit} className="bg-white border-l border-r border-b border-gray-300 rounded-b px-8 pt-6 pb-8 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Login
                </label>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" className="w-full p-2 border mb-2" />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" className="w-full p-2 border mb-4" />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
            </form>
                </Box>
            </div>
        </Section>

    );
};

export default Login;