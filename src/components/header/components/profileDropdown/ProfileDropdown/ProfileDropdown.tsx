import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './ProfileDropdown.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import adminAvatar from '@app/assets/logo-dark-512.png';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';

export const ProfileDropdown: React.FC = () => {
  const { isTablet } = useResponsive();
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  const admin = '';

  const getUserInitials = () => {
    if (!user) return 'Guest';
    const lastNameInitial = user.lastName ? user.lastName.charAt(0) : '';
    return `${admin} ${lastNameInitial}`;
  };

  const handleAvatarClick = () => {
    navigate('/');
  };

  return user ? (
    <div>
      <S.ProfileDropdownHeader as={BaseRow} gutter={[10, 10]} align="middle">
        <BaseCol>
          <BaseAvatar
            src={adminAvatar}
            alt="User"
            shape="circle"
            size={50}
            onClick={handleAvatarClick}
            style={{ cursor: 'pointer' }}
          />
        </BaseCol>
        {isTablet && (
          <BaseCol>
            <span>{getUserInitials()}</span>
          </BaseCol>
        )}
      </S.ProfileDropdownHeader>
      <ProfileOverlay />
    </div>
  ) : null;
};

// import React from 'react';
// import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { useResponsive } from '@app/hooks/useResponsive';
// import * as S from './ProfileDropdown.styles';
// import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
// import adminAvatar from '@app/assets/logo-dark-512.png';

// export const ProfileDropdown: React.FC = () => {
//   const { isTablet } = useResponsive();

//   const user = useAppSelector((state) => state.user.user);

//   const admin = 'Admin';

//   const getUserInitials = () => {
//     if (!user) return 'Guest';
//     const lastNameInitial = user.lastName ? user.lastName.charAt(0) : '';
//     return `${admin} ${lastNameInitial}`;
//   };

//   return user ? (
//     <BasePopover content={<ProfileOverlay />} trigger="click">
//       <S.ProfileDropdownHeader as={BaseRow} gutter={[10, 10]} align="middle">
//         <BaseCol>
//           <BaseAvatar src={adminAvatar} alt="User" shape="circle" size={50} />
//         </BaseCol>
//         {isTablet && (
//           <BaseCol>
//             <span>{getUserInitials()}</span>
//           </BaseCol>
//         )}
//       </S.ProfileDropdownHeader>
//     </BasePopover>
//   ) : null;
// };
