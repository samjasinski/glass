import React, { useState } from "react";
import { SearchType } from "../Types/SearchType";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

interface SearchOptionsToggleProps {
    handleSetSearchType: (searchType: SearchType) => void;
}

const SearchOptionsToggle = ({
    handleSetSearchType,
}: SearchOptionsToggleProps) => {
    const [selectedValue, setSelectedValue] = useState<"geo" | "name">("name");

    const handleToggle = (value: string) => {
        if (value === "geo" || value === "name") {
            setSelectedValue(value);
            handleSetSearchType({ type: value });
        }
    };

    return (
            <ToggleGroup.Root
                type="single"
                value={selectedValue}
                onValueChange={handleToggle}
                className="inline-grid grid-cols-2 w-full border border-gray-300 rounded-t-md overflow-hidden"
            >
                <ToggleGroup.Item
                    value="name"
                className="text-center text-sm font-medium px-4 py-2 bg-white text-black data-[state=on]:bg-gray-400 data-[state=on]:text-white transition-colors"
                >
                    Location Name
                </ToggleGroup.Item>

                <ToggleGroup.Item
                    value="geo"
                    className="text-center text-sm font-medium px-4 py-2 bg-white text-black data-[state=on]:bg-gray-400 data-[state=on]:text-white transition-colors border-l border-gray-300"
                >
                    Coordinates
                </ToggleGroup.Item>
            </ToggleGroup.Root>
    );
};

export default SearchOptionsToggle;