import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
import { TopUpBalanceButton } from './components/TopUpBalanceButton/TopUpBalanceButton';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import * as S from './Balance.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import useBalanceData from '@app/hooks/useBalanceData';
import { formatBalance } from '@app/utils/balanceFormatter';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch'; // Import BaseSwitch
import SendButton from './components/SendButton/SendButton';

export const Balance: React.FC = () => {
  const { balanceData, transactions, isLoading } = useBalanceData();
  const [displayUSD, setDisplayUSD] = useState(true); // State to toggle between USD and SATs

  const userId = useAppSelector((state) => state.user.user?.id);

  const { t } = useTranslation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSwitchChange = () => {
    setDisplayUSD(!displayUSD);
  };

  return (
    <BaseRow>
      <BaseCol span={24}>
        <S.TitleText level={2}>{t('nft.yourBalance')}</S.TitleText>
      </BaseCol>

      <BaseCol span={24}>
        <NFTCard isSider>
          <BaseRow justify="space-between" align={'middle'}>
            <BaseCol>
              <S.TitleBalanceText level={3}>
                {displayUSD
                  ? balanceData &&
                    getCurrencyPrice(formatNumberWithCommas(balanceData.balance_usd), CurrencyTypeEnum.USD, false)
                  : balanceData && formatBalance(balanceData.latest_balance ?? 0)}
              </S.TitleBalanceText>
            </BaseCol>

            <BaseCol>
              <BaseSwitch className="balanceSwitch" checked={displayUSD} onChange={handleSwitchChange} />
              <S.LabelSpan>{displayUSD ? 'USD' : 'Sats'}</S.LabelSpan>
            </BaseCol>
          </BaseRow>

          <BaseRow gutter={[30, 30]}>
            <BaseCol span={24}>
              <BaseRow gutter={[14, 14]}>
                <BaseCol span={24}>
                  <S.SubtitleBalanceText>
                    {displayUSD
                      ? balanceData && formatBalance(balanceData.latest_balance ?? 0)
                      : balanceData &&
                        getCurrencyPrice(formatNumberWithCommas(balanceData.balance_usd), CurrencyTypeEnum.USD, false)}
                  </S.SubtitleBalanceText>
                </BaseCol>
              </BaseRow>
            </BaseCol>

            <BaseCol span={24}>
              <TopUpBalanceButton />
            </BaseCol>
            <BaseCol span={24}>
              <SendButton />
            </BaseCol>
          </BaseRow>
        </NFTCard>
      </BaseCol>
    </BaseRow>
  );
};

// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
// import { TopUpBalanceButton } from './components/TopUpBalanceButton/TopUpBalanceButton';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
// import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
// import * as S from './Balance.styles';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import useBalanceData from '@app/hooks/useBalanceData';
// import { formatBalance } from '@app/utils/balanceFormatter';
// import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch'; // Import BaseSwitch

// export const Balance: React.FC = () => {
//   const { balanceData, transactions, isLoading } = useBalanceData();
//   const [displayUSD, setDisplayUSD] = useState(true); // State to toggle between USD and SATs

//   const userId = useAppSelector((state) => state.user.user?.id);

//   const { t } = useTranslation();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   const handleSwitchChange = () => {
//     setDisplayUSD(!displayUSD);
//   };

//   return (
//     <BaseRow>
//       <BaseCol span={24}>
//         <S.TitleText level={2}>{t('nft.yourBalance')}</S.TitleText>
//       </BaseCol>

//       <BaseCol span={24}>
//         <NFTCard isSider>
//           <BaseRow justify="space-between">
//             <BaseCol>
//               <S.TitleBalanceText level={3}>
//                 {displayUSD
//                   ? balanceData && getCurrencyPrice(formatNumberWithCommas(balanceData.balance_usd), CurrencyTypeEnum.USD)
//                   : balanceData && formatBalance(balanceData.latest_balance ?? 0)}
//               </S.TitleBalanceText>
//             </BaseCol>

//             <BaseCol>
//               <BaseSwitch checked={displayUSD} onChange={handleSwitchChange} />
//               <S.LabelSpan>{displayUSD ? 'USD' : 'Sats'}</S.LabelSpan>
//             </BaseCol>
//           </BaseRow>

//           <BaseRow gutter={[30, 30]}>
//             <BaseCol span={24}>
//               <BaseRow gutter={[14, 14]}>
//                 <BaseCol span={24}>
//                   <S.SubtitleBalanceText>
//                     {displayUSD
//                       ? balanceData && formatBalance(balanceData.latest_balance ?? 0)
//                       : balanceData && getCurrencyPrice(formatNumberWithCommas(balanceData.balance_usd), CurrencyTypeEnum.USD)}
//                   </S.SubtitleBalanceText>
//                 </BaseCol>
//               </BaseRow>
//             </BaseCol>

//             <BaseCol span={24}>
//               <TopUpBalanceButton />
//             </BaseCol>
//           </BaseRow>
//         </NFTCard>
//       </BaseCol>
//     </BaseRow>
//   );
// };
