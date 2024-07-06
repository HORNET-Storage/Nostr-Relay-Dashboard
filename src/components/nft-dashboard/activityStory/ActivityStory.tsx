import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActivityStoryItem from './ActivityStoryItem/ActivityStoryItem';
import { getUserActivities, WalletTransaction } from '@app/api/activity.api';
import * as S from './ActivityStory.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Modal } from 'antd';
import { ViewTransactions } from '@app/components/nft-dashboard/common/ViewAll/ViewTransactions';
import styled from 'styled-components';

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const ActivityStory: React.FC = () => {
  const [story, setStory] = useState<WalletTransaction[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    getUserActivities().then((res) => setStory(res));
  }, []);

  const activityContent =
    story.length > 0 ? (
      story.map((item) => (
        <BaseCol key={item.id} span={24}>
          <ActivityStoryItem {...item} />
        </BaseCol>
      ))
    ) : (
      <S.EmptyState>{t('No transaction data')}</S.EmptyState>
    );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <S.Wrapper>
      <TitleContainer>
        <S.Title level={2}>{t('nft.yourTransactions')}</S.Title>
        <ViewTransactions style={{ color: 'var(--text-primary)' }} bordered={false} onClick={showModal}>
          {t('nft.viewTransactions')}
        </ViewTransactions>
      </TitleContainer>

      <Modal title="Your Transactions" open={isModalVisible} onCancel={handleCancel} footer={null} width={800}>
        <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>
      </Modal>
      <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>
    </S.Wrapper>
  );
};

// import React, { useEffect, useMemo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import ActivityStoryItem from './ActivityStoryItem/ActivityStoryItem';
// import { WalletTransaction, getUserActivities } from '@app/api/activity.api';
// import * as S from './ActivityStory.styles';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import { Modal } from 'antd';
// import { ViewTransactions } from '@app/components/nft-dashboard/common/ViewAll/ViewTransactions';
// import styled from 'styled-components';

// const TitleContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   width: 100%;
// `;

// export const ActivityStory: React.FC = () => {
//   const [story, setStory] = useState<WalletTransaction[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const { t } = useTranslation();

//   useEffect(() => {
//     getUserActivities().then((res) => setStory(res));
//   }, []);

//   const activityStory = useMemo(
//     () =>
//       story.map((item) => (
//         <BaseCol key={item.id} span={24}>
//           <ActivityStoryItem {...item} />
//         </BaseCol>
//       )),
//     [story],
//   );

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <S.Wrapper>
//       <TitleContainer>
//         <S.Title level={2}>{t('nft.yourTransactions')}</S.Title>
//         <ViewTransactions style={{ color: 'var(--text-primary' }} bordered={false} onClick={showModal}>
//           {t('nft.viewTransactions')}
//         </ViewTransactions>
//       </TitleContainer>

//       <Modal title="Your Transactions" open={isModalVisible} onCancel={handleCancel} footer={null} width={800}>
//         <S.ActivityRow gutter={[26, 26]}>{activityStory}</S.ActivityRow>
//       </Modal>
//       <S.ActivityRow gutter={[26, 26]}>{activityStory}</S.ActivityRow>
//     </S.Wrapper>
//   );
// };

// import React, { useEffect, useMemo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import ActivityStoryItem from './ActivityStoryItem/ActivityStoryItem';
// import { WalletTransaction, getUserActivities } from '@app/api/activity.api';
// import * as S from './ActivityStory.styles';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import { Modal } from 'antd';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import styled, { css } from 'styled-components';

// // Define TopUpButton with the desired styling
// export const TopUpButton = styled(BaseButton)`
//   ${(props) =>
//     props.type === 'ghost' &&
//     css`
//       color: var(--text-secondary-color);
//     `};
// `;

// const TitleContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   width: 100%;
// `;

// export const ActivityStory: React.FC = () => {
//   const [story, setStory] = useState<WalletTransaction[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const { t } = useTranslation();

//   useEffect(() => {
//     getUserActivities().then((res) => setStory(res));
//   }, []);

//   const activityStory = useMemo(
//     () =>
//       story.map((item) => (
//         <BaseCol key={item.id} span={24}>
//           <ActivityStoryItem {...item} />
//         </BaseCol>
//       )),
//     [story],
//   );

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <S.Wrapper>
//       <TitleContainer>
//         <S.Title level={2}>{t('nft.yourTransactions')}</S.Title>
//         <TopUpButton type="ghost" onClick={showModal}>
//           View Transactions
//         </TopUpButton>
//       </TitleContainer>

//       <Modal title="Your Transactions" open={isModalVisible} onCancel={handleCancel} footer={null} width={800}>
//         <S.ActivityRow gutter={[26, 26]}>{activityStory}</S.ActivityRow>
//       </Modal>
//       <S.ActivityRow gutter={[26, 26]}>{activityStory}</S.ActivityRow>
//     </S.Wrapper>
//   );
// };

// import React, { useEffect, useMemo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import ActivityStoryItem from './ActivityStoryItem/ActivityStoryItem';
// import { WalletTransaction, getUserActivities } from '@app/api/activity.api';
// import * as S from './ActivityStory.styles';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

// export const ActivityStory: React.FC = () => {
//   const [story, setStory] = useState<WalletTransaction[]>([]);

//   const { t } = useTranslation();

//   useEffect(() => {
//     getUserActivities().then((res) => setStory(res));
//   }, []);

//   const activityStory = useMemo(
//     () =>
//       story.map((item) => (
//         <BaseCol key={item.id} span={24}>
//           <ActivityStoryItem {...item} />
//         </BaseCol>
//       )),
//     [story],
//   );

//   return (
//     <S.Wrapper>
//       <S.Title level={2}>{t('nft.yourTransactions')}</S.Title>
//       <S.ActivityRow gutter={[26, 26]}>{activityStory}</S.ActivityRow>
//     </S.Wrapper>
//   );
// };
