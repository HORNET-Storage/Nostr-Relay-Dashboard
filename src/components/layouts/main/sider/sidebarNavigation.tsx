import React, { useMemo } from 'react';
import { DashboardOutlined, TableOutlined } from '@ant-design/icons';
import { ReactComponent as NestIcon } from '@app/assets/icons/hive.svg';
import { ReactComponent as BtcIcon } from '@app/assets/icons/btc.svg';
import { ReactComponent as StatsIcon } from '@app/assets/icons/stats.svg';
import { ReactComponent as StorageSettingsIcon } from '@app/assets/icons/storage-settings.svg';
import { useResponsive } from '@app/hooks/useResponsive';
import { ReactComponent as MediaIcon } from '@app/assets/icons/media.svg';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const useSidebarNavigation = (): SidebarNavigationItem[] => {
  const { isDesktop } = useResponsive();

  return useMemo(() => {
    const items: SidebarNavigationItem[] = [
      {
        title: 'common.nft-dashboard',
        key: 'nft-dashboard',
        url: '/',
        icon: <NestIcon />,
      },
      {
        title: 'common.relay-settings',
        key: 'relay-settings',
        url: '/relay-settings',
        icon: <StorageSettingsIcon />,
      },
      {
        title: 'common.media-manager',
        key: 'media-manager',
        url: '/media-manager',
        icon: <MediaIcon />,


      },
      {
        title: 'Nostr Statistics',
        key: 'dataTables',
        url: '/nostr-stats',
        icon: <StatsIcon />,
      },
    ];

    if (!isDesktop) {
      items.push({
        title: 'common.wallet',
        key: 'wallet',
        url: '/wallet',
        icon: <BtcIcon />,
      });
    }

    return items;
  }, [isDesktop]);
};
