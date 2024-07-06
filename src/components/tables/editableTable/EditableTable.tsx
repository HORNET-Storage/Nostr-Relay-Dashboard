import React, { useState, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { Modal } from 'antd';
import { Line } from 'react-chartjs-2';
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
import useKindData from '@app/hooks/useKindData';
import useKindTrendData from '@app/hooks/useKindTrendData';
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface KindData {
  kindName: string;
  kindNumber: number;
  nip: string;
  description: string;
  totalSize: number;
}

const EditableTable: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { kindData: initialKindData, isLoading } = useKindData();
  const [sortedData, setSortedData] = useState<KindData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentKindNumber, setCurrentKindNumber] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
  const [sortField, setSortField] = useState<string>('totalSize');

  const { trendData, isLoading: isTrendLoading } = useKindTrendData(currentKindNumber || 0);

  useEffect(() => {
    if (initialKindData && initialKindData.length > 0) {
      const sorted = [...initialKindData].sort((a: KindData, b: KindData) => {
        if (sortField === 'totalSize') {
          return sortOrder === 'descend' ? b.totalSize - a.totalSize : a.totalSize - b.totalSize;
        } else if (sortField === 'nip') {
          return sortOrder === 'descend' ? b.nip.localeCompare(a.nip) : a.nip.localeCompare(b.nip);
        } else if (sortField === 'kindName') {
          return sortOrder === 'descend' ? b.kindName.localeCompare(a.kindName) : a.kindName.localeCompare(b.kindName);
        } else {
          return sortOrder === 'descend' ? b.kindNumber - a.kindNumber : a.kindNumber - b.kindNumber;
        }
      });
      setSortedData(sorted);
    } else {
      setSortedData([]);
    }
  }, [initialKindData, sortOrder, sortField]);

  const showModal = (kindNumber: number) => {
    setCurrentKindNumber(kindNumber);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentKindNumber(null);
  };

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortOrder(sorter.order);
    setSortField(sorter.field);
  };

  const columns = [
    {
      title: t('common.kindName'),
      dataIndex: 'kindName',
      width: '25%',
      editable: false,
      sorter: true,
      sortOrder: sortField === 'kindName' ? sortOrder : undefined,
    },
    {
      title: t('common.nip'),
      dataIndex: 'nip',
      width: '15%',
      editable: false,
      sorter: true,
      sortOrder: sortField === 'nip' ? sortOrder : undefined,
      responsive: ['lg'] as Breakpoint[],
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      width: '30%',
      editable: false,
      responsive: ['md'] as Breakpoint[],
    },
    {
      title: t('common.totalSize'),
      dataIndex: 'totalSize',
      width: '15%',
      editable: false,
      render: (text: number) => `${text.toFixed(3)} GB`, // Display GB with 3 decimal places
      sorter: true,
      sortOrder: sortField === 'totalSize' ? sortOrder : undefined,
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (_: string, record: any) => (
        <BaseSpace>
          <BaseButton size={'small'} type="ghost" onClick={() => showModal(record.kindNumber)}>
            {t('common.kindGraph')}
          </BaseButton>
        </BaseSpace>
      ),
    },
  ];

  const chartData = {
    labels: trendData ? trendData.map((data: any) => data.month) : [],
    datasets: [
      {
        label: currentKindNumber !== null ? `Kind ${currentKindNumber}` : 'No Data Available',
        data: trendData ? trendData.map((data: any) => data.totalSize) : [],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Size (GB)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw.toFixed(3)} GB`,
        },
      },
    },
  };

  return (
    <div>
      <BaseForm form={form} component={false}>
        {sortedData.length > 0 ? (
          <BaseTable
            bordered
            dataSource={sortedData}
            columns={columns}
            rowClassName="editable-row"
            pagination={false}
            loading={isLoading}
            onChange={handleChange}
          />
        ) : (
          <div>{'No Data Available'}</div>
        )}
      </BaseForm>
      <Modal
        title={`Kind ${currentKindNumber}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {isTrendLoading ? (
          <div>Loading...</div>
        ) : trendData && trendData.length > 0 ? (
          <div style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div>{t('common.noTrendDataAvailable')}</div>
        )}
      </Modal>
    </div>
  );
};

export default EditableTable;

// import React, { useState, useEffect } from 'react';
// import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import { useTranslation } from 'react-i18next';
// import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
// import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
// import { Modal } from 'antd';
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
// import useKindData from '@app/hooks/useKindData';
// import useKindTrendData from '@app/hooks/useKindTrendData';
// import { Breakpoint } from 'antd/lib/_util/responsiveObserve';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// interface KindData {
//   kindName: string;
//   kindNumber: number;
//   nip: string;
//   description: string;
//   totalSize: number;
// }

