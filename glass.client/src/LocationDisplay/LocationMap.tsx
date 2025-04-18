import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface LocationMapProps {
    lat: number;
    long: number;
}

const containerStyle = {
    width: '100%',
    height: '100%',
};

const LocationMap: React.FC<LocationMapProps> = ({ lat, long }) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    });

    const center = {
        lat: lat,
        lng: long,
    };

    if (loadError) {
        return <div>Error loading map</div>;
    }

    if (!isLoaded) {
        return <div>Loading map...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
        >
            <Marker position={center} />
        </GoogleMap>
    );
};

export default React.memo(LocationMap);

