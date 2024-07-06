import React from 'react';
import { EChartsOption } from 'echarts-for-react';
import { BaseChart, BaseChartProps } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { BASE_COLORS } from '@app/styles/themes/constants';
import { useTranslation } from 'react-i18next';

interface PieChartProps extends BaseChartProps {
  option?: EChartsOption;
  // eslint-disable-next-line
  data?: any;
  name?: string;
  showLegend?: boolean;
}

// Define the keys for the colors object
type DataCategory = 'kinds' | 'photos' | 'videos' | 'gitNestr' | 'audio' | 'misc';

export const PieChart: React.FC<PieChartProps> = ({ option, data, name, showLegend, ...props }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const { t } = useTranslation();

  // Function to apply logarithmic transformation
  const applyLogTransform = (data: any) => {
    return data.map((item: any) => {
      const logValue = Math.log10(item.value + 1); // Log transform, add 1 to avoid log(0)
      return {
        ...item,
        logValue,
        originalValue: item.value, // Keep original value for tooltip
      };
    });
  };

  const logTransformedData = applyLogTransform(data);

  // Define a set of colors for the pie chart
  const colors: Record<DataCategory, string> = {
    kinds: '#8e30eb', // Purple
    photos: '#F7931A', // Satoshi Orange
    videos: '#2196f3', // Blue
    gitNestr: '#19E68D', // Cyan
    audio: '#E94B2F', // Red
    misc: '#F5D149', // Yellow
  };

  // Map translated names to DataCategory keys
  const categoryMap: Record<string, DataCategory> = {
    [t('categories.kinds')]: 'kinds',
    [t('categories.photos')]: 'photos',
    [t('categories.videos')]: 'videos',
    [t('categories.gitNestr')]: 'gitNestr',
    [t('categories.audio')]: 'audio',
    [t('categories.misc')]: 'misc',
  };

  const defaultPieOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.data.originalValue} (${params.percent}%)`,
    },
    legend: {
      show: showLegend,
      top: '0%',
      left: 16,
      textStyle: {
        color: themeObject[theme].textMain,
      },
    },
    series: [
      {
        name,
        type: 'pie',
        top: showLegend ? '25%' : '10%',
        bottom: '5%',
        radius: ['100%', '70%'], // Donut chart effect
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: BASE_COLORS.white,
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            color: themeObject[theme].textMain,
          },
        },
        labelLine: {
          show: false,
        },
        data: logTransformedData.map((item: { name: string; logValue: any; originalValue: any }) => ({
          name: item.name,
          value: item.logValue,
          originalValue: item.originalValue,
          itemStyle: {
            color: colors[categoryMap[item.name]],
          },
        })),
      },
    ],
  };

  return <BaseChart {...props} option={{ ...defaultPieOption, ...option }} />;
};

// import React from 'react';
// import { EChartsOption } from 'echarts-for-react';
// import { BaseChart, BaseChartProps } from '@app/components/common/charts/BaseChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import { BASE_COLORS } from '@app/styles/themes/constants';

// interface PieChartProps extends BaseChartProps {
//   option?: EChartsOption;
//   // eslint-disable-next-line
//   data?: any;
//   name?: string;
//   showLegend?: boolean;
// }

// export const PieChart: React.FC<PieChartProps> = ({ option, data, name, showLegend, ...props }) => {
//   const theme = useAppSelector((state) => state.theme.theme);

//   // Function to apply logarithmic transformation
//   const applyLogTransform = (data: any) => {
//     return data.map((item: any) => {
//       const logValue = Math.log10(item.value + 1); // Log transform, add 1 to avoid log(0)
//       return {
//         ...item,
//         logValue,
//         originalValue: item.value, // Keep original value for tooltip
//       };
//     });
//   };

//   const logTransformedData = applyLogTransform(data);

//   const defaultPieOption = {
//     tooltip: {
//       trigger: 'item',
//       formatter: (params: any) => `${params.name}: ${params.data.originalValue} (${params.percent}%)`,
//     },
//     legend: {
//       show: showLegend,
//       top: '0%',
//       left: 16,
//       textStyle: {
//         color: themeObject[theme].textMain,
//       },
//     },
//     series: [
//       {
//         name,
//         type: 'pie',
//         top: showLegend ? '25%' : '10%',
//         bottom: '5%',
//         radius: ['40%', '70%'], // Donut chart effect
//         avoidLabelOverlap: false,
//         itemStyle: {
//           borderRadius: 5,
//           borderColor: BASE_COLORS.white,
//           borderWidth: 2,
//         },
//         label: {
//           show: false,
//         },
//         emphasis: {
//           itemStyle: {
//             shadowBlur: 10,
//             shadowOffsetX: 0,
//             shadowColor: 'rgba(0, 0, 0, 0.5)',
//           },
//           label: {
//             show: true,
//             fontSize: '18',
//             fontWeight: 'bold',
//             color: themeObject[theme].textMain,
//           },
//         },
//         labelLine: {
//           show: false,
//         },
//         data: logTransformedData.map((item: { name: any; logValue: any; originalValue: any }) => ({
//           name: item.name,
//           value: item.logValue,
//           originalValue: item.originalValue,
//         })),
//       },
//     ],
//   };
//   return <BaseChart {...props} option={{ ...defaultPieOption, ...option }} />;
// };

// import React from 'react';
// import { EChartsOption } from 'echarts-for-react';
// import { BaseChart, BaseChartProps } from '@app/components/common/charts/BaseChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { themeObject } from '@app/styles/themes/themeVariables';
// import { BASE_COLORS } from '@app/styles/themes/constants';

// interface PieChartProps extends BaseChartProps {
//   option?: EChartsOption;
//   // eslint-disable-next-line
//   data?: any;
//   name?: string;
//   showLegend?: boolean;
// }

// export const PieChart: React.FC<PieChartProps> = ({ option, data, name, showLegend, ...props }) => {
//   const theme = useAppSelector((state) => state.theme.theme);

//   const defaultPieOption = {
//     tooltip: {
//       trigger: 'item',
//     },
//     legend: {
//       show: showLegend,
//       top: '0%',
//       left: 16,
//       textStyle: {
//         color: themeObject[theme].textMain,
//       },
//     },
//     series: [
//       {
//         name,
//         type: 'pie',
//         top: showLegend ? '25%' : '10%',
//         bottom: '5%',
//         radius: ['55%', '100%'],
//         avoidLabelOverlap: false,
//         itemStyle: {
//           borderRadius: 5,
//           borderColor: BASE_COLORS.white,
//           borderWidth: 2,
//         },
//         label: {
//           show: false,
//           position: 'center',
//         },
//         emphasis: {
//           label: {
//             show: true,
//             fontSize: '40',
//             fontWeight: 'bold',
//             color: themeObject[theme].textMain,
//           },
//         },
//         labelLine: {
//           show: false,
//         },
//         data,
//       },
//     ],
//   };
//   return <BaseChart {...props} option={{ ...defaultPieOption, ...option }} />;
// };
