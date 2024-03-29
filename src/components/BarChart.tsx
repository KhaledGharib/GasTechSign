import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { UserData } from "./UserData";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: true,
      },
    },
  },
  animation: {
    duration: 1500,
  },
};

const labels = UserData.map((data) => data.description);

export const data = {
  labels,
  datasets: [
    {
      label: UserData[0].quote,
      data: UserData.map((data) => data.figure),
      backgroundColor: "#1F2937",
      borderRadius: 10,
    },
  ],
};

export function BarChart() {
  return <Bar options={options} data={data} />;
}
