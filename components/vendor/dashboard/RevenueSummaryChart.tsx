"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueSummaryChart = () => {
  const chartState = {
    series: [
      {
        name: "Revenue",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      //   {
      //     name: "Ticket sales",
      //     data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      //   },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },

      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 3,
        clipMarkers: false,
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "NGN " + val;
          },
        },
      },
    } as ApexOptions,
  };

  return (
    <div className="bg-white border border-gray-100/80 rounded-lg shadow-xs p-4">
      <h1 className="text-primary text-[13px] font-semibold">
        Revenue Summary
      </h1>
      <ReactApexChart
        options={chartState.options}
        series={chartState.series}
        type="bar"
        height={256}
      />
    </div>
  );
};

export default RevenueSummaryChart;