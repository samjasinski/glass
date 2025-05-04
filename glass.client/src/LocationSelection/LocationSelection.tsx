import LocationSearch from "./LocationSearch";
import SearchOptionsToggle from "./SearchOptionsToggle";
import React, { useState } from "react";
import { SearchType } from "../Types/SearchType";
import { Location } from "../Interface";
import LocationGrid from "../LocationDisplay/LocationGrid";
import LocationItem from "./LocationItem";
import { Box } from "@radix-ui/themes";

const LocationSelection: React.FC<{
    onSelectLocation: (location: Location) => void;
}> = ({ onSelectLocation }) => {
    const [searchType, setSearchType] = useState<SearchType>({ type: "name" });
    const [locationData, setLocationData] = useState<Location[]>([]);

    const handleSetSearchType = (searchType: SearchType) => {
        setLocationData([]);
        setSearchType(searchType);
    };

    return (
        <div className="flex justify-center pl-5 pr-5">
            <Box width="500px">
                    <SearchOptionsToggle handleSetSearchType={handleSetSearchType} />
                    <LocationSearch
                        searchType={searchType.type}
                        locationData={locationData}
                        setLocationData={setLocationData}
                    />
                    <LocationGrid>
                        {locationData.length !== 0 &&
                            locationData.map((location) => (
                                <div
                                    key={location.id}
                                    onClick={() => onSelectLocation(location)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <LocationItem
                                        id={location.id}
                                        name={location.name}
                                        region={location.region}
                                        state={location.state}
                                        lat={location.lat}
                                        lng={location.lng}
                                    />
                                </div>
                            ))}
                    </LocationGrid>
            </Box>
        </div>
    );
};

export default LocationSelection;
