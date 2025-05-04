import React from "react";
import { Card, Heading, Box, Text } from "@radix-ui/themes";
import { Location } from "../Types/Location";
import { PlusIcon, ResetIcon } from '@radix-ui/react-icons';
import LocationMap from "./LocationMap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const LocationDisplay: React.FC<{ location: Location; onBack: () => void }> = ({
    location,
    onBack,
}) => {

    const navigate = useNavigate();

    const handleAdd = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            console.error("No auth token found.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5253/api/mongodb/addLocation",
                JSON.stringify(location.id.toString()), 
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Location Added!',
                    text: 'redirecting to your dashboard...',
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });

                setTimeout(() => {
                    navigate("/dash");
                }, 3000);
            }
        } catch (error: any) {
            const msg = error?.response?.data || "Something went wrong.";
            Swal.fire({
                icon: 'error',
                title: 'Adding the location has failed.',
                text: msg,
            });
        }
    };

    return (
        <div className="flex-col items-center mx-10">

            <Card variant="surface" className="transition-all duration-200 w-full max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-5">
                    {/* Left side: Info */}
                    <Box className="p-5 w-full md:w-1/2 flex flex-col items-center justify-center">
                        <Box className="p-10">
                        <Box className="mb-5">
                            <Heading as="h1" size="4">
                                {location.name}
                            </Heading>
                        </Box>
                        <Box className="text-left">
                            <Text className="block"><strong>Region:</strong> {location.region}</Text>
                            <Text className="block"><strong>State:</strong> {location.state}</Text>
                            <Text className="block"><strong>Latitude:</strong> {location.lat}</Text>
                            <Text className="block"><strong>Longitude:</strong> {location.lng}</Text>
                            </Box>
                        </Box>
                    </Box>

                    <Box className="p-5 w-full md:w-1/2">
                        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-500 rounded overflow-hidden">
                            <LocationMap lat={location.lat} long={location.lng} />
                        </div>
                    </Box>
                </div>
            </Card>

            <div className="flex items-center justify-center mt-5">
                <button
                    onClick={handleAdd}
                    className="mr-5 bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    <PlusIcon className="block sm:hidden w-6 h-6" />
                    <span className="hidden sm:inline">Add</span>
                </button>
                <button
                    onClick={onBack}
                    className="bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    <ResetIcon className="block sm:hidden w-6 h-6" />
                    <span className="hidden sm:inline">Back</span>
                </button>
               
            </div>

        </div>
    );
};

export default LocationDisplay;
