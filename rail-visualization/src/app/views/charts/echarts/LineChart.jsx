import { useTheme } from '@mui/system';
import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';

const LineChart = ({ height, color = [] }) => {
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
        setSwitchUsageData(data);
      })
      .catch((error) => {
        console.error('Error fetching switch usage data:', error);
      });
  }, []); // Empty dependency array to run this effect once when the component mounts

  // Extract switch IDs and usage counts for the bar chart
  const switchIds = switchUsageData.map((switchData) => {
    const parts = switchData.switch_id.split('_'); // Split by underscores
    if (parts.length > 2) {
      // If there are more than 2 parts, return the third part and beyond
      return parts.slice(2).join('_');
    }
    // Otherwise, return the original switch ID
    return switchData.switch_id;
  });
  const usageCounts = switchUsageData.map((switchData) => switchData.usage_count);

  const option = {
    grid: { top: '10%', bottom: '10%', left: '5%', right: '5%' },
    legend: {
      itemGap: 20,
      icon: 'circle',
      textStyle: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: 'roboto' },
    },
    xAxis: {
      type: 'category',
      data: switchIds, // Use modified switch IDs as the x-axis data
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 14,
        fontFamily: 'roboto',
        color: theme.palette.text.secondary,
        rotate: 45, // Rotate the x-axis labels by 45 degrees
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 },
      },
      axisLabel: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: 'roboto' },
    },
    series: [
      {
        data: usageCounts, // Use usage counts as the y-axis data
        type: 'bar', // Use a bar chart
        name: 'Usage Count',
        barWidth: 30, // Adjust the bar width as needed
        itemStyle: {
          color: color[0] || '', // Use the first color from the provided color array
        },
      },
    ],
  };

  return <ReactEcharts style={{ height: height }} option={{ ...option }} />;
};

export default LineChart;
