"use client";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  GoogleMap,
  Marker,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface PlacesAutocompleteProps {
  lat: number;
  lng: number;
  location: string;
  onLatLngChange: (lat: number, lng: number, location: string) => void;
}

const PlacesAutocomplete = ({
  lat,
  lng,
  location,
  onLatLngChange,
}: PlacesAutocompleteProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onLatLngChange(lat, lng, results[0].formatted_address);
    } catch (error) {
      console.error("Error fetching geocode:", error);
    }
  };

  // console.log(setValue);

  return isLoaded ? (
    <Command>
      <CommandInput
        value={value}
        onValueChange={setValue}
        disabled={!ready}
        placeholder="Search an address"
        className="combobox-input"
      />
      <CommandList>
        {status === "OK" &&
          data.map(({ place_id, description }) => (
            <CommandItem
              key={place_id}
              onSelect={() => handleSelect(description)}
            >
              {description}
            </CommandItem>
          ))}
      </CommandList>
    </Command>
  ) : (
    <div>Loading...</div>
  );
};

export default PlacesAutocomplete;
