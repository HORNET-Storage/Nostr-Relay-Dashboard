import React, { useState, useEffect } from "react";
import * as S from "./TieredFees.styles";
import { useResponsive } from "@app/hooks/useResponsive";

interface FeeRecommendation {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

type Tier = "low" | "med" | "high";

interface Fees {
  low: number;
  med: number;
  high: number;
}


// interface Fees {
//   [key in Tier]: number;
// }

interface TieredFeesProps {
  handleFeeChange: (fee: number) => void;
  invalidAmount: boolean;
  transactionSize: number | null; // Transaction size passed down from parent
  originalFeeRate?: number; // Optional original fee rate (used for replacements)
}

const DEFAULT_FEES: Fees = { low: 3, med: 4, high: 5 };

const TieredFees: React.FC<TieredFeesProps> = ({
  handleFeeChange,
  invalidAmount,
  transactionSize,
  originalFeeRate = 0,
}) => {
  const { isDesktop, isTablet } = useResponsive();
  const [selectedTier, setSelectedTier] = useState<Tier>("low");
  const [fees, setFees] = useState<Fees>(DEFAULT_FEES);
  const [estimatedFee, setEstimatedFee] = useState<Fees>({ low: 0, med: 0, high: 0 });
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [fetchedRecommendation, setFetchedRecommendation] = useState(false);

  // Adjust fees for replacement transactions if originalFeeRate > 0
  const adjustFees = (fetchedFees: Fees) => {
    if (originalFeeRate > 0) {
      const adjustedFees = { ...fetchedFees };
      adjustedFees.low = Math.max(originalFeeRate + 1, fetchedFees.low);
      adjustedFees.med = Math.max(adjustedFees.low + 1, fetchedFees.med);
      adjustedFees.high = Math.max(adjustedFees.med + 1, fetchedFees.high);
      return adjustedFees;
    }
    return fetchedFees;
  };

  useEffect(() => {
    if (loadingRecommendation || fetchedRecommendation) return;
    const fetchFees = async () => {
      setLoadingRecommendation(true);
      try {
        const response = await fetch("https://mempool.space/api/v1/fees/recommended");
        const data: FeeRecommendation = await response.json();
        const fetchedFees: Fees = {
          low: data.economyFee,
          med: data.halfHourFee,
          high: data.fastestFee,
        };
        const adjustedFees = adjustFees(fetchedFees);
        setFees(adjustedFees);
        setFetchedRecommendation(true);
      } catch (error) {
        console.error("Failed to fetch fees:", error);
        setFees(adjustFees(DEFAULT_FEES));
      }
      setLoadingRecommendation(false);
    };
    fetchFees();
  }, [originalFeeRate]);

  // Update estimated fees whenever the fees or transaction size change
  useEffect(() => {
    if (transactionSize) {
      setEstimatedFee({
        low: Math.ceil(transactionSize * fees.low),
        med: Math.ceil(transactionSize * fees.med),
        high: Math.ceil(transactionSize * fees.high),
      });
    }
  }, [fees, transactionSize]);

  const handleTierChange = (tier: Tier) => {
    setSelectedTier(tier);
  };

  useEffect(() => {
    handleFeeChange(fees[selectedTier]);
  }, [selectedTier, fees, handleFeeChange]);

  return (
    <S.TiersWrapper $isMobile={!isDesktop && !isTablet}>
      <S.TierCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange("low")}
        className={`tier-hover ${selectedTier === "low" ? "selected" : ""} ${
          selectedTier === "low" && invalidAmount ? "invalidAmount" : ""
        } `}
      >
        <S.TierCardContent>
          {`Low`}
          <br />
          {`Priority`}
          <S.RateValueWrapper>
            {`${fees.low}`} <br /> {`sat/vB`}
            <S.RateValue>{`${estimatedFee.low} Sats`}</S.RateValue> {/* Show estimated fee */}
          </S.RateValueWrapper>
        </S.TierCardContent>
      </S.TierCard>

      <S.TierCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange("med")}
        className={`tier-hover ${selectedTier === "med" ? "selected" : ""} ${
          selectedTier === "med" && invalidAmount ? "invalidAmount" : ""
        } `}
      >
        <S.TierCardContent>
          {`Medium`}
          <br />
          {`Priority`}
          <S.RateValueWrapper>
            {`${fees.med}`} <br /> {`sat/vB`}
            <S.RateValue>{`${estimatedFee.med} Sats`}</S.RateValue> {/* Show estimated fee */}
          </S.RateValueWrapper>
        </S.TierCardContent>
      </S.TierCard>

      <S.TierCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange("high")}
        className={`tier-hover ${selectedTier === "high" ? "selected" : ""} ${
          selectedTier === "high" && invalidAmount ? "invalidAmount" : ""
        } `}
      >
        <S.TierCardContent>
          {`High`}
          <br />
          {`Priority`}
          <S.RateValueWrapper>
            <span>
              {`${fees.high}`} <br /> {`sat/vB`}
            </span>
            <S.RateValue>{`${estimatedFee.high} Sats`}</S.RateValue> {/* Show estimated fee */}
          </S.RateValueWrapper>
        </S.TierCardContent>
      </S.TierCard>
    </S.TiersWrapper>
  );
};

export default TieredFees;