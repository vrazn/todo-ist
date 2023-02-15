import React from 'react';
import { Button, Grid, Layout, Menu, MenuProps } from 'antd';
import {
  ProfileOutlined,
  ClockCircleOutlined,
  FileExclamationOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  FileAddOutlined,
} from '@ant-design/icons';

import styles from './styles.module.css';

export type Filter =
  | 'all'
  | 'today'
  | 'important'
  | 'uncompleted'
  | 'completed';

const items: MenuProps['items'] = [
  { key: 'all', icon: <ProfileOutlined />, label: 'All tasks' },
  { key: 'today', icon: <ClockCircleOutlined />, label: "Today's tasks" },
  {
    key: 'important',
    icon: <FileExclamationOutlined />,
    label: 'Important tasks',
  },
  {
    key: 'uncompleted',
    icon: <FileExcelOutlined />,
    label: 'Uncompleted tasks',
  },
  { key: 'completed', icon: <FileDoneOutlined />, label: 'Completed tasks' },
];

export interface ILeftSiderProps {
  onPressAdd: () => void;
  onMenuSelect: ({ key }: { key: string }) => void;
}

const Sider = ({ onPressAdd, onMenuSelect }: ILeftSiderProps) => {
  const screens = Grid.useBreakpoint();

  return (
    <Layout.Sider
      collapsed={!screens.lg}
      theme="light"
      width={300}
      className={styles.sider}
    >
      <div className={styles['button-container']}>
        <Button
          type="primary"
          size="large"
          block
          icon={<FileAddOutlined />}
          onClick={onPressAdd}
        >
          {!screens.lg ? '' : 'Add new task'}
        </Button>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['all']}
        items={items}
        onSelect={onMenuSelect}
      />
    </Layout.Sider>
  );
};

export const LeftSider = React.memo(Sider);
