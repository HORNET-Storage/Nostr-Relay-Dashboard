import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { FilterIcon } from '@app/components/common/icons/FilterIcon';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { NFTCardHeader } from '@app/components/relay-dashboard/common/NFTCardHeader/NFTCardHeader';
import { RecentActivityFilter } from '@app/components/relay-dashboard/recentActivity/recentActivityFilters/RecentActivityFilter';
import { RecentActivityFilterState } from '@app/components/relay-dashboard/recentActivity/RecentActivity';
import { useResponsive } from '@app/hooks/useResponsive';

interface RecentActivityHeaderProps {
  filters: RecentActivityFilterState;
  setFilters: (func: (state: RecentActivityFilterState) => RecentActivityFilterState) => void;
}

export const RecentActivityHeader: React.FC<RecentActivityHeaderProps> = ({ filters, setFilters }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  return (
    <>
      <NFTCardHeader title={t('nft.recentActivity')}>
        {!isDesktop && (
          <BaseButton size="large" noStyle type="text" icon={<FilterIcon />} onClick={() => setModalOpen(true)} />
        )}
      </NFTCardHeader>

      {!isDesktop && (
        <BaseModal open={isModalOpen} onCancel={() => setModalOpen(false)} footer={null}>
          <RecentActivityFilter filters={filters} setFilters={setFilters} />
        </BaseModal>
      )}
    </>
  );
};
