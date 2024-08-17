import React, { useEffect, useState } from 'react';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { TopUpDataProps } from '../../interfaces/interfaces';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import { AddressList } from '../AddressList/AddressList';
import axios from 'axios';
import config from '@app/config/config';

interface TopUpBalanceModalProps extends TopUpDataProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

interface Address {
  index: string;
  address: string;
}

export const TopUpBalanceModal: React.FC<TopUpBalanceModalProps> = ({
  cards,
  loading,
  isOpen,
  onOpenChange,
  onFinish,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      axios
        .get(`${config.baseURL}/addresses`)
        .then((response) => {
          setAddresses(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching addresses:', error);
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  return (
    <BaseModal width={500} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
      <BaseSpin spinning={isLoading}>
        <AddressList addresses={addresses} />
      </BaseSpin>
    </BaseModal>
  );
};

// import React, { useEffect, useState } from 'react';
// import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
// import { TopUpDataProps } from '../../interfaces/interfaces';
// import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
// import { AddressList } from '../AddressList/AddressList';
// import axios from 'axios';

// interface TopUpBalanceModalProps extends TopUpDataProps {
//   isOpen: boolean;
//   onOpenChange: () => void;
// }

// interface Address {
//   index: string;
//   address: string;
// }

// export const TopUpBalanceModal: React.FC<TopUpBalanceModalProps> = ({
//   cards,
//   loading,
//   isOpen,
//   onOpenChange,
//   onFinish,
// }) => {
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (isOpen) {
//       setIsLoading(true);
//       axios.get('http://localhost:5000/addresses')
//         .then(response => {
//           setAddresses(response.data);
//           setIsLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching addresses:', error);
//           setIsLoading(false);
//         });
//     }
//   }, [isOpen]);

//   return (
//     <BaseModal width={500} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
//       <BaseSpin spinning={isLoading}>
//         <AddressList addresses={addresses} />
//       </BaseSpin>
//     </BaseModal>
//   );
// };

// import React, { useEffect, useState } from 'react';
// import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
// import { TopUpDataProps } from '../../interfaces/interfaces';
// import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
// import { AddressList } from '../AddressList/AddressList';
// import axios from 'axios';

// interface TopUpBalanceModalProps extends TopUpDataProps {
//   isOpen: boolean;
//   onOpenChange: () => void;
// }

// export const TopUpBalanceModal: React.FC<TopUpBalanceModalProps> = ({
//   cards,
//   loading,
//   isOpen,
//   onOpenChange,
//   onFinish,
// }) => {
//   const [addresses, setAddresses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (isOpen) {
//       axios.get('http://localhost:5000/addresses')
//         .then(response => {
//           setAddresses(response.data);
//           setIsLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching addresses:', error);
//           setIsLoading(false);
//         });
//     }
//   }, [isOpen]);

//   return (
//     <BaseModal width={500} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
//       <BaseSpin spinning={isLoading}>
//         <AddressList addresses={addresses} />
//       </BaseSpin>
//     </BaseModal>
//   );
// };

// import React from 'react';
// import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
// import { TopUpDataProps } from '../../interfaces/interfaces';
// import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
// import { TopUpBalanceForm } from '../TopUpBalanceForm/TopUpBalanceForm';

// interface TopUpBalanceModalProps extends TopUpDataProps {
//   isOpen: boolean;
//   onOpenChange: () => void;
// }

// export const TopUpBalanceModal: React.FC<TopUpBalanceModalProps> = ({
//   cards,
//   loading,
//   isOpen,
//   onOpenChange,
//   onFinish,
// }) => {
//   return (
//     <BaseModal width={500} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
//       <BaseSpin spinning={loading}>
//         <TopUpBalanceForm cards={cards} loading={loading} onFinish={onFinish} />
//       </BaseSpin>
//     </BaseModal>
//   );
// };
