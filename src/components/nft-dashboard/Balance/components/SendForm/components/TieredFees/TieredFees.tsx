import React, { useEffect, useState } from 'react';
import * as S from './TieredFees.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import { tiers } from '../../SendForm';
import { set } from 'date-fns';

interface FeeRecommendation {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}
type Fees = {
  [key in tiers]: number;
};
interface TieredFeesProps {
  handleFeeChange: (fee: number) => void;
  inValidAmount: boolean;
  txSize: number | null; // Transaction size passed down from SendForm
}

const TieredFees: React.FC<TieredFeesProps> = ({ inValidAmount, handleFeeChange, txSize }) => {
  const { isDesktop, isTablet } = useResponsive();
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [fetchedrecommendation, setFetchedRecommendation] = useState(false);
  const [fees, setFees] = useState<Fees>({ low: 0, med: 0, high: 0 });
  const [selectedTier, setSelectedTier] = useState<tiers | null>('low');
  const [estimatedFee, setEstimatedFee] = useState({ low: 0, med: 0, high: 0 });

  useEffect(() => {
    if (loadingRecommendation || fetchedrecommendation) return;
    const fetchFees = async () => {
      setLoadingRecommendation(true);
      try {
        const response = await fetch('https://mempool.space/api/v1/fees/recommended');
        const data: FeeRecommendation = await response.json();
        setFees({
          low: data.economyFee,
          med: data.halfHourFee,
          high: data.fastestFee,
        });
        setFetchedRecommendation(true);
      } catch (error) {
        console.error('Failed to fetch fees:', error);
      }
      setLoadingRecommendation(false);
    };

    fetchFees();
  }, []);

  // Update estimated fees whenever the fees or transaction size change
  useEffect(() => {
    console.log('txSize:', txSize);
    console.log('fees:', fees);
    if (txSize) {
      setEstimatedFee({
        low: txSize * fees.low,
        med: txSize * fees.med,
        high: txSize * fees.high,
      });
    }
  }, [fees, txSize]);

  const handleTierChange = (tier: any) => {
    setSelectedTier(tier.id);
  };

  useEffect(() => {
    handleFeeChange(fees[selectedTier as tiers]);
  }, [selectedTier, fees]);

  return (
    <S.TiersWrapper $isMobile={!isDesktop || !isTablet}>
      <S.TierCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange({ id: 'low' })}
        className={`tier-hover ${selectedTier === 'low' ? 'selected' : ''} ${
          selectedTier === 'low' && inValidAmount ? 'invalidAmount' : ''
        } `}
      >
        <S.TierCardContent>
          {`Low`}
          <br />
          {`Priority`}
          <S.RateValueWrapper>
            <span>{`${fees.low} sat/vB`}</span>
            <S.RateValue>{`${estimatedFee.low} Sats`}</S.RateValue> {/* Show estimated fee */}
          </S.RateValueWrapper>
        </S.TierCardContent>
      </S.TierCard>

      <S.TierCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange({ id: 'med' })}
        className={`tier-hover ${selectedTier === 'med' ? 'selected' : ''} ${
          selectedTier === 'med' && inValidAmount ? 'invalidAmount' : ''
        } `}
      >
        <S.TierCardContent>
          {`Medium`}
          <br />
          {`Priority`}
          <S.RateValueWrapper>
            <span>{`${fees.med} sat/vB`}</span>
            <S.RateValue>{`${estimatedFee.med} Sats`}</S.RateValue> {/* Show estimated fee */}
          </S.RateValueWrapper>
        </S.TierCardContent>
      </S.TierCard>

      <S.TierCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange({ id: 'high' })}
        className={`tier-hover ${selectedTier === 'high' ? 'selected' : ''} ${
          selectedTier === 'high' && inValidAmount ? 'invalidAmount' : ''
        } `}
      >
        <S.TierCardContent>
          {`High`}
          <br />
          {`Priority`}
          <S.RateValueWrapper>
            <span>{`${fees.high} sat/vB`}</span>
            <S.RateValue>{`${estimatedFee.high} Sats`}</S.RateValue> {/* Show estimated fee */}
          </S.RateValueWrapper>
        </S.TierCardContent>
      </S.TierCard>
    </S.TiersWrapper>
  );
};

