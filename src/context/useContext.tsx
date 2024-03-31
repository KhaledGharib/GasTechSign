"use client";
import { useUser } from "@clerk/nextjs";
// import { useUser } from "@auth0/nextjs-auth0/client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface DisplayProps {
  id: string;
  ipAddress: string;
  fuel91: number;
  fuel95: number;
  fuelDI: number;
  ownerId: string;
  isActive: boolean;
  location: string;
  displayName: string;
  lat: number;
  lng: number;
  createdAt: any;
}

interface StateContextProps {
  displayCount: number | null;
  activeCount: number | null;
  inactiveCount: number | null;
  displays: DisplayProps[] | null;
  setDisplays: React.Dispatch<React.SetStateAction<DisplayProps[] | null>>;
}

const StateContext = createContext<StateContextProps>({
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

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        const ownerId = user.id;
        try {
          const res = await fetch("/api/count", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ownerId }),
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
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData().catch(console.error);
  }, [user]);

  return (
    <StateContext.Provider
      value={{
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
