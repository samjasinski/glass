import { Box, Card, Text } from "@radix-ui/themes";

// a cut-down version of the Location interface
interface LocationItemProps {
    id: number;
    name: string;
    region: string;
    state: string;
    lat: number;
    lng: number;
}

const LocationItem = (props: LocationItemProps) => {
    return (
        // wanted to store each card with the locaiton ID, it forced me to use a string
        <Card variant="surface" id={props.id.toString()} className="transition-all duration-200 hover:bg-gray-200 active:bg-indigo-200 hover:shadow-md cursor-pointer">
            <Box>
                <Text as="div" size="2" weight="bold">
                    {props.name}
                </Text>
                <Text as="div" color="gray" size="2">
                    {props.region}
                </Text>
                <Text as="div" color="gray" size="2">
                    lattitude: {props.lat}
                </Text>
                <Text as="div" color="gray" size="2">
                    longitude: {props.lng}
                </Text>
            </Box>

            {/*a new box here which will take up a square section to the right of the card and contain a bunmber from 1 - 10*/}

        </Card>
    );
};

export default LocationItem;