// const EditableTable: React.FC = () => {
//   const [form] = BaseForm.useForm();
//   const { t } = useTranslation();
//   const { kindData: initialKindData, isLoading } = useKindData();
//   const [sortedData, setSortedData] = useState<KindData[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [currentKindNumber, setCurrentKindNumber] = useState<number | null>(null);
//   const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
//   const [sortField, setSortField] = useState<string>('totalSize');

//   const { trendData, isLoading: isTrendLoading } = useKindTrendData(currentKindNumber || 0);

//   useEffect(() => {
//     if (initialKindData && initialKindData.length > 0) {
//       const sorted = [...initialKindData].sort((a: KindData, b: KindData) => {
//         if (sortField === 'totalSize') {
//           return sortOrder === 'descend' ? b.totalSize - a.totalSize : a.totalSize - b.totalSize;
//         } else if (sortField === 'nip') {
//           return sortOrder === 'descend' ? b.nip.localeCompare(a.nip) : a.nip.localeCompare(b.nip);
//         } else {
//           return sortOrder === 'descend' ? b.kindNumber - a.kindNumber : a.kindNumber - b.kindNumber;
//         }
//       });
//       setSortedData(sorted);
//     } else {
//       setSortedData([]);
//     }
//   }, [initialKindData, sortOrder, sortField]);

//   const showModal = (kindNumber: number) => {
//     setCurrentKindNumber(kindNumber);
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setCurrentKindNumber(null);
//   };

//   const handleChange = (pagination: any, filters: any, sorter: any) => {
//     setSortOrder(sorter.order);
//     setSortField(sorter.field);
//   };

//   const columns = [
//     {
//       title: t('common.kindName'),
//       dataIndex: 'kindName',
//       width: '25%',
//       editable: false,
//       sorter: {
//         compare: (a: KindData, b: KindData) => a.kindNumber - b.kindNumber,
//       },
//       sortOrder: sortField === 'kindNumber' ? sortOrder : undefined,
//     },
//     {
//       title: t('common.nip'),
//       dataIndex: 'nip',
//       width: '15%',
//       editable: false,
//       sorter: true,
//       sortOrder: sortField === 'nip' ? sortOrder : undefined,
//       responsive: ['lg'] as Breakpoint[],
//     },
//     {
//       title: t('common.description'),
//       dataIndex: 'description',
//       width: '30%',
//       editable: false,
//       responsive: ['md'] as Breakpoint[],
//     },
//     {
//       title: t('common.totalSize'),
//       dataIndex: 'totalSize',
//       width: '15%',
//       editable: false,
//       render: (text: number) => `${text.toFixed(3)} GB`, // Display GB with 3 decimal places
//       sorter: true,
//       sortOrder: sortField === 'totalSize' ? sortOrder : undefined,
//     },
//     {
//       title: t('tables.actions'),
//       dataIndex: 'actions',
//       width: '15%',
//       render: (_: string, record: any) => (
//         <BaseSpace>
//           <BaseButton type="ghost" onClick={() => showModal(record.kindNumber)}>
//             {t('common.kindGraph')}
//           </BaseButton>
//         </BaseSpace>
//       ),
//     },
//   ];

//   const chartData = {
//     labels: trendData ? trendData.map((data: any) => data.month) : [],
//     datasets: [
//       {
//         label: currentKindNumber !== null ? `Kind ${currentKindNumber}` : 'No Data Available',
//         data: trendData ? trendData.map((data: any) => data.totalSize) : [],
//         fill: true,
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         pointBackgroundColor: 'rgba(75, 192, 192, 1)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Total Size (GB)',
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: 'Month',
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//       tooltip: {
//         callbacks: {
//           label: (context: any) => `${context.raw.toFixed(3)} GB`,
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <BaseForm form={form} component={false}>
//         {sortedData.length > 0 ? (
//           <BaseTable
//             bordered
//             dataSource={sortedData}
//             columns={columns}
//             rowClassName="editable-row"
//             pagination={false}
//             loading={isLoading}
//             onChange={handleChange}
//           />
//         ) : (
//           <div>{'No Data Available'}</div>
//         )}
//       </BaseForm>
//       <Modal
//         title={`Kind ${currentKindNumber}`}
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         width={800}
//       >
//         {isTrendLoading ? (
//           <div>Loading...</div>
//         ) : trendData && trendData.length > 0 ? (
//           <div style={{ height: '400px' }}>
//             <Line data={chartData} options={chartOptions} />
//           </div>
//         ) : (
//           <div>{t('common.noTrendDataAvailable')}</div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default EditableTable;

