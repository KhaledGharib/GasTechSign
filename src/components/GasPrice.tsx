import React from "react";

interface GasPriceProps {
  orderID: number;
  label: string;
  responseData: ResponseData[];
}

interface ResponseData {
  id: number;
  orderID: number;
  figure: number;
  description: string;
  quote: string;
  created_at: string;
}

const GasPrice: React.FC<GasPriceProps> = ({
  orderID,
  label,
  responseData,
}) => {
  const gasPriceData = responseData.find((data) => data.orderID === orderID);
  const figure = gasPriceData ? gasPriceData.figure.toFixed(2) : "0.00";

  return (
    <div className="flex">
      <div
        className={`flex justify-center items-center rounded-l-xl ${getGasColor(
          orderID
        )} w-24 h-24 text-white  dark:text-`}
      >
        <span className="text-5xl">{label}</span>
      </div>
      <div className="flex flex-grow bg-gray-800 rounded-r-lg h-24 text-white text-7xl p-5 items-center justify-center font-seven">
        {figure}
      </div>
    </div>
  );
};

const getGasColor = (orderID: number): string => {
  switch (orderID) {
    case 1:
      return "bg-green-600";
    case 2:
      return "bg-red-600";
    case 3:
      return "bg-yellow-500";
    default:
      return "";
  }
};

export default GasPrice;
