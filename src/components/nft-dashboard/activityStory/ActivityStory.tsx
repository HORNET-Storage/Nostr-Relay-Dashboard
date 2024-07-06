import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActivityStoryItem from './ActivityStoryItem/ActivityStoryItem';
import { getUserActivities, WalletTransaction } from '@app/api/activity.api';
import * as S from './ActivityStory.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Modal } from 'antd';
import { ViewTransactions } from '@app/components/nft-dashboard/common/ViewAll/ViewTransactions';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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

  const prepareChartData = () => {
    const sortedStory = [...story].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const labels = sortedStory.map(item => new Date(item.date).toLocaleDateString());
    const amounts = sortedStory.map(item => {
      const amount = parseFloat(item.value);
      return isNaN(amount) ? 0 : amount;
    });
  
    return {
      labels,
      datasets: [
        {
          label: 'Transaction Amount',
          data: amounts,
          fill: true,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(75, 192, 192, 0.6)');
            gradient.addColorStop(1, 'rgba(75, 192, 192, 0.1)');
            return gradient;
          },
          borderColor: 'rgba(75, 192, 192, 1)',
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: 'rgba(255, 255, 255, 0.8)', // Lighter color for y-axis title
        },
        ticks: {
          font: {
            size: 12,
          },
          color: 'rgba(255, 255, 255, 0.6)', // Lighter color for y-axis ticks
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Lighter color for y-axis grid lines
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: 'rgba(255, 255, 255, 0.8)', // Lighter color for x-axis title
        },
        ticks: {
          font: {
            size: 12,
          },
          color: 'rgba(255, 255, 255, 0.6)', // Lighter color for x-axis ticks
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Lighter color for x-axis grid lines
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
          color: 'rgba(255, 255, 255, 0.8)', // Lighter color for legend labels
        },
      },
      tooltip: {
        // ... (keep the existing tooltip configuration)
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    hover: {
      mode: 'nearest' as const,
      intersect: true,
    },
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
        <div style={{ height: '400px', marginBottom: '20px' }}>
          <Line data={prepareChartData()} options={chartOptions} />
        </div>
        <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>
      </Modal>
      <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>
    </S.Wrapper>
  );
};


// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import ActivityStoryItem from './ActivityStoryItem/ActivityStoryItem';
// import { getUserActivities, WalletTransaction } from '@app/api/activity.api';
// import * as S from './ActivityStory.styles';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import { Modal } from 'antd';
// import { ViewTransactions } from '@app/components/nft-dashboard/common/ViewAll/ViewTransactions';
// import styled from 'styled-components';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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

//   const activityContent =
//     story.length > 0 ? (
//       story.map((item) => (
//         <BaseCol key={item.id} span={24}>
//           <ActivityStoryItem {...item} />
//         </BaseCol>
//       ))
//     ) : (
//       <S.EmptyState>{t('No transaction data')}</S.EmptyState>
//     );

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   const prepareChartData = () => {
//     const labels = story.map(item => new Date(item.date).toLocaleDateString());
//     const amounts = story.map(item => {
//       const amount = parseFloat(item.value);
//       return isNaN(amount) ? 0 : amount;
//     });
  
//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Transaction Amount',
//           data: amounts,
//           fill: true,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           pointBackgroundColor: 'rgba(75, 192, 192, 1)',
//           pointBorderColor: '#fff',
//           pointHoverBackgroundColor: '#fff',
//           pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
//         },
//       ],
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Amount',
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: 'Date',
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//       tooltip: {
//         callbacks: {
//           label: (context: any) => {
//             const value = context.raw;
//             if (typeof value === 'number') {
//               return value.toFixed(2);
//             } else if (typeof value === 'string') {
//               return value;
//             } else {
//               return 'N/A';
//             }
//           },
//         },
//       },
//     },
//   };

//   return (
//     <S.Wrapper>
//       <TitleContainer>
//         <S.Title level={2}>{t('nft.yourTransactions')}</S.Title>
//         <ViewTransactions style={{ color: 'var(--text-primary)' }} bordered={false} onClick={showModal}>
//           {t('nft.viewTransactions')}
//         </ViewTransactions>
//       </TitleContainer>

//       <Modal title="Your Transactions" open={isModalVisible} onCancel={handleCancel} footer={null} width={800}>
//         <div style={{ height: '400px', marginBottom: '20px' }}>
//           <Line data={prepareChartData()} options={chartOptions} />
//         </div>
//         <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>
//       </Modal>
//       <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>
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
