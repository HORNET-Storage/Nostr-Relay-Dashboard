import React from 'react';
import { DashboardOutlined, TableOutlined } from '@ant-design/icons';
import { ReactComponent as NestIcon } from '@app/assets/icons/hive.svg';
import { ReactComponent as BtcIcon } from '@app/assets/icons/btc.svg';
import { ReactComponent as StatsIcon } from '@app/assets/icons/stats.svg';
import { ReactComponent as StorageSettingsIcon } from '@app/assets/icons/storage-settings.svg';
import { useResponsive } from '@app/hooks/useResponsive';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const useSidebarNavigation = (): SidebarNavigationItem[] => {
  const { mobileOnly } = useResponsive();

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
      title: 'Storage Statistics',
      key: 'dataTables',
      url: '/data-tables',
      icon: <StatsIcon />,
    },
  ];

  if (mobileOnly) {
    items.push({
      title: 'common.wallet',
      key: 'wallet',
      url: '/balance',
      icon: <BtcIcon />,
    });
  }

  return items;
};
