import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Heading, Section, Text } from "@radix-ui/themes";
import LocationSelection from "./LocationSelection/LocationSelection";
import LocationDisplay from "./LocationDisplay/LocationDisplay";
import Header from "./Header/Header";
import { Location } from "./Types/Location";
import Navbar from "./Navbar/NavBar";
import RequireAuth from "../src/Auth/RequireAuth";
import Login from "./Login/Login";


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
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
                <Route path="/dash" element={<RequireAuth><DashboardPage /></RequireAuth>} />
                <Route path="/location-search" element={<RequireAuth><LocationPage /></RequireAuth>} />
                <Route path="/alerts" element={<RequireAuth><AlertsPage /></RequireAuth>} />
            </Routes>
        </>
    );
}

export default App;

