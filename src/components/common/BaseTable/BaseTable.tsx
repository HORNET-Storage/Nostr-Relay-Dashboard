/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { TableProps } from 'antd';
import * as S from './BaseTable.styles';
import { TooltipProps } from 'antd/lib/tooltip';

export type BaseTableProps<T> = TableProps<T>;

const customSorterTooltip: TooltipProps = {
  title: 'Click to sort', // Static title
  placement: 'top',
  overlayClassName: 'custom-tooltip-class',
};

// TODO make generic!
export const BaseTable: React.FC<BaseTableProps<any>> = (props) => {
  return <S.Table {...props} showSorterTooltip={customSorterTooltip} />;
};
