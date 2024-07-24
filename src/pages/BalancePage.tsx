import React, { useEffect } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Balance } from '@app/components/nft-dashboard/Balance/Balance';
import { TotalEarning } from '@app/components/nft-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/nft-dashboard/activityStory/ActivityStory';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useResponsive } from '@app/hooks/useResponsive';
import { useNavigate } from 'react-router-dom';

const BalancePage: React.FC = () => {
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();

  useEffect(() => { 
if(isDesktop) {
  navigate('/relay-dashbaoard');

    }
  }, [isDesktop]);
  return (
    <div
      style={{
        backgroundColor: 'var(--sider-background-color)',
        minHeight: '100vh',
        margin: '-0.75rem -1rem -3rem -1rem',
        padding: '1rem 1rem 3rem 1rem',
      }}
    >
      <PageTitle>Bitcoin Wallet</PageTitle>
      <BaseRow gutter={[20, 24]}>
        <BaseCol span={24}>
          <Balance />
        </BaseCol>
        <BaseCol span={24}>
          <TotalEarning />
        </BaseCol>
        <BaseCol span={24}>
          <ActivityStory />
        </BaseCol>
      </BaseRow>
    </div>
  );
};

export default BalancePage;
