import { useState } from "react";
import axios from "axios";
import { User } from "../Types/User";
import { Link, useNavigate } from "react-router-dom";
import { Box, Section } from "@radix-ui/themes";

const Register = () => {
    const [formData, setFormData] = useState<User>({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // if the user successfully registers a JWT token is sent as a response from the server
            const res = await axios.post("http://localhost:5253/api/mongodb/register", formData);
            localStorage.setItem("authToken", res.data.token); 
            navigate("/"); // redirect to dashboard
        } catch (err: any) {
            if (err.response?.status === 400) {
                setMessage(err.response.data);
            }
        }
    };

    return (
        <Section>
            <div className="flex justify-center pl-5 pr-5">
                <Box width="500px">
                    <h2 className="text-xl font-semibold mb-4">Register</h2>
                    <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded px-8 pt-6 pb-8 mb-4 shadow-lg">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                username
                            </label>
                            <input type="text" name="username" onChange={handleChange} placeholder="Username" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            {message && (
                                <label className="block text-red-300 text-sm font-bold mb-2 mt-2">
                                    {message}
                                </label>
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                password
                            </label>
                            <input type="password" name="password" onChange={handleChange} placeholder="Password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Register</button>
                            <Link
                                to="/login"
                                className="bg-indigo-400 hover:bg-indigo-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
                            >
                                Login
                            </Link>
                        </div>
                    </form>
                </Box>
            </div>
        </Section>
    );
};

export default Register;