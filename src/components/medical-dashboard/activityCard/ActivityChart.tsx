// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
// import { dashboardPaddings } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
// import { useResponsive } from '@app/hooks/useResponsive';
// import { ChartSeriesData } from '@app/interfaces/interfaces';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import { graphic } from 'echarts';
// import useActivityData from '@app/hooks/useActivityData';

// // Helper function to get the last six months from the current date
// const getLastSixMonths = () => {
//   const months = [];
//   const currentDate = new Date();

//   // Get the current month and year
//   let currentMonth = currentDate.getMonth(); // 0-indexed
//   let currentYear = currentDate.getFullYear();

//   for (let i = 5; i >= 0; i--) {
//     let month = currentMonth - i;
//     let year = currentYear;

//     // Handle year change
//     if (month < 0) {
//       month += 12;
//       year -= 1;
//     }

//     // Format month and year as YYYY-MM
//     const formattedMonth = `${year}-${String(month + 1).padStart(2, '0')}`; // Add 1 to month since it's 0-indexed
//     months.push(formattedMonth);
//   }

//   console.log("Last six months:", months);

//   return months;
// };

// export const ActivityChart: React.FC = () => {
//   const theme = useAppSelector((state) => state.theme.theme);

//   const { t } = useTranslation();
//   const { data, isLoading } = useActivityData();

//   const { isTablet, isDesktop } = useResponsive();
//   const size = isDesktop ? 'xl' : isTablet ? 'md' : 'xs';

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   const noData = !data || data.length === 0;

//   // Get the last six months
//   const lastSixMonths = getLastSixMonths();

//   // Filter the data to include only the last six months
//   const filteredData = lastSixMonths.map(month => {
//     const monthData = data.find(item => item.month === month);
//     return {
//       month,
//       total_gb: monthData ? monthData.total_gb : 0, // Ensure 0 if no data for the month
//     };
//   });

//   const months = filteredData.map(item => item.month);
//   const values = filteredData.map(item => item.total_gb);

//   const option = {
//     color: new graphic.LinearGradient(0, 0, 0, 1, [
//       {
//         offset: 0,
//         color: 'rgba(51, 156, 253, 0.7)',
//       },
//       {
//         offset: 1,
//         color: 'rgba(51, 156, 253, 0.15)',
//       },
//     ]),
//     grid: {
//       left: 20,
//       right: 20,
//       bottom: 40, // Adjust bottom padding to make space for rotated labels
//       top: 70,
//       containLabel: true,
//     },
//     xAxis: {
//       type: 'category',
//       data: months,
//       position: 'bottom',
//       nameLocation: 'middle',
//       axisLabel: {
//         color: themeObject[theme].textLight,
//         fontWeight: 500,
//         fontSize: 14,
//         rotate: 45, // Rotate labels for better fit and visibility
//         interval: 0, // Show all labels without skipping
//         margin: 16,
//       },
//     },
//     yAxis: {
//       type: 'value',
//       min: 0,
//       axisLabel: {
//         formatter: '{value} GB',
//         color: themeObject[theme].textLight,
//         fontWeight: 500,
//         fontSize: 14,
//       },
//     },
//     series: [
//       {
//         barMaxWidth: 40, // Increase bar width for better visibility
//         data: values,
//         type: 'bar',
//         itemStyle: {
//           borderRadius: 7,
//         },
//       },
//     ],
//     tooltip: {
//       ...getDefaultTooltipStyles(themeObject[theme]),
//       trigger: 'axis',
//       formatter: (params: any) => {
//         const currentItem = params[0];
//         return `${currentItem.name}: ${currentItem.value} GB`; // Include the month in the tooltip
//       },
//     },
//     graphic: noData
//       ? {
//         type: 'text',
//         left: 'center',
//         top: 'center',
//         style: {
//           text: t('charts.noData'),
//           fontSize: 16,
//           fill: themeObject[theme].textMain,
//         },
//       }
//       : null,
//   };

//   return <BaseChart option={option} height="100%" />;
// };

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
import { dashboardPaddings } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
import { useResponsive } from '@app/hooks/useResponsive';
import { ChartSeriesData } from '@app/interfaces/interfaces';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { graphic } from 'echarts';
import useActivityData from '@app/hooks/useActivityData';

// Helper function to get the last six months from the current date
const getLastSixMonths = () => {
  const months = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - i);
    const formattedMonth = month.toISOString().slice(0, 7); // Format as YYYY-MM
    months.push(formattedMonth);
  }

  return months;
};

