import React from 'react';
import { Badge, Card, CardProps, Popconfirm, Space, Typography } from 'antd';
import {
  EditOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  CalendarTwoTone,
} from '@ant-design/icons';
import { red, green } from '@ant-design/colors';
import dayjs from 'dayjs';
import classNames from 'classnames';

import type { ITodo } from 'todo-list';

import styles from './styles.module.css';

const { Text } = Typography;

export interface ITodoItemProps {
  todo: ITodo;
  className?: CardProps['className'];
  onToggle: (todo: ITodo) => void;
  onEdit: (todo: ITodo) => void;
  onRemove: (todo: ITodo) => void;
}

const iconStyle: React.CSSProperties = {
  fontSize: 18,
};

const Item: React.FC<ITodoItemProps> = ({
  todo,
  className,
  onToggle,
  onEdit,
  onRemove,
}) => {
  return (
    <Card
      data-testid="todo-item"
      size="small"
      title={todo.title}
      className={classNames(className, { [styles['card-done']]: todo.isDone })}
      extra={
        !todo.isDone &&
        todo.isImportant && <Badge status="processing" color={red.primary} />
      }
      actions={[
        <CheckCircleOutlined
          key="toggle"
          style={
            todo.isDone ? { ...iconStyle, color: green.primary } : iconStyle
          }
          onClick={() => onToggle(todo)}
        />,
        <EditOutlined
          key="edit"
          style={iconStyle}
          onClick={() => onEdit(todo)}
        />,
        <Popconfirm
          key="delete"
          title="Are you sure to delete this task?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => onRemove(todo)}
        >
          <DeleteOutlined style={iconStyle} />
        </Popconfirm>,
      ]}
    >
      <Space size={'large'} direction="vertical">
        <Text italic={!todo.description}>
          {todo.description || 'No description'}
        </Text>
        <Space>
          <CalendarTwoTone />
          <Text>
            {todo.dueDate ? dayjs(todo.dueDate).format('DD/MM/YYYY') : 'N/A'}
          </Text>
        </Space>
      </Space>
    </Card>
  );
};

export const TodoItem = React.memo(Item);
