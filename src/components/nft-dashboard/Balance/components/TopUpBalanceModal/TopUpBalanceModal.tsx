import React, { useEffect, useState } from 'react';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { TopUpDataProps } from '../../interfaces/interfaces';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import { AddressList } from '../AddressList/AddressList';
import axios from 'axios';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming these services exist
import { useDispatch } from 'react-redux';
import { useHandleLogout } from '@app/utils/authUtils';

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
  const dispatch = useDispatch();

  const handleLogout = useHandleLogout();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const token = readToken(); // Read the JWT token from local storage
      if (!token) {
        handleLogout();
        return;
      }

      axios
        .get(`${config.baseURL}/addresses`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Attach the JWT token to the request
          },
        })
        .then((response) => {
          setAddresses(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            handleLogout(); // Log out if token is invalid or expired
          } else {
            console.error('Error fetching addresses:', error);
          }
          setIsLoading(false);
        });
    }
  }, [isOpen, dispatch]);

  return (
    <BaseModal centered={true} width={500} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
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
// import config from '@app/config/config';

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
//       axios
//         .get(`${config.baseURL}/addresses`)
//         .then((response) => {
//           setAddresses(response.data);
//           setIsLoading(false);
//         })
//         .catch((error) => {
//           console.error('Error fetching addresses:', error);
//           setIsLoading(false);
//         });
//     }
//   }, [isOpen]);

//   return (
//     <BaseModal centered={true} width={500} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
//       <BaseSpin spinning={isLoading}>
//         <AddressList addresses={addresses} />
//       </BaseSpin>
//     </BaseModal>
//   );
// };
