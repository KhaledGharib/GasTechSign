import { DisplayProps } from "@/context/useContext";
import {
  faCircleStop,
  faGasPump,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapPinIcon } from "@heroicons/react/24/solid";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.375rem",
};

const center = {
  lat: 24.6732514,
  lng: 46.622941,
};
const mapOptions = {
  center: center,
  zoom: 5,
  streetViewControl: false,
};
interface MapProps {
  pins: DisplayProps[];
}

const MapComponent: React.FC<MapProps> = ({ pins }) => {
  const { isLoaded } = useJsApiLoader({
    libraries: ["places"],
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [map, setMap] = useState(null);

  const onLoad = (mapInstance: any) => {
    setMap(mapInstance);
  };
  const [selectedPin, setSelectedPin] = useState<DisplayProps | null>(null);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} options={mapOptions}>
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={{ lat: pin.lat, lng: pin.lng }}
          onClick={() => setSelectedPin(pin)}
        >
          {selectedPin === pin && (
            <InfoWindow onCloseClick={() => setSelectedPin(null)}>
              <div className="text-black flex flex-col justify-start ">
                <p className="flex  gap-1 items-center">
                  <MapPinIcon className="w-5 h-5" />
                  {pin.location}
                </p>
                <div className="flex justify-center gap-1 items-center">
                  <FontAwesomeIcon icon={faGasPump} className="w-5 h-5" />
                  <p>{pin.displayName}</p>
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;
