import { useState } from "react";
import axios from "axios";
import { User } from "../Types/User";

const Register = () => {
    const [formData, setFormData] = useState<User>({ username: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/auth/register", formData);
            setMessage(response.data);
        } catch (err: any) {
            setMessage(err.response?.data || "Something went wrong");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Register
                </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
        </div>
    );
};

export default Register;