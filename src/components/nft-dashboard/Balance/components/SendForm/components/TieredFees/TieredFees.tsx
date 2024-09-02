import React, { useEffect, useState } from 'react';
import * as S from './TieredFees.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import { tiers } from '../../SendForm';

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
  // Define the props for your component here
  handleFeeChange: (fee: number) => void;
  inValidAmount: boolean;
}

const TieredFees: React.FC<TieredFeesProps> = ({ inValidAmount, handleFeeChange }) => {
  const { isDesktop } = useResponsive();
  const [fees, setFees] = useState<Fees>({ low: 0, med: 0, high: 0 });
  const [selectedTier, setSelectedTier] = useState<tiers | null>('low');

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await fetch('https://mempool.space/api/v1/fees/recommended');
        const data: FeeRecommendation = await response.json();
        console.log(data);
        setFees({
          low: data.economyFee,
          med: data.halfHourFee,
          high: data.fastestFee,
        });
      } catch (error) {
        console.error('Failed to fetch fees:', error);
      }
    };

    fetchFees();
  }, []);
  const handleTierChange = (tier: any) => {
    setSelectedTier(tier.id);
  };

  useEffect(() => {
    handleFeeChange(fees[selectedTier as tiers]);
  }, [selectedTier]);
  return (
    <>
      <S.TierCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange({ id: 'low', rate: fees.med })}
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
            <S.RateValue>{`${fees.low} Sats`}</S.RateValue>
          </S.RateValueWrapper>
        </S.TierCardContent>
      </S.TierCard>

      <S.TierCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange({ id: 'med', rate: fees.med })}
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
            <S.RateValue>{`${fees.med} Sats`}</S.RateValue>
          </S.RateValueWrapper>
        </S.TierCardContent>
      </S.TierCard>

      <S.TierCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange({ id: 'high', rate: fees.high })}
        className={`tier-hover ${selectedTier === 'high' ? 'selected' : ''} ${
          selectedTier === 'high' && inValidAmount ? 'invalidAmount' : ''
        } `}
      >
        <S.TierCardContent>
          <S.TierCardAmount>
            {' '}
            {`High`}
            <br />
            {`Priority`}
          </S.TierCardAmount>
          <S.RateValueWrapper>
            <span>{`${fees.high} sat/vB`}</span>
            <S.RateValue>{`${fees.high} Sats`}</S.RateValue>
          </S.RateValueWrapper>
        </S.TierCardContent>
      </S.TierCard>
    </>
  );
};

export default TieredFees;
