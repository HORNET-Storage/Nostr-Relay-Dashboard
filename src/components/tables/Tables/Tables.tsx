import React from 'react';
import EditableTable from '../editableTable/EditableTable';
import { useTranslation } from 'react-i18next';
import * as S from './Tables.styles';
import { useResponsive } from '@app/hooks/useResponsive';

export const Tables: React.FC = () => {
  const { isDesktop } = useResponsive();
  const { t } = useTranslation();
  return (
    <>
      <S.TablesWrapper>
        <S.Card
          id="editable-table"
          title={'Kinds Stats Table'}
          padding={isDesktop ? '1.25rem 1.25rem 1rem 1.25rem' : '1.25rem .5rem 1.25rem .5rem'}
        >
          <EditableTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

// import React from 'react';
// import { EditableTable } from '../editableTable/EditableTable';
// import { useTranslation } from 'react-i18next';
// import * as S from './Tables.styles';

// export const Tables: React.FC = () => {
//   const { t } = useTranslation();
//   return (
//     <>
//       <S.TablesWrapper>
//         <S.Card id="editable-table" title={'Kinds Stats Table'} padding="1.25rem 1.25rem 0">
//           <EditableTable />
//         </S.Card>
//       </S.TablesWrapper>
//     </>
//   );
// };
