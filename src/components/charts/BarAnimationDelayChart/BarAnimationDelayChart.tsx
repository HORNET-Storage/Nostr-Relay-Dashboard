import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import useBarChartData from '@app/hooks/useBarChartData';

// Helper function to get the last six months from the current date
const getLastSixMonths = () => {
  const months = [];
  const currentDate = new Date();

  // Get the current month and year
  const currentMonth = currentDate.getMonth(); // 0-indexed
  const currentYear = currentDate.getFullYear();

  for (let i = 5; i >= 0; i--) {
    let month = currentMonth - i;
    let year = currentYear;

    // Handle year change
    if (month < 0) {
      month += 12;
      year -= 1;
    }

    // Format month and year as YYYY-MM
    const formattedMonth = `${year}-${String(month + 1).padStart(2, '0')}`; // Add 1 to month since it's 0-indexed
    months.push(formattedMonth);
  }

  console.log('Last six months:', months);

  return months;
};

// Bar chart displaying total GB usage per month notes vs media
export const BarAnimationDelayChart: React.FC = () => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);

  const { data, isLoading } = useBarChartData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const noData = !data || data.length === 0;

  // Get the last six months
  const lastSixMonths = getLastSixMonths();

  // Filter the data to include only the last six months
  const filteredData = data ? data.filter((item) => lastSixMonths.includes(item.month)) : [];

  const xAxisData = filteredData.map((item) => item.month);
  const data1 = filteredData.map((item) => item.notes_gb);
  const data2 = filteredData.map((item) => item.media_gb);

  const option = {
    legend: {
      data: [t('charts.notes'), t('charts.media')],
      left: 20,
      top: 0,
      textStyle: {
        color: themeObject[theme].textMain,
      },
      itemStyle: {
        borderColor: '#ffff',
        borderWidth: '2',
      },
      emphasis: {
        textStyle: {
          color: 'white', // Text color when selected
          textShadowBlur: 2,
          textShadowColor: 'rgba(0, 0, 0, 0.8)', // Shadow color to create outline effect
        },
      },
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 40, // Adjust bottom padding to make space for rotated labels
      top: 70,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any[]) {
        return params.map((param) => `${param.seriesName}: ${param.data} GB`).join('<br/>');
      },
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      splitLine: {
        show: false,
      },
      axisLabel: {
        rotate: 45, // Rotate labels for better visibility
        color: themeObject[theme].textLight,
        fontWeight: 500,
        fontSize: 14,
        margin: 16,
      },
    },
    yAxis: {
      name: noData ? '' : t('charts.gigabytes'),
      nameTextStyle: {
        padding: noData ? [0, 0] : [0, -24],
        align: 'left',
      },
      axisLabel: {
        color: themeObject[theme].textLight,
        fontWeight: 500,
        fontSize: 14,
        formatter: function (value: any) {
          return `${value} GB`;
        },
      },
    },
    series: [
      {
        name: t('charts.notes'),
        type: 'bar',
        data: data1,
        color: themeObject[theme].chartColor2,
        emphasis: {
          focus: 'series',
        },
        barGap: '-10%', // Slightly overlap bars
        barCategoryGap: '30%',
        animationDelay: (idx: number) => idx * 10,
      },
      {
        name: t('charts.media'),
        type: 'bar',
        data: data2,
        color: themeObject[theme].chartColor3,
        emphasis: {
          focus: 'series',
        },
        barGap: '-10%', // Slightly overlap bars
        barCategoryGap: '30%',
        animationDelay: (idx: number) => idx * 10 + 100,
      },
    ],
    animationEasing: 'elasticOut',
    graphic: noData
      ? {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: t('charts.noData'),
            fontSize: 16,
            fill: themeObject[theme].textMain,
          },
        }
      : null,
  };

  return (
    <BaseCard padding="0 0 1.875rem" title={t('charts.monthlyDataUsage')}>
      <BaseChart option={option} />
    </BaseCard>
  );
};

// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
// import { BaseChart } from '@app/components/common/charts/BaseChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import useBarChartData from '@app/hooks/useBarChartData';

// export const BarAnimationDelayChart: React.FC = () => {
//   const { t } = useTranslation();
//   const theme = useAppSelector((state) => state.theme.theme);

//   const { data, isLoading } = useBarChartData();

//   if (isLoading || !data) {
//     return <div>Loading...</div>;
//   }

//   const xAxisData = data.map((item) => item.month);
//   const data1 = data.map((item) => item.notes_gb);
//   const data2 = data.map((item) => item.media_gb);

