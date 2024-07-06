import styled from 'styled-components';
import { Switch as AntdSwitch } from 'antd';

export const Switch = styled(AntdSwitch)`
  &.ant-switch[aria-checked='false'] {
    background-image: linear-gradient(to right, var(--disabled-color), var(--disabled-color)),
      linear-gradient(to right, var(--background-color), var(--background-color));
  }
  &.ant-switch[aria-checked='false'].balanceSwitch {
    background-image: linear-gradient(to right, #f2a900, #f2a900),
      linear-gradient(to right, var(--background-color), var(--background-color));
  }
  &.ant-switch[aria-checked='false'].modeSwitch {
    background-image: linear-gradient(to right, red, red),
      linear-gradient(to right, var(--background-color), var(--background-color));
  }
`;
