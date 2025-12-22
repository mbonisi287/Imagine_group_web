/* eslint-disable react/prop-types */
import { ResponsiveBar } from "@nivo/bar";
import { mockBarData as data } from "../data/mockData";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { API_URL } from '/src/global';
import { useEffect, useState } from "react";
import axios from "axios";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [ barData, setBarData ] = useState([]);
   useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL + "AllTenderProjects");
        const data = res.data;

  
        const departmentMap = {};

        const DEPARTMENT_LOOKUP = {
              1: "Imagine Eco Build",
              2: "Imagine Real Estate",
              3: "QMC",
            };

         Object.values(DEPARTMENT_LOOKUP).forEach((dept) => {
          departmentMap[dept] = { department: dept };
        });

        data.forEach((item) => {
            const departmentName = DEPARTMENT_LOOKUP[item.department];
            if (!departmentName) return;

          const statusKey =
            item.status === 1 ? "In Review"
            : item.status === 2 ? "Awaiting Approval"
            : item.status === 3 ? "Submitted"
            : "In Progress";


            departmentMap[departmentName][statusKey] =
                  (departmentMap[departmentName][statusKey] || 0) + 1;
      });

      setBarData(Object.values(departmentMap));
      } catch (error) {
        console.error("Failed to fetch query data:", error);
      }
    };

    fetchData();
  }, []);

const keys =
  barData.length > 0
    ? Object.keys(barData[0]).filter((k) => k !== "department")
    : [];

  return (   
    <ResponsiveBar
      data={barData}
      theme={{
        labels: {
              text: {
                fontSize: 14,   // ⬅ Increase size here (try 12–16)
                fontWeight: 600,
                fill: "#ffffff",
              },
        },
        axis: {
          domain: {
            line: {
              stroke: colors.gray[100],
            },
          },
          legend: {
            text: {
              fill: colors.gray[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.gray[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.gray[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.gray[100],
          },
        },
      }}
      keys={keys}
      indexBy="department"
      margin={{ top: 50, right: 150, bottom: 50, left: 60 }}
      padding={0.3}
      
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 10,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Department",
        //legend: isDashboard ? undefined : "country",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number of Projects",
        //legend: isDashboard ? undefined : "food",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={true}
      labelSkipWidth={16}
      labelSkipHeight={16}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;
