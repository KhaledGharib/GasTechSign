"use client";
import { useAuth, useUser } from "@clerk/nextjs";
// import { useUser } from "@auth0/nextjs-auth0/client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface DisplayProps {
  id?: string;
  displayId?: string;
  Gasoline91?: string;
  Gasoline95?: string;
  Diesel?: string;
  userId?: string;
  isActive?: boolean;
  location?: string;
  displayName?: string;
  lat?: any;
  lng?: any;
  createdAt?: any;
}

// Define an interface for the fuel prices data
export interface FuelPricesData {
  price: string;
  fuelName: string;
}
interface StateContextProps {
  displayCount: number | null;
  activeCount: number | null;
  inactiveCount: number | null;
  displays: DisplayProps[] | null;
  setDisplays: React.Dispatch<React.SetStateAction<DisplayProps[] | null>>;
  setRetailFuels: React.Dispatch<React.SetStateAction<FuelPricesData[] | null>>;
  retailFuels: FuelPricesData[] | null;
}

const StateContext = createContext<StateContextProps>({
  retailFuels: null,
  setRetailFuels: () => {},
  displayCount: null,
  activeCount: null,
  inactiveCount: null,
  displays: null,
  setDisplays: () => {},
});

export const ContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [displayCount, setDisplayCount] = useState<number | null>(null);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [inactiveCount, setInactiveCount] = useState<number | null>(null);
  const [displays, setDisplays] = useState<DisplayProps[] | null>(null);
  const [retailFuels, setRetailFuels] = useState<FuelPricesData[] | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        const userId = user.id;
        try {
          const res = await fetch("/api/count", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          const data = await res.json();
          const displayLength = data.length;
          setDisplayCount(displayLength);
          const activeCount = data.filter(
            (display: DisplayProps) => display.isActive
          ).length;
          setActiveCount(activeCount);

          const inactiveCount = displayLength - activeCount;
          setInactiveCount(inactiveCount);
          setDisplays(data);
          // console.log(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    const fetchRetailFuels = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:8000/fetch", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setRetailFuels(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRetailFuels();
    fetchData().catch(console.error);
  }, [getToken, user]);

  return (
    <StateContext.Provider
      value={{
        setRetailFuels,
        retailFuels,
        displayCount,
        activeCount,
        displays,
        inactiveCount,
        setDisplays,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
