import { useTheme } from '@mui/system';
import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';

const DoughnutChart = ({ height, color = [] }) => {
  const theme = useTheme();

  const [switchUsageData, setSwitchUsageData] = useState([]);

  useEffect(() => {
    // Make an HTTP GET request to fetch switch usage data
    fetch('http://localhost:5500/api/switch-usage')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Switch Usage Data:', data);
        // Sort the data by usage count in descending order
        const sortedData = data.sort((a, b) => b.usage_count - a.usage_count);
        // Select the top five switches
        const topFiveSwitches = sortedData.slice(0, 5);
        // Add an "inactive" property to switches not in the top five
        const switchDataWithInactive = data.map((switchData) => ({
          ...switchData,
          inactive: !topFiveSwitches.some((topSwitch) => topSwitch.switch_id === switchData.switch_id),
        }));
        setSwitchUsageData(switchDataWithInactive);
      })
      .catch((error) => {
        console.error('Error fetching switch usage data:', error);
      });
  }, []); // Empty dependency array to run this effect once when the component mounts

  // Calculate the total usage count for all switches
  const totalUsageCount = switchUsageData.reduce((total, switchData) => total + switchData.usage_count, 0);

  // Calculate the percentage for each switch
  const switchDataWithPercentage = switchUsageData.map((switchData) => ({
    name: `Switch ${switchData.switch_id}`,
    value: ((switchData.usage_count / totalUsageCount) * 100).toFixed(2), // Calculate percentage and round to 2 decimal places
    itemStyle: {
      color: switchData.inactive ? 'gray' : '', // Deactivate switches not in the top five
      borderColor: switchData.inactive ? 'transparent' : '', // Make black parts transparent
      borderWidth: switchData.inactive ? 0 : 1, // Set border width for black parts
      z: switchData.inactive ? -1 : 1, // Set the rendering order; lower values render below
    },
  }));

  const option = {
    legend: {
      show: false, // Hide the legend
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: (params) => {
        const switchName = params.name;
        const switchValue = params.value;
        return `${switchName}: ${switchValue}%`;
      },
    },
    xAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],
    yAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],

    series: [
      {
        name: 'Switch Usage',
        type: 'pie',
        radius: ['45%', '72.55%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        hoverOffset: 5,
        stillShowZeroSum: false,
        label: {
          normal: {
            show: false,
            position: 'center',
            textStyle: {
              color: theme.palette.text.secondary,
              fontSize: 13,
              fontFamily: 'roboto',
            },
            formatter: '{a}',
          },
          emphasis: {
            show: true,
            textStyle: { fontSize: '14', fontWeight: 'normal' },
            formatter: '{b} \n{c} ({d}%)',
          },
        },
        labelLine: { normal: { show: false } },
        data: switchDataWithPercentage, // Use the data with percentages and deactivated switches
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
      },
    ],
  };

  return (
    <ReactEcharts
      style={{ height: height }}
      option={{ ...option, color: [...color] }}
      onEvents={{
        // Listen for the chart hover event and update the state
        mouseover: () => {},
        // Listen for the chart mouseout event and update the state
        mouseout: () => {},
      }}
    />
  );
};

export default DoughnutChart;
