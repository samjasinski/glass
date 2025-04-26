import { Heading, Text } from "@radix-ui/themes";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "../Types/TokenPayload";


const Dash: React.FC = () => {
    const token = localStorage.getItem("authToken");
    const decoded_token = token ? jwtDecode<TokenPayload>(token) : null;

    const username = decoded_token?.unique_name;
    console.log(username);

    return (
        <>
            <Heading>DASH</Heading>
            <Heading as="h2">Welcome, {username}</Heading>
            <Text>coming soon...</Text>
        </>
    );
};

export default Dash;