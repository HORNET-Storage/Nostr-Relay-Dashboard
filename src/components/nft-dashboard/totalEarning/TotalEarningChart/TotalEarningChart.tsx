import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { ChartData, CurrencyTypeEnum } from '@app/interfaces/interfaces';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
// import { formatDate } from '@app/utils/dateFormatter';

interface LineData {
  data: ChartData;
}

interface TotalEarningChartProps {
  xAxisData: number[] | string[];
  earningData: LineData;
}

export const TotalEarningChart: React.FC<TotalEarningChartProps> = ({ xAxisData, earningData }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const { t } = useTranslation();

  console.log('xAxisData:', xAxisData);
  console.log('earningData:', earningData);

  const minYValue = Math.min(...earningData.data);
  const maxYValue = Math.max(...earningData.data);

  const roundDown = (value: number, interval: number) => Math.floor(value / interval) * interval;
  const roundUp = (value: number, interval: number) => Math.ceil(value / interval) * interval;

  const interval = 1000;
  const minY = roundDown(minYValue * 0.99, interval);
  const maxY = roundUp(maxYValue * 1.01, interval);

  const yAxisTickInterval = (maxY - minY) / 5;

  const seriesList = [
    {
      name: t('nft.earnings'),
      type: 'line',
      data: earningData.data.map((value, index) => [xAxisData[index], value]),
      showSymbol: true,
      symbolSize: 4,
      smooth: false,
      lineStyle: {
        width: 2,
        color: themeObject[theme].chartColor3,
      },
      emphasis: {
        focus: 'series',
      },
      encode: {
        x: 'date',
        y: 'usd_value',
        label: ['date', 'usd_value'],
        itemName: 'date',
        tooltip: ['usd_value'],
      },
    },
  ];

  const option = {
    tooltip: {
      ...getDefaultTooltipStyles(themeObject[theme]),
      trigger: 'axis',
      confine: true,
      formatter: (data: any) => {
        const currentSeries = data[0];
        const roundedValue = Math.round(currentSeries.value[1]); // Round to nearest dollar
        return `${currentSeries.name} - ${getCurrencyPrice(
          formatNumberWithCommas(roundedValue),
          CurrencyTypeEnum.USD,
        )}`;
      },
    },
    grid: {
      top: 20,
      left: 60,
      right: 20,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: themeObject[theme].chartAxisLabel,
        },
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      min: minY,
      max: maxY,
      interval: yAxisTickInterval, // Ensure even spacing
      axisLine: {
        lineStyle: {
          color: themeObject[theme].chartAxisLabel,
        },
      },
      splitLine: {
        lineStyle: {
          color: '#444',
        },
      },
      axisLabel: {
        formatter: (value: number) => `$${formatNumberWithCommas(value)}`,
        color: themeObject[theme].chartAxisLabel,
        fontSize: 13,
        fontFamily: 'Arial',
      },
    },
    series: seriesList,
  };

  return <BaseChart option={option} width="100%" height="12rem" />;
};

// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import { ChartData, CurrencyTypeEnum } from '@app/interfaces/interfaces';
// import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
// import { formatDate } from '@app/utils/dateFormatter'; // Import the date formatter

// interface LineData {
//   data: ChartData;
// }

// interface TotalEarningChartProps {
//   xAxisData: number[] | string[];
//   earningData: LineData;
// }

// export const TotalEarningChart: React.FC<TotalEarningChartProps> = ({ xAxisData, earningData }) => {
//   const theme = useAppSelector((state) => state.theme.theme);
//   const { t } = useTranslation();

//   const seriesList = [
//     {
//       name: t('nft.earnings'),
//       type: 'line',
//       data: earningData.data.map((value, index) => [xAxisData[index], value]),
//       showSymbol: false,
//       smooth: false,  // Reduce or disable smoothing
//       lineStyle: {
//         width: 2,
//       },
//     },
//   ];

//   const option = {
//     tooltip: {
//       ...getDefaultTooltipStyles(themeObject[theme]),
//       trigger: 'axis',
//       formatter: (data: any) => {
//         const currentSeries = data[0];
//         return `${currentSeries.name} - ${getCurrencyPrice(
//           formatNumberWithCommas(currentSeries.value[1]),
//           CurrencyTypeEnum.USD,
//         )}`;
//       },
//     },
//     grid: {
//       top: 10,
//       left: 10,
//       right: 10,
//       bottom: 10,
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: false,
//       data: xAxisData,
//       axisLabel: {
//         formatter: (value: string, index: number) => {
//           return formatDate(parseInt(value)); // Format the date using the utility function
//         }
//       }
//     },
//     yAxis: {
//       type: 'value',
//       axisLine: {
//         show: true,
//       },
//       axisTick: {
//         show: true,
//       },
//     },
//     series: seriesList,
//   };

//   return <BaseChart option={option} width="100%" height="6rem" />;
// };

// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import { ChartData, CurrencyTypeEnum } from '@app/interfaces/interfaces';
// import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';

// interface LineData {
//   data: ChartData;
// }

// interface TotalEarningChartProps {
//   xAxisData: number[] | string[];
//   earningData: LineData;
// }

// export const TotalEarningChart: React.FC<TotalEarningChartProps> = ({ xAxisData, earningData }) => {
//   const theme = useAppSelector((state) => state.theme.theme);
//   const { t } = useTranslation();

//   const seriesList = [
//     {
//       name: t('nft.earnings'),
//       type: 'line',
//       data: earningData.data.map((value, index) => [xAxisData[index], value]),
//       showSymbol: false,
//       smooth:false,
//       lineStyle: {
//         width: 2,
//         color: themeObject[theme].chartColor3,
//       },
//       emphasis: {
//         focus: 'series',
//       },
//       encode: {
//         x: 'date',
//         y: 'usd_value',
//         label: ['date', 'usd_value'],
//         itemName: 'date',
//         tooltip: ['usd_value'],
//       },
//     },
//   ];

//   const option = {
//     tooltip: {
//       ...getDefaultTooltipStyles(themeObject[theme]),
//       trigger: 'axis',
//       formatter: (data: any) => {
//         const currentSeries = data[0];
//         return `${currentSeries.name} - ${getCurrencyPrice(
//           formatNumberWithCommas(currentSeries.value[1]),
//           CurrencyTypeEnum.USD,
//         )}`;
//       },
//     },
//     grid: {
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: true,
//       data: xAxisData,
//       show: false, // Hide x-axis
//     },
//     yAxis: {
//       type: 'value',
//       show: false, // Hide y-axis
//     },
//     series: seriesList,
//   };

//   return <BaseChart option={option} width="100%" height="6rem" />;
// };
