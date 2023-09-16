import { useTheme } from '@mui/system';
import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';

const DoughnutChartTrack = ({ height, color = [] }) => {
  const theme = useTheme();

  const [trackSegmentUsageData, setTrackSegmentUsageData] = useState([]);

  useEffect(() => {
    // Make an HTTP GET request to fetch track segment usage data
    fetch('http://localhost:5500/api/track-usage')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Track Segment Usage Data:', data);
        // Process the data
        const sortedData = data.sort((a, b) => b.total_usage - a.total_usage);
        const topFiveSegments = sortedData.slice(0, 5);

        const trackDataWithPercentage = data.map((segmentData) => ({
          name: `Track Segment ${segmentData.track_id}`,
          value: ((segmentData.total_usage / totalUsageCount) * 100).toFixed(2),
          itemStyle: {
            color: topFiveSegments.some((topSegment) => topSegment.track_id === segmentData.track_id) ? '' : 'gray',
            borderColor: 'transparent',
            borderWidth: topFiveSegments.some((topSegment) => topSegment.track_id === segmentData.track_id) ? 1 : 0,
            z: topFiveSegments.some((topSegment) => topSegment.track_id === segmentData.track_id) ? 1 : -1,
          },
        }));

        setTrackSegmentUsageData(trackDataWithPercentage);
      })
      .catch((error) => {
        console.error('Error fetching track segment usage data:', error);
      });
  }, []);

  // Calculate the total usage count for all track segments
  const totalUsageCount = trackSegmentUsageData.reduce((total, segmentData) => total + parseFloat(segmentData.value), 0);

  const option = {
    legend: {
      show: false,
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: (params) => {
        const segmentName = params.name;
        const segmentValue = params.value;
        return `${segmentName}: ${segmentValue}%`;
      },
    },
    xAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],
    yAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],
    series: [
      {
        name: 'Track Segment Usage',
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
        data: trackSegmentUsageData,
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
        mouseover: () => {},
        mouseout: () => {},
      }}
    />
  );
};

export default DoughnutChartTrack;
