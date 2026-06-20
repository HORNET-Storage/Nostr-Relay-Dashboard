import React from 'react';
import { EChartsOption } from 'echarts-for-react';
import { BaseChart, BaseChartProps, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { BASE_COLORS } from '@app/styles/themes/constants';
import { useTranslation } from 'react-i18next';
import { graphic } from 'echarts';

interface PieChartProps extends BaseChartProps {
  option?: EChartsOption;
  // eslint-disable-next-line
  data?: any;
  name?: string;
  showLegend?: boolean;
}

// Define the keys for the colors object
type DataCategory = 'kinds' | 'photos' | 'videos' | 'nosis' | 'audio' | 'misc';

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

  // Define gradient colors for the pie chart with liquid glass theme
  const getGradientColor = (color1: string, color2: string) => {
    return new graphic.LinearGradient(0, 0, 1, 1, [
      {
        offset: 0,
        color: color1,
      },
      {
        offset: 1,
        color: color2,
      },
    ]);
  };

  const colors: Record<DataCategory, any> = {
    kinds: getGradientColor('rgba(142, 48, 235, 0.9)', 'rgba(142, 48, 235, 0.4)'), // Purple gradient
    photos: getGradientColor('rgba(247, 147, 26, 0.9)', 'rgba(247, 147, 26, 0.4)'), // Orange gradient
    videos: getGradientColor('rgba(33, 150, 243, 0.9)', 'rgba(33, 150, 243, 0.4)'), // Blue gradient
    nosis: getGradientColor('rgba(25, 230, 141, 0.9)', 'rgba(25, 230, 141, 0.4)'), // Cyan gradient
    audio: getGradientColor('rgba(233, 75, 47, 0.9)', 'rgba(233, 75, 47, 0.4)'), // Red gradient
    misc: getGradientColor('rgba(245, 209, 73, 0.9)', 'rgba(245, 209, 73, 0.4)'), // Yellow gradient
  };

  // Map translated names to DataCategory keys
  const categoryMap: Record<string, DataCategory> = {
    [t('categories.kinds')]: 'kinds',
    [t('categories.photos')]: 'photos',
    [t('categories.videos')]: 'videos',
    [t('categories.nosis')]: 'nosis',
    [t('categories.audio')]: 'audio',
    [t('categories.misc')]: 'misc',
  };

  const defaultPieOption = {
    tooltip: {
      ...getDefaultTooltipStyles(themeObject[theme]),
      trigger: 'item',
      formatter: (params: any) => {
        const value = params.data.originalValue.toFixed(3);
        const categoryKey = categoryMap[params.name];
        
        // Get the base color for the category
        const colorMap: Record<DataCategory, string> = {
          kinds: 'rgba(142, 48, 235, 0.9)',
          photos: 'rgba(247, 147, 26, 0.9)',
          videos: 'rgba(33, 150, 243, 0.9)',
          nosis: 'rgba(25, 230, 141, 0.9)',
          audio: 'rgba(233, 75, 47, 0.9)',
          misc: 'rgba(245, 209, 73, 0.9)',
        };
        
        const categoryColor = colorMap[categoryKey] || 'rgba(0, 255, 255, 0.9)';
        const gradientStyle = `background: linear-gradient(135deg, ${categoryColor}, ${categoryColor.replace('0.9', '0.4')})`;
        
        return `
          <div style="padding: 4px;">
            <div style="display: flex; align-items: center;">
              <span style="width: 10px; height: 10px; border-radius: 50%; ${gradientStyle}; display: inline-block; margin-right: 8px;"></span>
              <span style="color: rgba(255, 255, 255, 0.85);">${params.name}: </span>
              <span style="color: ${categoryColor}; font-weight: 600; margin-left: 4px;">${value} GB</span>
              <span style="color: rgba(0, 255, 255, 0.7); margin-left: 4px;">(${params.percent}%)</span>
            </div>
          </div>
        `;
      },
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
          borderRadius: 10,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 2,
          shadowBlur: 15,
          shadowColor: 'rgba(0, 255, 255, 0.3)',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
        },
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 25,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 255, 255, 0.5)',
            borderWidth: 3,
            borderColor: 'rgba(255, 255, 255, 0.8)',
          },
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            color: themeObject[theme].textMain,
            textShadowBlur: 3,
            textShadowColor: 'rgba(0, 0, 0, 0.8)',
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
