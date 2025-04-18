import React from "react";
import { Card, Heading, Box, Text, Flex } from "@radix-ui/themes";
import { Location } from "../Interface";
import { ResetIcon } from '@radix-ui/react-icons';
import LocationMap from "./LocationMap";

const LocationDisplay: React.FC<{ location: Location; onBack: () => void }> = ({
    location,
    onBack,
}) => {
    return (
        <div className="mx-5 flex items-center">
            {/* Button sits to the left with 5px gap */}
            <div className="mr-5">
                <button
                    onClick={onBack}
                    className="bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    <ResetIcon className="w-6 h-6" />
                </button>
            </div>

            <Card variant="surface" className="transition-all duration-200 w-full">
                <Flex direction="row" gap="5">
                    {/* Left side: Info */}
                    <Box className="p-5 w-1/2">
                        <Box className="mb-5">
                            <Heading as="h1" size="4">
                                {location.name}
                            </Heading>
                        </Box>
                        <Text className="block"><strong>Region:</strong> {location.region}</Text>
                        <Text className="block"><strong>State:</strong> {location.state}</Text>
                        <Text className="block"><strong>Latitude:</strong> {location.lat}</Text>
                        <Text className="block"><strong>Longitude:</strong> {location.lng}</Text>
                    </Box>

                    {/* Right side: Map */}
                    <Box className="p-5 w-1/2">
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 rounded">
                            <LocationMap lat={location.lat} long={location.lng} ></LocationMap>
                        </div>
                    </Box>
                </Flex>
            </Card>
        </div>
    );
};

export default LocationDisplay;
