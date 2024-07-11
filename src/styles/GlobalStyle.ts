import { createGlobalStyle } from 'styled-components';
import { resetCss } from './resetCss';
import { BREAKPOINTS, FONT_SIZE, FONT_WEIGHT, media } from './themes/constants';
import {
  lightThemeVariables,
  darkThemeVariables,
  commonThemeVariables,
  antOverrideCssVariables,
} from './themes/themeVariables';

export default createGlobalStyle`
  ${resetCss}

  [data-theme='light'],
  :root {
    ${lightThemeVariables}
  }

  [data-theme='dark'] {
    ${darkThemeVariables}
  }

  :root {
    ${commonThemeVariables};
    ${antOverrideCssVariables};
  } 

  [data-no-transition] * {
    transition: none !important;
  }

  * {
    scrollbar-width: none; 
    -ms-overflow-style: none; 

    &::-webkit-scrollbar {
      display: none; 
    }
  }
  
  .range-picker {
    & .ant-picker-panels {
      @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px) {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .search-overlay {
    box-shadow: var(--box-shadow);

    @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px)  {
      width: calc(100vw - 16px);
      max-width: 600px;
    }

    @media only screen and ${media.md} {
      width: 323px;
    }
  }

  a {
    color: var(--primary-color);
    &:hover,:active {
      color: var(--ant-primary-color-hover);
    }
  }
  
  .ant-picker-cell {
    color: var(--text-main-color);
  }

  .ant-picker-cell-in-view .ant-picker-calendar-date-value {
    color: var(--text-main-color);
    font-weight: ${FONT_WEIGHT.bold};
  }

  .ant-picker svg {
    color: var(--text-light-color);
  }

  .ant-notification-notice {
    width: 36rem;
    padding: 2rem;
    min-height: 6rem;
    
    .ant-notification-notice-with-icon .ant-notification-notice-message {
      margin-bottom: 0;
      margin-left: 2.8125rem;
    }

    .ant-notification-notice-with-icon .ant-notification-notice-description {
      margin-left: 4.375rem;
      margin-top: 0;
    }

    .ant-notification-notice-icon {
      font-size: 2.8125rem;
      margin-left: 0
    }

    .ant-notification-notice-close {
      top: 1.25rem;
      right: 1.25rem;
    }

    .ant-notification-notice-close-x {
      display: flex;
      font-size: 0.9375rem;
    }

    .notification-without-description {
      .ant-notification-notice-close {
        top: 1.875rem;
      }
      .ant-notification-notice-with-icon .ant-notification-notice-description  {
        margin-top: 0.625rem;
      }
    }
    
    .title {
      font-size: ${FONT_SIZE.xxl};
      height: 3rem;
      margin-left: 1.5rem;
      display: flex;
      align-items: center;
      font-weight: ${FONT_WEIGHT.bold};

      &.title-only {
        color: var(--text-main-color);
        font-size: ${FONT_SIZE.md};
        height: 2rem;
        line-height: 2rem;
        margin-left: 0.75rem;
        font-weight: ${FONT_WEIGHT.semibold};
      }
    }
  
    .description {
      color: #404040;
      font-size: ${FONT_SIZE.md};
      font-weight: ${FONT_WEIGHT.semibold};
      line-height: 1.375rem;
    }
  
    &.ant-notification-notice-success {
      border: 1px solid var(--success-color);
      background: var(--notification-success-color);
      
      .title {
        color: var(--success-color);
      }
    }
  
    &.ant-notification-notice-info {
      border: 1px solid var(--primary-color);
      background: var(--notification-primary-color);
  
      .title {
        color: var(--primary-color);
      }
    }
  
    &.ant-notification-notice-warning {
      border: 1px solid var(--warning-color);
      background: var(--notification-warning-color);
  
      .title {
        color: var(--warning-color);
      }
    }
  
    &.ant-notification-notice-error {
      border: 1px solid var(--error-color);
      background: var(--notification-error-color);
  
      .title {
        color: var(--error-color);
      }
    }
  
    .success-icon {
      color: var(--success-color);
    }
  
    .info-icon {
      color: var(--primary-color);
    }
  
    .warning-icon {
      color: var(--warning-color);
    }
  
    .error-icon {
      color: var(--error-color);
    }
  }
  
  .ant-menu-inline, .ant-menu-vertical {
    border-right: 0;
  }

  .custom-checkbox-group .ant-checkbox-inner, .protocol-checkbox-group .ant-checkbox-inner  {
    background-color: white;
    border-color: themeObject[theme].textMain;
}

    .custom-checkbox-group .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #1890ff; 
    border-color: #1890ff;
   }
    .custom-checkbox-group.blacklist-mode-active  .ant-checkbox-checked .ant-checkbox-inner{
    border-color: red;
    background-color: red;
    
    }
    
  .blacklist-mode-active .ant-checkbox .ant-checkbox-inner::after {
    content: "X"; /* Replace checkmark with X */
    background-color:red;
    font-weight: bold;
    color: white; /* Example color for the X */
    position: absolute;
     top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; 
    height: 100%; 
    text-align: center; 
}
    .custom-checkbox-group .blacklist-mode-active .ant-checkbox-checked .ant-checkbox-inner{
    background-color: red;
    border-color:red;
    
    }

  .custom-checkbox-group .ant-checkbox-group-item span label {
    font-size: .95rem;
  }
  .ant-checkbox-disabled .ant-checkbox-inner {
    background-color:gray;
    opacity:.75;
  }
  .antcheckbox-disabled{
  opacity:.75;
  }
  .checkboxHeader{
    padding: 0rem 0 1.4rem 0;
  }
  .grid-checkbox-group {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.8rem;
  }
  .grid-mobile-checkbox-group{
  display: grid;
  width:100%;
  grid-template-columns: repeat(auto-fill, minmax(7.3rem, 1fr));
  gap: 1.2rem;

  }

  .grid-checkbox-group.large-label {
    grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
  }
  .switch-container{
    padding-bottom: 1rem;
  }

  .w-full{
    width:100%;
  }

  .flex-col{
    display: flex;
    flex-direction: column;
  }

  .centered-header .ant-collapse-header {
    justify-content: center;
    padding-top: 10px;  
  }
    .custom-dropdown .ant-select-arrow{
    color: var(--text-nft-light-color)
    }
  .custom-tooltip-class .ant-tooltip-content .ant-tooltip-inner {
    background-color: rgba(0, 0, 0, 1);
  }
`;