export const ActivityChart: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  const { t } = useTranslation();
  const { data, isLoading } = useActivityData();

  const { isTablet, isDesktop } = useResponsive();
  const size = isDesktop ? 'xl' : isTablet ? 'md' : 'xs';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const noData = !data || data.length === 0;

  // Get the last six months
  const lastSixMonths = getLastSixMonths();

  // Filter the data to include only the last six months
  const filteredData = data ? data.filter((item) => lastSixMonths.includes(item.month)) : [];

  const months = filteredData.map((item) => item.month);
  const values = filteredData.map((item) => item.total_gb);

  const option = {
    legend: {
      data: ['Data'],
      show: 'true',
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
    color: new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: 'rgba(51, 156, 253, 0.7)',
      },
      {
        offset: 1,
        color: 'rgba(51, 156, 253, 0.15)',
      },
    ]),
    grid: {
      left: 20,
      right: 20,
      bottom: 40, // Adjust bottom padding to make space for rotated labels
      top: 70,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months,
      position: 'bottom',
      nameLocation: 'middle',

      axisLabel: {
        color: themeObject[theme].textLight,
        fontWeight: 500,
        fontSize: 14,
        rotate: 45, // Rotate labels for better fit and visibility
        interval: 0, // Show all labels without skipping
        margin: 16,
      },
    },
    yAxis: {
      name: noData ? '' : t('charts.gigabytes'),
      type: 'value',
      min: 0,
      axisLabel: {
        formatter: '{value} GB',
        color: themeObject[theme].textLight,
        fontWeight: 500,
        fontSize: 14,
      },
    },
    series: [
      {
        name: 'Data',
        barMaxWidth: 40, // Increase bar width for better visibility
        data: values,
        type: 'bar',
        itemStyle: {
          borderRadius: 7,
        },
      },
    ],
    tooltip: {
      ...getDefaultTooltipStyles(themeObject[theme]),
      trigger: 'axis',
      formatter: (params: any) => {
        const currentItem = params[0];
        return `${currentItem.name}: ${currentItem.value.toFixed(3)} GB`; // Include the month in the tooltip
      },
    },
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

  return <BaseChart style={{}} option={option} height="100%" />;
};

// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
// import { dashboardPaddings } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
// import { useResponsive } from '@app/hooks/useResponsive';
// import { ChartSeriesData } from '@app/interfaces/interfaces';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import { graphic } from 'echarts';
// import useActivityData from '@app/hooks/useActivityData';

// export const ActivityChart: React.FC = () => {
//   const theme = useAppSelector((state) => state.theme.theme);

//   const { t } = useTranslation();
//   const { data, isLoading } = useActivityData();

