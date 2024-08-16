import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { NFTCard } from '@app/components/relay-dashboard/common/NFTCard/NFTCard';
import { TotalEarningChart } from '@app/components/relay-dashboard/totalEarning/TotalEarningChart/TotalEarningChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Dates } from '@app/constants/Dates';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import * as S from './TotalEarning.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useBitcoinRates } from '@app/hooks/useBitcoinRates';

export const TotalEarning: React.FC = () => {
  const { t } = useTranslation();
  const { rates: bitcoinRates, isLoading, error } = useBitcoinRates();

  const { totalEarningData, days } = useMemo(() => {
    const earningData = {
      data: bitcoinRates.map((item) => item.usd_value),
    };
    const daysData = bitcoinRates.map((item) => Dates.getDate(item.date).format('L LTS'));

    return {
      totalEarningData: earningData,
      days: daysData,
    };
  }, [bitcoinRates]);

  const latestRate = bitcoinRates.length > 0 ? bitcoinRates[bitcoinRates.length - 1]?.usd_value : undefined;
  const previousRate = bitcoinRates.length > 1 ? bitcoinRates[bitcoinRates.length - 2]?.usd_value : undefined;
  const isIncreased = latestRate && previousRate ? latestRate > previousRate : false;
  const rateDifference = latestRate && previousRate ? ((latestRate - previousRate) / previousRate) * 100 : 0;

  console.log(`latestRate: ${latestRate} previousRate: ${previousRate}`);
  console.log(`Rate difference: ${rateDifference}`);

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div>
        {t('common.error')}: {error}
      </div>
    );
  }

  const formattedLatestRate = latestRate !== undefined ? parseFloat(latestRate.toFixed(0)) : 0;
  return (
    <NFTCard isSider>
      <BaseRow gutter={[14, 14]}>
        <BaseCol span={24}>
          <BaseRow wrap={false} justify="space-between">
            <BaseCol>
              <S.Title level={3}>{t('nft.bitcoinPrice')}</S.Title>
            </BaseCol>
            <BaseCol>
              <S.ValueText $color={isIncreased ? 'success' : 'error'}>
                {isIncreased ? <CaretUpOutlined /> : <CaretDownOutlined />} {rateDifference.toFixed(2)}%
              </S.ValueText>
            </BaseCol>
          </BaseRow>
        </BaseCol>

        <BaseCol span={24}>
          <S.Text>{getCurrencyPrice(`${formatNumberWithCommas(formattedLatestRate)}`, CurrencyTypeEnum.USD)}</S.Text>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow wrap={false} justify="space-between" gutter={[20, 20]}>
            <BaseCol flex={1}>
              <TotalEarningChart xAxisData={days} earningData={totalEarningData} />
            </BaseCol>
          </BaseRow>
        </BaseCol>
      </BaseRow>
    </NFTCard>
  );
};
