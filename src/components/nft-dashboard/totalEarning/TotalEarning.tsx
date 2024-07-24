import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
import { TotalEarningChart } from '@app/components/nft-dashboard/totalEarning/TotalEarningChart/TotalEarningChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Dates } from '@app/constants/Dates';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import * as S from './TotalEarning.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useBitcoinRates } from '@app/hooks/useBitcoinRates';

export const TotalEarning: React.FC = () => {
  const { t } = useTranslation();

  const currency = useAppSelector((state) => state.currency.currency);
  const { rates: bitcoinRates, isLoading, error } = useBitcoinRates(currency);

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
        {t('common.error')}: {"Unable to retrieve rates. Try again later."}
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
          <S.Text>{getCurrencyPrice(`${formatNumberWithCommas(formattedLatestRate)}`, currency)}</S.Text>
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

// import React, { useEffect, useMemo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
// import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
// import { TotalEarningChart } from '@app/components/nft-dashboard/totalEarning/TotalEarningChart/TotalEarningChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { getTotalEarning, TotalEarning as ITotalEarning } from '@app/api/earnings.api';
// import { Dates } from '@app/constants/Dates';
// import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
// import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
// import * as S from './TotalEarning.styles';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import { useBitcoinRates } from '@app/hooks/useBitcoinRates';

// export const TotalEarning: React.FC = () => {
//   const { t } = useTranslation();
//   const [totalEarning, setTotalEarning] = useState<ITotalEarning | null>(null);
//   const { rates: bitcoinRates, isLoading, error } = useBitcoinRates();

//   const userId = useAppSelector((state) => state.user.user?.id);

//   useEffect(() => {
//     if (userId) {
//       getTotalEarning(userId, CurrencyTypeEnum.USD).then((res) => setTotalEarning(res));
//     }
//   }, [userId]);

//   const { totalEarningData, days } = useMemo(() => {
//     const earningData = {
//       data: bitcoinRates.map((item) => item.usd_value),
//     };
//     const daysData = bitcoinRates.map((item) => Dates.getDate(item.date).format('L LTS'));

//     return {
//       totalEarningData: earningData,
//       days: daysData,
//     };
//   }, [bitcoinRates]);

//   const latestRate = bitcoinRates[bitcoinRates.length - 1]?.usd_value;
//   const previousRate = bitcoinRates[bitcoinRates.length - 2]?.usd_value;
//   const isIncreased = latestRate > previousRate;
//   const rateDifference = latestRate && previousRate ? ((latestRate - previousRate) / previousRate) * 100 : 0;

//   if (isLoading) {
//     return <div>{t('common.loading')}</div>;
//   }

//   if (error) {
//     return <div>{t('common.error')}: {error}</div>;
//   }

//   return (
//     <BaseRow>
//       <BaseCol span={24}>
//         <S.Title level={2}>{t('nft.bitcoinPrice')}</S.Title>
//       </BaseCol>
//       <BaseCol span={24}>
//         <NFTCard isSider>
//           <BaseRow gutter={[14, 14]}>
//             <BaseCol span={24}>
//               <BaseRow wrap={false} justify="space-between">
//                 <BaseCol>
//                   <S.Title level={2}>{t('nft.bitcoinPrice')}</S.Title>
//                 </BaseCol>
//                 <BaseCol>
//                   <S.ValueText $color={isIncreased ? 'success' : 'error'}>
//                     {isIncreased ? <CaretUpOutlined /> : <CaretDownOutlined />}{' '}
//                     {totalEarning && `${rateDifference.toFixed(2)}%`}
//                   </S.ValueText>
//                 </BaseCol>
//               </BaseRow>
//             </BaseCol>
//             <BaseCol span={24}>
//               <BaseRow wrap={false} justify="space-between" gutter={[20, 20]}>
//                 <BaseCol>
//                   <S.Text>{getCurrencyPrice(formatNumberWithCommas(latestRate ?? 0), CurrencyTypeEnum.USD)}</S.Text>
//                 </BaseCol>
//                 <BaseCol flex={1}>
//                   <TotalEarningChart xAxisData={days} earningData={totalEarningData} />
//                 </BaseCol>
//               </BaseRow>
//             </BaseCol>
//           </BaseRow>
//         </NFTCard>
//       </BaseCol>
//     </BaseRow>
//   );
// };

// import React, { useEffect, useMemo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
// import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
// import { TotalEarningChart } from '@app/components/nft-dashboard/totalEarning/TotalEarningChart/TotalEarningChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import {
//   getTotalEarning,
//   getBitcoinRatesForLast30Days,
//   TotalEarning as ITotalEarning,
//   Earning,
// } from '@app/api/earnings.api';
// import { Dates } from '@app/constants/Dates';
// import { formatNumberWithCommas, getCurrencyPrice, getDifference } from '@app/utils/utils';
// import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
// import * as S from './TotalEarning.styles';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

// export const TotalEarning: React.FC = () => {
//   const [totalEarning, setTotalEarning] = useState<ITotalEarning | null>(null);
//   const [bitcoinRates, setBitcoinRates] = useState<Earning[]>([]);

//   const userId = useAppSelector((state) => state.user.user?.id);

//   const { t } = useTranslation();

//   useEffect(() => {
//     if (userId) {
//       getTotalEarning(userId, CurrencyTypeEnum.USD).then((res) => setTotalEarning(res));
//       getBitcoinRatesForLast30Days().then((res) => {
//         console.log('Bitcoin rates:', res);
//         setBitcoinRates(res);
//       });
//     }
//   }, [userId]);

//   const { totalEarningData, days } = useMemo(() => {
//     const earningData = {
//       data: bitcoinRates.map((item) => item.usd_value),
//     };
//     const daysData = bitcoinRates.map((item) => Dates.getDate(item.date).format('L LTS')); // Include time

//     console.log('Chart data:', earningData);
//     console.log('Days:', daysData);

//     return {
//       totalEarningData: earningData,
//       days: daysData,
//     };
//   }, [bitcoinRates]);

//   // Determine if the current Bitcoin rate has increased compared to the previous rate
//   const latestRate = bitcoinRates[bitcoinRates.length - 1]?.usd_value;
//   const previousRate = bitcoinRates[bitcoinRates.length - 2]?.usd_value;
//   const isIncreased = latestRate > previousRate;
//   const rateDifference = latestRate && previousRate ? ((latestRate - previousRate) / previousRate) * 100 : 0;

//   console.log(`latestRate: ${latestRate} previousRate: ${previousRate}`);
//   console.log(`Rate difference: ${rateDifference}`);

// return (
//   <NFTCard isSider>
//     <BaseRow gutter={[14, 14]}>
//       <BaseCol span={24}>
//         <BaseRow wrap={false} justify="space-between">
//           <BaseCol>
//             <S.Title level={2}>{t('nft.bitcoinPrice')}</S.Title>
//           </BaseCol>

//           <BaseCol>
//             <S.ValueText $color={isIncreased ? 'success' : 'error'}>
//               {isIncreased ? <CaretUpOutlined /> : <CaretDownOutlined />}{' '}
//               {totalEarning && `${rateDifference.toFixed(2)}%`}
//             </S.ValueText>
//           </BaseCol>
//         </BaseRow>
//       </BaseCol>

//       <BaseCol span={24}>
//         <S.Text>{getCurrencyPrice(formatNumberWithCommas(latestRate ?? 0), CurrencyTypeEnum.USD)}</S.Text>
//       </BaseCol>

//       <BaseCol span={24}>
//         <BaseRow wrap={false} justify="space-between" gutter={[20, 20]}>
//           <BaseCol flex={1}>
//             <TotalEarningChart xAxisData={days} earningData={totalEarningData} />
//           </BaseCol>
//         </BaseRow>
//       </BaseCol>
//     </BaseRow>
//   </NFTCard>
// );
// };

// import React, { useEffect, useMemo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
// import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
// import { TotalEarningChart } from '@app/components/nft-dashboard/totalEarning/TotalEarningChart/TotalEarningChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import {
//   getTotalEarning,
//   getBitcoinRatesForLast30Days,
//   TotalEarning as ITotalEarning,
//   Earning,
// } from '@app/api/earnings.api';
// import { Dates } from '@app/constants/Dates';
// import { formatNumberWithCommas, getCurrencyPrice, getDifference } from '@app/utils/utils';
// import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
// import * as S from './TotalEarning.styles';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

// export const TotalEarning: React.FC = () => {
//   const [totalEarning, setTotalEarning] = useState<ITotalEarning | null>(null);
//   const [bitcoinRates, setBitcoinRates] = useState<Earning[]>([]);

//   const userId = useAppSelector((state) => state.user.user?.id);

//   const { t } = useTranslation();

//   useEffect(() => {
//     if (userId) {
//       getTotalEarning(userId, CurrencyTypeEnum.USD).then((res) => setTotalEarning(res));
//       getBitcoinRatesForLast30Days().then((res) => {
//         console.log('Bitcoin rates:', res);
//         setBitcoinRates(res);
//       });
//     }
//   }, [userId]);

//   const { totalEarningData, days } = useMemo(() => {
//     const earningData = {
//       data: bitcoinRates.map((item) => item.usd_value),
//     };
//     const daysData = bitcoinRates.map((item) => Dates.getDate(item.date).format('L LTS')); // Include time

//     console.log('Chart data:', earningData);
//     console.log('Days:', daysData);

//     return {
//       totalEarningData: earningData,
//       days: daysData,
//     };
//   }, [bitcoinRates]);

//   // Determine if the current Bitcoin rate has increased compared to the previous rate
//   const latestRate = bitcoinRates[bitcoinRates.length - 1]?.usd_value;
//   const previousRate = bitcoinRates[bitcoinRates.length - 2]?.usd_value;
//   const isIncreased = latestRate > previousRate;
//   const rateDifference = latestRate && previousRate ? ((latestRate - previousRate) / previousRate) * 100 : 0;

//   console.log(`latestRate: ${latestRate} previousRate: ${previousRate}`);
//   console.log(`Rate difference: ${rateDifference}`);

//   return (
//     <NFTCard isSider>
//       <BaseRow gutter={[14, 14]}>
//         <BaseCol span={24}>
//           <BaseRow wrap={false} justify="space-between">
//             <BaseCol>
//               <S.Title level={2}>{t('nft.bitcoinPrice')}</S.Title>
//             </BaseCol>

//             <BaseCol>
//               <S.ValueText $color={isIncreased ? 'success' : 'error'}>
//                 {isIncreased ? <CaretUpOutlined /> : <CaretDownOutlined />}{' '}
//                 {totalEarning && `${rateDifference.toFixed(2)}%`}
//               </S.ValueText>
//             </BaseCol>
//           </BaseRow>
//         </BaseCol>

//         <BaseCol span={24}>
//           <BaseRow wrap={false} justify="space-between" gutter={[20, 20]}>
//             <BaseCol>
//               <S.Text>{getCurrencyPrice(formatNumberWithCommas(latestRate ?? 0), CurrencyTypeEnum.USD)}</S.Text>
//             </BaseCol>

//             <BaseCol flex={1}>
//               <TotalEarningChart xAxisData={days} earningData={totalEarningData} />
//             </BaseCol>
//           </BaseRow>
//         </BaseCol>
//       </BaseRow>
//     </NFTCard>
//   );
// };

// import React, { useEffect, useMemo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
// import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
// import { TotalEarningChart } from '@app/components/nft-dashboard/totalEarning/TotalEarningChart/TotalEarningChart';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import {
//   getTotalEarning,
//   getBitcoinRatesForLast30Days,
//   TotalEarning as ITotalEarning,
//   Earning,
// } from '@app/api/earnings.api';
// import { Dates } from '@app/constants/Dates';
// import { formatNumberWithCommas, getCurrencyPrice, getDifference } from '@app/utils/utils';
// import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
// import * as S from './TotalEarning.styles';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

// export const TotalEarning: React.FC = () => {
//   const [totalEarning, setTotalEarning] = useState<ITotalEarning | null>(null);
//   const [bitcoinRates, setBitcoinRates] = useState<Earning[]>([]);

//   const userId = useAppSelector((state) => state.user.user?.id);

//   const { t } = useTranslation();

//   useEffect(() => {
//     if (userId) {
//       getTotalEarning(userId, CurrencyTypeEnum.USD).then((res) => setTotalEarning(res));
//       getBitcoinRatesForLast30Days().then((res) => {
//         console.log('Bitcoin rates:', res);
//         setBitcoinRates(res);
//       });
//     }
//   }, [userId]);

//   const { totalEarningData, days } = useMemo(() => {
//     const earningData = {
//       data: bitcoinRates.map((item) => item.usd_value),
//     };
//     const daysData = bitcoinRates.map((item) => Dates.getDate(item.date).format('L LTS')); // Include time

//     console.log('Chart data:', earningData);
//     console.log('Days:', daysData);

//     return {
//       totalEarningData: earningData,
//       days: daysData,
//     };
//   }, [bitcoinRates]);

//   // Determine if the current Bitcoin rate has increased compared to the previous rate
//   const latestRate = bitcoinRates[bitcoinRates.length - 1]?.usd_value;
//   const previousRate = bitcoinRates[bitcoinRates.length - 2]?.usd_value;
//   const isIncreased = latestRate > previousRate;
//   const rateDifference = latestRate && previousRate ? ((latestRate - previousRate) / previousRate) * 100 : 0;

//   console.log(`latestRate: ${latestRate} previousRate: ${previousRate}`);
//   console.log(`Rate difference: ${rateDifference}`);

//   return (
//     <NFTCard isSider>
//       <BaseRow gutter={[14, 14]}>
//         <BaseCol span={24}>
//           <BaseRow wrap={false} justify="space-between">
//             <BaseCol>
//               <S.Title level={2}>{t('nft.bitcoinPrice')}</S.Title>
//             </BaseCol>

//             <BaseCol>
//               <S.ValueText $color={isIncreased ? 'success' : 'error'}>
//                 {isIncreased ? <CaretUpOutlined /> : <CaretDownOutlined />}{' '}
//                 {totalEarning && `${rateDifference.toFixed(2)}%`}
//               </S.ValueText>
//             </BaseCol>
//           </BaseRow>
//         </BaseCol>

//         <BaseCol span={24}>
//           <BaseRow wrap={false} justify="space-between" gutter={[20, 20]}>
//             <BaseCol>
//               <S.Text>{getCurrencyPrice(formatNumberWithCommas(latestRate ?? 0), CurrencyTypeEnum.USD)}</S.Text>
//             </BaseCol>

//             <BaseCol flex={1}>
//               <TotalEarningChart xAxisData={days} earningData={totalEarningData} />
//             </BaseCol>
//           </BaseRow>
//         </BaseCol>
//       </BaseRow>
//     </NFTCard>
//   );
// };
