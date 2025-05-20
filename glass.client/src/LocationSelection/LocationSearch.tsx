import React, { useState } from "react";
import axios from "axios";
import { Location } from "../Types/Location";

interface LocationSearchProps {
    searchType: "coordinates" | "name";
    locationData: Location[]; // Array of Location objects
    setLocationData: React.Dispatch<React.SetStateAction<Location[]>>; // useState setter function
}

const LocationSearch = ({
    searchType,
    setLocationData,
}: LocationSearchProps) => {
    const [lat, setLat] = useState<string>(""); // Keep the input value as a string
    const [lon, setLon] = useState<string>(""); // Keep the input value as a string
    const [locationName, setLocationName] = useState<string>("");
    // const [locationData, setLocationData] = useState<any>(null);
    const [error, setError] = useState<string>("");

    // Regex to allow only numbers, a negative sign, and a single decimal point
    // JavaScript has built-in support for regex literals, so there is no need to enclose them in a string. the enclosing /'s around the characters defines them as a regex literal
    const validInputRegex = /^[+-]?\d*\.?\d*$/;

    const handleLatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Check if the input matches the valid input regex
        if (validInputRegex.test(value) || value === "") {
            setLat(value);
        }
    };

    const handleLonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Check if the input matches the valid input regex
        if (validInputRegex.test(value) || value === "") {
            setLon(value);
        }
    };

    const handleSetLocationName = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        if (value) {
            setLocationName(value);
            console.log(locationName);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(""); // Reset error state

        if (searchType == "coordinates") {
            // Parse lat and lon to float when submitting
            const parsedLat = parseFloat(lat);
            const parsedLon = parseFloat(lon);

            if (isNaN(parsedLat) || isNaN(parsedLon)) {
                setError("Please enter valid latitude and longitude values.");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:5253/api/WillyWeather/location/coordinates?lat=${parsedLat}&lon=${parsedLon}`
                );
                // ts wasn't stopping me for setting something which did not match a Location
                // so i have force extracted the "location" object from the API res and wrapped it in []
                setLocationData([response.data.location]); // Set the response data
            } catch (err) {
                console.error("Error fetching data from backend", err);
                setError("Failed to fetch data from backend.");
            }
        } else if (searchType == "name") {
            // check to see if a valid string was entered
            if (!locationName) {
                setError("Please enter valid location name");
                return;
            }

            // if a valid string was entered, attempt to pull the data from Willy Weather for this location by hitting hte /location/name route in our server
            try {
                const response = await axios.get(
                    `http://localhost:5253/api/WillyWeather/location/name?locationname=${locationName}`
                );
                setLocationData(response.data); // Set the response data
            } catch (err) {
                console.error("Error fetching data from backend", err);
                setError("Failed to fetch data from backend.");
            }
        }
    };

    return searchType == "coordinates" ? (
        <div>
            <form onSubmit={handleSubmit} className="bg-white border-l border-r border-b border-gray-300 rounded-b px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Latitude
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" // Keep it as "text" to handle negative numbers and decimals
                        value={lat}
                        onChange={handleLatChange} // Validate on input change
                        placeholder="Enter latitude (e.g., -33.8688)"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Longitude
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" // Keep it as "text" to handle negative numbers and decimals
                        value={lon}
                        onChange={handleLonChange} // Validate on input change
                        placeholder="Enter longitude (e.g., 151.2093)"
                        required
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button className="bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Search</button>
                </div>

            </form>

            {error && <div style={{ color: "red" }}>{error}</div>}


        </div>
    ) : (
        <div>
                <form onSubmit={handleSubmit} className="bg-white border-l border-r border-b border-gray-300 rounded-b px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Location Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={locationName}
                        onChange={handleSetLocationName}
                        placeholder="Enter the name of the dive location"
                        required
                    />
                    </div>

                    <div className="flex items-center justify-center">
                        <button className="bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Search</button>
                    </div>

            </form>

            {error && <div style={{ color: "red" }}>{error}</div>}

        </div>
    );
};

export default LocationSearch;