// import React, { useState, useEffect } from 'react';
// import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import { useTranslation } from 'react-i18next';
// import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
// import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
// import { Modal } from 'antd';
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
// import useKindData from '@app/hooks/useKindData';
// import useKindTrendData from '@app/hooks/useKindTrendData';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// interface KindData {
//   kindName: string;
//   kindNumber: number;
//   nip: string;
//   description: string;
//   totalSize: number;
// }

// const EditableTable: React.FC = () => {
//   const [form] = BaseForm.useForm();
//   const { t } = useTranslation();
//   const { kindData: initialKindData, isLoading } = useKindData();
//   const [sortedData, setSortedData] = useState<KindData[]>(initialKindData);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [currentKindNumber, setCurrentKindNumber] = useState<number | null>(null);
//   const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
//   const [sortField, setSortField] = useState<string>('totalSize');

//   const { trendData, isLoading: isTrendLoading } = useKindTrendData(currentKindNumber || 0);

//   useEffect(() => {
//     const sorted = [...initialKindData].sort((a: KindData, b: KindData) => {
//       if (sortField === 'totalSize') {
//         return sortOrder === 'descend' ? b.totalSize - a.totalSize : a.totalSize - b.totalSize;
//       } else if (sortField === 'nip') {
//         return sortOrder === 'descend' ? b.nip.localeCompare(a.nip) : a.nip.localeCompare(b.nip);
//       } else {
//         return sortOrder === 'descend' ? b.kindNumber - a.kindNumber : a.kindNumber - b.kindNumber;
//       }
//     });
//     setSortedData(sorted);
//   }, [initialKindData, sortOrder, sortField]);

//   const showModal = (kindNumber: number) => {
//     setCurrentKindNumber(kindNumber);
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setCurrentKindNumber(null);
//   };

//   const handleChange = (pagination: any, filters: any, sorter: any) => {
//     setSortOrder(sorter.order);
//     setSortField(sorter.field);
//   };

//   const columns = [
//     {
//       title: t('common.kindName'),
//       dataIndex: 'kindName',
//       width: '25%',
//       editable: false,
//       sorter: {
//         compare: (a: KindData, b: KindData) => a.kindNumber - b.kindNumber,
//       },
//       sortOrder: sortField === 'kindNumber' ? sortOrder : undefined,
//     },
//     {
//       title: t('common.nip'),
//       dataIndex: 'nip',
//       width: '15%',
//       editable: false,
//       sorter: true,
//       sortOrder: sortField === 'nip' ? sortOrder : undefined,
//     },
//     {
//       title: t('common.description'),
//       dataIndex: 'description',
//       width: '30%',
//       editable: false,
//     },
//     {
//       title: t('common.totalSize'),
//       dataIndex: 'totalSize',
//       width: '15%',
//       editable: false,
//       render: (text: number) => `${text.toFixed(3)} GB`, // Display GB with 3 decimal places
//       sorter: true,
//       sortOrder: sortField === 'totalSize' ? sortOrder : undefined,
//     },
//     {
//       title: t('tables.actions'),
//       dataIndex: 'actions',
//       width: '15%',
//       render: (_: string, record: any) => (
//         <BaseSpace>
//           <BaseButton type="ghost" onClick={() => showModal(record.kindNumber)}>
//             {t('common.kindGraph')}
//           </BaseButton>
//         </BaseSpace>
//       ),
//     },
//   ];

//   const chartData = {
//     labels: trendData.map((data: any) => data.month),
//     datasets: [
//       {
//         label: `Kind ${currentKindNumber}`,
//         data: trendData.map((data: any) => data.totalSize),
//         fill: true,
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         pointBackgroundColor: 'rgba(75, 192, 192, 1)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Total Size (GB)',
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: 'Month',
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//       tooltip: {
//         callbacks: {
//           label: (context: any) => `${context.raw.toFixed(3)} GB`,
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <BaseForm form={form} component={false}>
//         <BaseTable
//           bordered
//           dataSource={sortedData}
//           columns={columns}
//           rowClassName="editable-row"
//           pagination={false}
//           loading={isLoading}
//           scroll={{ x: 800 }}
//           onChange={handleChange}
//         />
//       </BaseForm>
//       <Modal
//         title={`Kind ${currentKindNumber} Trend`}
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         width={800}
//       >
//         {isTrendLoading ? (
//           <div>Loading...</div>
//         ) : (
//           <div style={{ height: '400px' }}>
//             <Line data={chartData} options={chartOptions} />
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default EditableTable;
