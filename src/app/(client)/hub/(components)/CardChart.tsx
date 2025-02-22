import React from "react";
import { Chart } from "primereact/chart";
import { colourVars } from "../(variables)/colourVars";

interface CircularProgressProps {
  current: number;
  target: number;
}

const CircularProgress = ({ current, target }: CircularProgressProps) => {
  const percentage = Math.min((Number(current) / Number(target)) * 100, 100);

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [colourVars.hubBlue, colourVars.hubGrey],
        hoverBackgroundColor: ["#4CAF50", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      tooltip: { enabled: false },
    },
    animations: false,
  };

  return (
    <div className="w-48 h-48 relative">
      <Chart type="doughnut" data={data} options={options} />
      <div className="absolute inset-0 top-2 flex items-center justify-center">
        <h1 className="text-2xl">{Math.round(percentage)}%</h1>
      </div>
    </div>
  );
};

export default CircularProgress;
