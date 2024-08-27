import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionItem from './TransactionItem/TransactionItem';
import { getUserActivities, WalletTransaction } from '@app/api/activity.api';
import * as S from './Transactions.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Modal } from 'antd';
import { ViewTransactions } from '@app/components/relay-dashboard/common/ViewAll/ViewTransactions';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { BaseSkeleton } from '@app/components/common/BaseSkeleton/BaseSkeleton';
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
import { TransactionCard } from './TransactionItem/TransactionItem.styles';

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
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    getUserActivities().then((res) => {
      setStory(res);
      setIsLoading(false);
    });
  }, []);

  const activityContent =
    story.length > 0 ? (
      story.map((item) => (
        <BaseCol key={item.id} span={24}>
          <TransactionItem {...item} />
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

  const TransactionSkeletons = () => {
    return (
      <>
        <BaseSkeleton>
          <BaseCol span={24}>
            <TransactionCard></TransactionCard>
          </BaseCol>
        </BaseSkeleton>
        <BaseSkeleton>
          <BaseCol span={24}>
            <TransactionCard></TransactionCard>
          </BaseCol>
        </BaseSkeleton>
      </>
    );
  };
  const prepareChartData = () => {
    const sortedStory = [...story]
      .filter((item) => {
        const amount = parseFloat(item.value);
        console.log(`Parsed amount: ${amount} for transaction ID: ${item.id}`);
        return amount > 0; // Filter only positive values
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    const labels = sortedStory.map((item) => new Date(item.date).toLocaleDateString());
    const amounts = sortedStory.map((item) => {
      const amount = parseFloat(item.value);
      return isNaN(amount) ? 0 : amount;
    });
  
    // Additional log to verify amounts array
    console.log('Chart Data Amounts:', amounts);
  
    return {
      labels,
      datasets: [
        {
          label: 'Transaction Amount',
          data: amounts, // Ensure this is correctly linked
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
        callbacks: {
          label: function (tooltipItem) {
            // Customize tooltip display
            return `Amount: ${tooltipItem.raw}`;  // Assuming that `tooltipItem.raw` holds the amount value
          },
        },
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
         {isLoading ? <TransactionSkeletons/> : <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>}
      </Modal>
      {isLoading ? <TransactionSkeletons/> : <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>}
    </S.Wrapper>
  );
};
