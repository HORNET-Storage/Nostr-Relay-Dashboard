import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
const borderRad = '.5rem';
export const TablesWrapper = styled.div`
  margin-top: 1.875rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  .table-mobile > div.ant-card-head-title {
    padding-bottom: 0.3rem !important;
  }
  .ant-card-head-title {
    padding-bottom: 0rem !important;
  }
  .ant-table-tbody > tr > td {
    padding: 0.8rem;
  }

  div.ant-table.ant-table-bordered,
  div.ant-table-container,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table {
    border-radius: ${borderRad};
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: ${borderRad};
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: ${borderRad};
  }
  .ant-table-container table > tbody > tr:last-child td:last-child {
    border-bottom-right-radius: ${borderRad};
  }
  .ant-table-container table > tbody > tr:last-child td:first-child {
    border-bottom-left-radius: ${borderRad};
  }
`;