//   const { isTablet, isDesktop, isMobile } = useResponsive();
//   const size = isDesktop ? 'xl' : isTablet ? 'md' : 'xs';

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!data || data.length === 0) {
//     return <div>No data available</div>;
//   }

//   const months = data.map((item) => item.month);
//   const values = data.map((item) => item.total_gb);

//   const option = {
//     color: new graphic.LinearGradient(0, 0, 0, 1, [
//       {
//         offset: 0,
//         color: 'rgba(51, 156, 253, 0.7)',
//       },
//       {
//         offset: 1,
//         color: 'rgba(51, 156, 253, 0.15)',
//       },
//     ]),
//     grid: {
//       top: dashboardPaddings[size][0],
//       right: dashboardPaddings[size][1],
//       bottom: dashboardPaddings[size][1],
//       left: dashboardPaddings[size][0],
//       containLabel: true,
//     },
//     xAxis: {
//       type: 'category',
//       axisTick: {
//         show: false,
//       },
//       axisLine: {
//         show: false,
//       },
//       data: months,
//       position: 'bottom',
//       nameLocation: 'middle',
//       axisLabel: {
//         color: themeObject[theme].primary,
//         fontWeight: 500,
//         fontSize: 14,
//       },
//     },
//     yAxis: {
//       type: 'value',
//       min: 0,
//       axisLabel: {
//         formatter: '{value} GB',
//         color: themeObject[theme].textLight,
//         fontWeight: 500,
//         fontSize: 14,
//       },
//     },
//     series: [
//       {
//         barMaxWidth: 26,
//         data: values,
//         type: 'bar',
//         itemStyle: {
//           borderRadius: 7,
//         },
//       },
//     ],
//     tooltip: {
//       ...getDefaultTooltipStyles(themeObject[theme]),
//       trigger: 'axis',
//       formatter: (data: ChartSeriesData) => {
//         const currentItem = data[0];
//         return `${currentItem.value} GB ${currentItem.name}`;
//       },
//     },
//   };

//   return <BaseChart option={option} height="100%" />;
// };

// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
// import { dashboardPaddings } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
// import { useResponsive } from '@app/hooks/useResponsive';
// import { ChartSeriesData } from '@app/interfaces/interfaces';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import { graphic } from 'echarts';
// import useActivityData from '@app/hooks/useActivityData';

// export const ActivityChart: React.FC = () => {
//   const theme = useAppSelector((state) => state.theme.theme);

//   const { t } = useTranslation();
//   const { data, isLoading } = useActivityData();

//   const { isTablet, isDesktop, isMobile } = useResponsive();
//   const size = isDesktop ? 'xl' : isTablet ? 'md' : isMobile ? 'xs' : 'xs';

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   const months = data.map((item) => item.month);
//   const values = data.map((item) => item.total_gb);

//   const option = {
//     color: new graphic.LinearGradient(0, 0, 0, 1, [
//       {
//         offset: 0,
//         color: 'rgba(51, 156, 253, 0.7)',
//       },
//       {
//         offset: 1,
//         color: 'rgba(51, 156, 253, 0.15)',
//       },
//     ]),
//     grid: {
//       top: dashboardPaddings[size][0],
//       right: dashboardPaddings[size][1],
//       bottom: dashboardPaddings[size][1],
//       left: dashboardPaddings[size][0],
//       containLabel: true,
//     },
//     xAxis: {
//       type: 'category',
//       axisTick: {
//         show: false,
//       },
//       axisLine: {
//         show: false,
//       },
//       data: months,
//       position: 'bottom',
//       nameLocation: 'middle',
//       axisLabel: {
//         color: themeObject[theme].primary,
//         fontWeight: 500,
//         fontSize: 14,
//       },
//     },
//     yAxis: {
//       type: 'value',
//       min: 0,
//       axisLabel: {
//         formatter: '{value} GB',
//         color: themeObject[theme].textLight,
//         fontWeight: 500,
//         fontSize: 14,
//       },
//     },
//     series: [
//       {
//         barMaxWidth: 26,
//         data: values,
//         type: 'bar',
//         itemStyle: {
//           borderRadius: 7,
//         },
//       },
//     ],
//     tooltip: {
//       ...getDefaultTooltipStyles(themeObject[theme]),
//       trigger: 'axis',
//       formatter: (data: ChartSeriesData) => {
//         const currentItem = data[0];
//         return `${currentItem.value} GB ${currentItem.name}`;
//       },
//     },
//   };

//   return <BaseChart option={option} height="100%" />;
// };

// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
// import { dashboardPaddings } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
// import { useResponsive } from '@app/hooks/useResponsive';
// import { ChartSeriesData } from '@app/interfaces/interfaces';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import { graphic } from 'echarts';
// import useActivityData from '@app/hooks/useActivityData';

// export const ActivityChart: React.FC = () => {
//   const theme = useAppSelector((state) => state.theme.theme);

//   const { t } = useTranslation();
//   const { data, isLoading } = useActivityData();

//   const { isTablet, isDesktop, isMobile } = useResponsive();
//   const size = isDesktop ? 'xl' : isTablet ? 'md' : isMobile ? 'xs' : 'xs';

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   const months = data.map(item => item.month);
//   const values = data.map(item => item.total_gb);

//   const option = {
//     color: new graphic.LinearGradient(0, 0, 0, 1, [
//       {
//         offset: 0,
//         color: 'rgba(51, 156, 253, 0.7)',
//       },
//       {
//         offset: 1,
//         color: 'rgba(51, 156, 253, 0.15)',
//       },
//     ]),
//     grid: {
//       top: dashboardPaddings[size][0],
//       right: dashboardPaddings[size][1],
//       bottom: dashboardPaddings[size][1],
//       left: dashboardPaddings[size][0],
//       containLabel: true,
//     },
//     xAxis: {
//       type: 'category',
//       axisTick: {
//         show: false,
//       },
//       axisLine: {
//         show: false,
//       },
//       data: months,
//       position: 'top',
//       axisLabel: {
//         color: themeObject[theme].primary,
//         fontWeight: 500,
//         fontSize: 14,
//       },
//     },
//     yAxis: {
//       type: 'value',
//       min: 0,
//       axisLabel: {
//         formatter: '{value} GB',
//         color: themeObject[theme].textLight,
//         fontWeight: 500,
//         fontSize: 14,
//       },
//     },
//     series: [
//       {
//         barMaxWidth: 26,
//         data: values,
//         type: 'bar',
//         itemStyle: {
//           borderRadius: 7,
//         },
//       },
//     ],
//     tooltip: {
//       ...getDefaultTooltipStyles(themeObject[theme]),
//       trigger: 'axis',
//       formatter: (data: ChartSeriesData) => {
//         const currentItem = data[0];
//         return `${currentItem.value} GB ${currentItem.name}`;
//       },
//     },
//   };

//   return <BaseChart option={option} height="100%" />;
// };
