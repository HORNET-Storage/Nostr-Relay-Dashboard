import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tables } from '@app/components/tables/Tables/Tables';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { Balance } from '@app/components/relay-dashboard/Balance/Balance';
import { TotalEarning } from '@app/components/relay-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/relay-dashboard/transactions/Transactions';
const DataTablesPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  const desktopLayout = (
    <BaseRow>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
        <Tables />
      </S.LeftSideCol>
      <S.RightSideCol xl={8} xxl={7}>
        <div id="balance">
          <Balance />
        </div>
        <S.Space />
        <div id="total-earning">
          <TotalEarning />
        </div>
        <S.Space />
        <div id="activity-story">
          <ActivityStory />
        </div>
      </S.RightSideCol>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>{t('Nostr Statistics')}</PageTitle>
      {isDesktop ? (
        desktopLayout
      ) : (
        <>
          <Tables />
        </>
      )}
    </>
  );
};

export default DataTablesPage;