//   const option = {
//     legend: {
//       data: [t('charts.notes'), t('charts.media')],
//       left: 20,
//       top: 0,
//       textStyle: {
//         color: themeObject[theme].textMain,
//       },
//     },
//     grid: {
//       left: 20,
//       right: 20,
//       bottom: 0,
//       top: 70,
//       containLabel: true,
//     },
//     tooltip: {},
//     xAxis: {
//       data: xAxisData,
//       splitLine: {
//         show: false,
//       },
//     },
//     yAxis: {
//       name: t('charts.gigabytes'),
//       nameTextStyle: {
//         padding: [0, -24],
//         align: 'left',
//       },
//     },
//     series: [
//       {
//         name: t('charts.notes'),
//         type: 'bar',
//         data: data1,
//         color: themeObject[theme].chartColor2,
//         emphasis: {
//           focus: 'series',
//         },
//         barGap: '-10%', // Slightly overlap bars
//         barCategoryGap: '30%',
//         animationDelay: (idx: number) => idx * 10,
//       },
//       {
//         name: t('charts.media'),
//         type: 'bar',
//         data: data2,
//         color: themeObject[theme].chartColor3,
//         emphasis: {
//           focus: 'series',
//         },
//         barGap: '-10%', // Slightly overlap bars
//         barCategoryGap: '30%',
//         animationDelay: (idx: number) => idx * 10 + 100,
//       },
//     ],
//     animationEasing: 'elasticOut',
//   };

//   return (
//     <BaseCard padding="0 0 1.875rem" title={t('charts.monthlyDataUsage')}>
//       <BaseChart option={option} />
//     </BaseCard>
//   );
// };

// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
// import { BaseChart } from '@app/components/common/charts/BaseChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import useBarChartData from '@app/hooks/useBarChartData';

// export const BarAnimationDelayChart: React.FC = () => {
//   const { t } = useTranslation();
//   const theme = useAppSelector((state) => state.theme.theme);

//   const { data, isLoading } = useBarChartData();

//   if (isLoading || !data) {
//     return <div>Loading...</div>;
//   }

//   const xAxisData = data.map(item => item.month);
//   const data1 = data.map(item => item.notes_gb);
//   const data2 = data.map(item => item.media_gb);

//   const option = {
//     legend: {
//       data: [t('charts.notes'), t('charts.media')],
//       left: 20,
//       top: 0,
//       textStyle: {
//         color: themeObject[theme].textMain,
//       },
//     },
//     grid: {
//       left: 20,
//       right: 20,
//       bottom: 0,
//       top: 70,
//       containLabel: true,
//     },
//     tooltip: {},
//     xAxis: {
//       data: xAxisData,
//       splitLine: {
//         show: false,
//       },
//     },
//     yAxis: {
//       name: t('charts.gigabytes'),
//       nameTextStyle: {
//         padding: [0, -24],
//         align: 'left',
//       },
//     },
//     series: [
//       {
//         name: t('charts.notes'),
//         type: 'bar',
//         data: data1,
//         color: themeObject[theme].chartColor2,
//         emphasis: {
//           focus: 'series',
//         },
//         animationDelay: (idx: number) => idx * 10,
//       },
//       {
//         name: t('charts.media'),
//         type: 'bar',
//         data: data2,
//         color: themeObject[theme].chartColor3,
//         emphasis: {
//           focus: 'series',
//         },
//         animationDelay: (idx: number) => idx * 10 + 100,
//       },
//     ],
//     animationEasing: 'elasticOut',
//   };

//   return (
//     <BaseCard padding="0 0 1.875rem" title={t('charts.monthlyDataUsage')}>
//       <BaseChart option={option} />
//     </BaseCard>
//   );
// };

// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
// import { BaseChart } from '@app/components/common/charts/BaseChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';

// export const BarAnimationDelayChart: React.FC = () => {
//   const { t } = useTranslation();
//   const theme = useAppSelector((state) => state.theme.theme);

//   const [data, setData] = useState<{ data1: number[]; data2: number[]; xAxisData: string[] }>({
//     data1: [],
//     data2: [],
//     xAxisData: [],
//   });

//   useEffect(() => {
//     const xAxisData: string[] = [];
//     const data1: number[] = [];
//     const data2: number[] = [];

//     setTimeout(() => {
//       for (let i = 0; i < 100; i++) {
//         xAxisData.push(`A${i}`);
//         data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
//         data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
//       }
//       setData({ data1, data2, xAxisData });
//     }, 200);
//   }, []);

//   const option = {
//     legend: {
//       data: [t('charts.females'), t('charts.males')],
//       left: 20,
//       top: 0,
//       textStyle: {
//         color: themeObject[theme].textMain,
//       },
//     },
//     grid: {
//       left: 20,
//       right: 20,
//       bottom: 0,
//       top: 70,
//       containLabel: true,
//     },
//     tooltip: {},
//     xAxis: {
//       data: data.xAxisData,
//       splitLine: {
//         show: false,
//       },
//     },
//     yAxis: {
//       name: t('charts.averageValue'),
//       nameTextStyle: {
//         padding: [0, -24],
//         align: 'left',
//       },
//     },
//     series: [
//       {
//         name: t('charts.females'),
//         type: 'bar',
//         data: data.data1,
//         color: themeObject[theme].chartColor2,
//         emphasis: {
//           focus: 'series',
//         },
//         animationDelay: (idx: number) => idx * 10,
//       },
//       {
//         name: t('charts.males'),
//         type: 'bar',
//         data: data.data2,
//         color: themeObject[theme].chartColor3,
//         emphasis: {
//           focus: 'series',
//         },
//         animationDelay: (idx: number) => idx * 10 + 100,
//       },
//     ],
//     animationEasing: 'elasticOut',
//   };
//   return (
//     <BaseCard padding="0 0 1.875rem" title={t('charts.barLabel')}>
//       <BaseChart option={option} />
//     </BaseCard>
//   );
// };
