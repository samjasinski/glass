import { Link } from "react-router-dom";
import React from "react";


const Header: React.FC = () => {
    return (
        <header className="bg-gray-400 text-white py-4">
            <div className="container mx-auto flex justify-center items-center">
                <Link to="/" className="text-3xl font-bold">
                    glass.
                </Link>
            </div>
        </header>
    );
};

export default Header;