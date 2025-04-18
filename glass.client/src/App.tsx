import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Heading, Section, Text } from "@radix-ui/themes";

import LocationSelection from "./LocationSelection/LocationSelection";
import LocationDisplay from "./LocationDisplay/LocationDisplay";
import Header from "./Header/Header";
import { Location } from "./Interface";
import Navbar from "./Navbar/NavBar";


function LocationPage() {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    return (
        <Section size="1">
            {selectedLocation ? (
                <LocationDisplay
                    location={selectedLocation}
                    onBack={() => setSelectedLocation(null)}
                />
            ) : (
                <LocationSelection onSelectLocation={setSelectedLocation} />
            )}
        </Section>
    );
}


function DashboardPage() {
    return (
        <Section size="1">
            <Heading>DASH</Heading>
            <Text>coming soon...</Text>
        </Section>
    );
}

function AlertsPage() {
    return (
        <Section size="1">
            <Heading>ALERTS</Heading>
            <Text>coming soon...</Text>
        </Section>
    );
}

function App() {
    return (
        <>
            <Header />
                <Navbar />
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dash" element={<DashboardPage />} />
                <Route path="/location-search" element={<LocationPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
            </Routes>
            
        </>
    );
}

export default App;

