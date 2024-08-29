import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { ChartData, CurrencyTypeEnum } from '@app/interfaces/interfaces';
import { currencies } from '@app/constants/config/currencies';
import { formatNumberWithCommas, getCurrencyPrice, formatGraphValue } from '@app/utils/utils';
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
  const currency = useAppSelector((state) => state.currency.currency);
  const { t } = useTranslation();

  const [currentCurrency, setCurrentCurrency] = React.useState<CurrencyTypeEnum>(currency);

  useEffect(() => {
    if(!currency || currency === CurrencyTypeEnum.SATS) return 
    setCurrentCurrency(currency);

  }, [currency]);

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
  const calcLeftPadding = () => {
    if (!maxY || !currency || !earningData) return 60;
    const characterSize = 8.6;
    const amountLength = formatGraphValue(maxY).length; // Remove decimal points
    const symbolSize = currencies[currentCurrency].icon.replace(/\./g, '').length;
    return (amountLength + symbolSize) * characterSize;
  };
  const [leftPadding, setLeftPadding] = React.useState(calcLeftPadding());

  useEffect(() => {
    setLeftPadding(calcLeftPadding());
  }, [maxY]);

  const option = {
    tooltip: {
      ...getDefaultTooltipStyles(themeObject[theme]),
      trigger: 'axis',
      confine: true,
      formatter: (data: any) => {
        const currentSeries = data[0];
        const roundedValue = Math.round(currentSeries.value[1]); // Round to nearest dollar
        return `${currentSeries.name} - ${getCurrencyPrice(formatNumberWithCommas(roundedValue), currentCurrency)}`;
      },
    },
    grid: {
      top: 20,
      left: leftPadding,
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
        formatter: (value: number) => `${currencies[currentCurrency].icon}${formatGraphValue(value)}`,
        color: themeObject[theme].chartAxisLabel,
        fontSize: 13,
        fontFamily: 'Arial',
      },
    },
    series: seriesList,
  };

  return <BaseChart option={option} width="100%" height="12rem" />;
};
