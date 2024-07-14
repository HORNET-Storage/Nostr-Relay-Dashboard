import React, { useEffect, useState } from 'react';
import { Header } from '../../../header/Header';
import MainSider from '../sider/MainSider/MainSider';
import MainContent from '../MainContent/MainContent';
import { MainHeader } from '../MainHeader/MainHeader';
import * as S from './MainLayout.styles';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  MEDICAL_DASHBOARD_PATH,
  NFT_DASHBOARD_PATH,
  RELAY_SETTINGS_PATH,
  TABLES_PAGE_PATH,
} from '@app/components/router/AppRouter';
import { useResponsive } from '@app/hooks/useResponsive';
import { References } from '@app/components/common/References/References';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doLogout } from '@app/store/slices/authSlice';
import useIdleTimer from '@app/hooks/useIdleTimer';

const MainLayout: React.FC = () => {
  const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const { isDesktop } = useResponsive();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleSider = () => setSiderCollapsed(!siderCollapsed);

  useEffect(() => {
    setIsTwoColumnsLayout(
      [MEDICAL_DASHBOARD_PATH, NFT_DASHBOARD_PATH, RELAY_SETTINGS_PATH, TABLES_PAGE_PATH].includes(location.pathname) &&
        isDesktop,
    );
  }, [location.pathname, isDesktop]);

  const handleIdle = async () => {
    await dispatch(doLogout());
    navigate('/auth/login');
    window.location.reload(); // Reload the page after logging out
  };

  const duration_in_minutes = 60; // 60 minutes

  useIdleTimer(duration_in_minutes * 60 * 1000, handleIdle);
  useEffect(() => {
    if (!siderCollapsed) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [siderCollapsed]);

  return (
    <S.LayoutMaster>
      <MainSider isCollapsed={siderCollapsed} setCollapsed={setSiderCollapsed} />
      <S.LayoutMain>
        <MainHeader isTwoColumnsLayout={isTwoColumnsLayout}>
          <Header toggleSider={toggleSider} isSiderOpened={!siderCollapsed} isTwoColumnsLayout={isTwoColumnsLayout} />
        </MainHeader>
        <MainContent
          style={isDesktop ? { overflowY: 'hidden' } : { overflowY: 'auto' }}
          id="main-content"
          $isTwoColumnsLayout={isTwoColumnsLayout}
        >
          <div>
            <Outlet />
          </div>
          {!isTwoColumnsLayout && <References />}
        </MainContent>
      </S.LayoutMain>
    </S.LayoutMaster>
  );
};

export default MainLayout;

// import React, { useEffect, useState } from 'react';
// import { Header } from '../../../header/Header';
// import MainSider from '../sider/MainSider/MainSider';
// import MainContent from '../MainContent/MainContent';
// import { MainHeader } from '../MainHeader/MainHeader';
// import * as S from './MainLayout.styles';
// import { Outlet, useLocation } from 'react-router-dom';
// import { MEDICAL_DASHBOARD_PATH, NFT_DASHBOARD_PATH } from '@app/components/router/AppRouter';
// import { useResponsive } from '@app/hooks/useResponsive';
// import { References } from '@app/components/common/References/References';

// const MainLayout: React.FC = () => {
//   const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
//   const [siderCollapsed, setSiderCollapsed] = useState(true);
//   const { isDesktop } = useResponsive();
//   const location = useLocation();

//   const toggleSider = () => setSiderCollapsed(!siderCollapsed);

//   useEffect(() => {
//     setIsTwoColumnsLayout([MEDICAL_DASHBOARD_PATH, NFT_DASHBOARD_PATH].includes(location.pathname) && isDesktop);
//   }, [location.pathname, isDesktop]);

//   return (
//     <S.LayoutMaster>
//       <MainSider isCollapsed={siderCollapsed} setCollapsed={setSiderCollapsed} />
//       <S.LayoutMain>
//         <MainHeader isTwoColumnsLayout={isTwoColumnsLayout}>
//           <Header toggleSider={toggleSider} isSiderOpened={!siderCollapsed} isTwoColumnsLayout={isTwoColumnsLayout} />
//         </MainHeader>
//         <MainContent id="main-content" $isTwoColumnsLayout={isTwoColumnsLayout}>
//           <div>
//             <Outlet />
//           </div>
//           {!isTwoColumnsLayout && <References />}
//         </MainContent>
//       </S.LayoutMain>
//     </S.LayoutMaster>
//   );
// };

// export default MainLayout;