export default TieredFees;

// import React, { useEffect, useState } from 'react';
// import * as S from './TieredFees.styles';
// import { useResponsive } from '@app/hooks/useResponsive';
// import { tiers } from '../../SendForm';

// interface FeeRecommendation {
//   fastestFee: number;
//   halfHourFee: number;
//   hourFee: number;
//   economyFee: number;
//   minimumFee: number;
// }
// type Fees = {
//   [key in tiers]: number;
// };
// interface TieredFeesProps {
//   // Define the props for your component here
//   handleFeeChange: (fee: number) => void;
//   inValidAmount: boolean;
// }

// const TieredFees: React.FC<TieredFeesProps> = ({ inValidAmount, handleFeeChange }) => {
//   const { isDesktop, isTablet } = useResponsive();
//   const [fees, setFees] = useState<Fees>({ low: 0, med: 0, high: 0 });
//   const [selectedTier, setSelectedTier] = useState<tiers | null>('low');

//   useEffect(() => {
//     const fetchFees = async () => {
//       try {
//         const response = await fetch('https://mempool.space/api/v1/fees/recommended');
//         const data: FeeRecommendation = await response.json();
//         setFees({
//           low: data.economyFee,
//           med: data.halfHourFee,
//           high: data.fastestFee,
//         });
//       } catch (error) {
//         console.error('Failed to fetch fees:', error);
//       }
//     };

//     fetchFees();
//   }, []);
//   const handleTierChange = (tier: any) => {
//     console.log(tier);
//     setSelectedTier(tier.id);
//   };

//   useEffect(() => {
//     handleFeeChange(fees[selectedTier as tiers]);
//   }, [selectedTier]);
//   return (
//     <S.TiersWrapper $isMobile={!isDesktop || !isTablet }>
//       <S.TierCard
//         $isMobile={!isDesktop}
//         onClick={() => handleTierChange({ id: 'low', rate: fees.med })}
//         className={`tier-hover ${selectedTier === 'low' ? 'selected' : ''} ${
//           selectedTier === 'low' && inValidAmount ? 'invalidAmount' : ''
//         } `}
//       >
//         <S.TierCardContent>
//           {`Low`}
//           <br />
//           {`Priority`}
//           <S.RateValueWrapper>
//             <span>{`${fees.low} sat/vB`}</span>
//             <S.RateValue>{`${fees.low} Sats`}</S.RateValue>
//           </S.RateValueWrapper>
//         </S.TierCardContent>
//       </S.TierCard>

//       <S.TierCard
//         $isMobile={!isDesktop}
//         onClick={() => handleTierChange({ id: 'med', rate: fees.med })}
//         className={`tier-hover ${selectedTier === 'med' ? 'selected' : ''} ${
//           selectedTier === 'med' && inValidAmount ? 'invalidAmount' : ''
//         } `}
//       >
//         <S.TierCardContent>
//           {`Medium`}
//           <br />
//           {`Priority`}
//           <S.RateValueWrapper>
//             <span>{`${fees.med} sat/vB`}</span>
//             <S.RateValue>{`${fees.med} Sats`}</S.RateValue>
//           </S.RateValueWrapper>
//         </S.TierCardContent>
//       </S.TierCard>

//       <S.TierCard
//         $isMobile={!isDesktop}
//         onClick={() => handleTierChange({ id: 'high', rate: fees.high })}
//         className={`tier-hover ${selectedTier === 'high' ? 'selected' : ''} ${
//           selectedTier === 'high' && inValidAmount ? 'invalidAmount' : ''
//         } `}
//       >
//         <S.TierCardContent>
//           <S.TierCardAmount>
//             {' '}
//             {`High`}
//             <br />
//             {`Priority`}
//           </S.TierCardAmount>
//           <S.RateValueWrapper>
//             <span>{`${fees.high} sat/vB`}</span>
//             <S.RateValue>{`${fees.high} Sats`}</S.RateValue>
//           </S.RateValueWrapper>
//         </S.TierCardContent>
//       </S.TierCard>
//     </S.TiersWrapper>
//   );
// };

// export default TieredFees;
