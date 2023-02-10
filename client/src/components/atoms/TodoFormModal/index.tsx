import React, { useCallback, useEffect, useState } from 'react';
import {
  Form,
  Button,
  Input,
  DatePicker,
  Checkbox,
  Modal,
  message,
} from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useCreateTodo, usePatchTodo } from '@/components/hooks/todos';

import type { ITodo, ITodoCreationAttributes } from 'todo-list';

interface ITodoFormModalProps {
  open: boolean;
  initialState?: ITodo;
  onCancel: () => void;
}

export const TodoFormModal: React.FC<ITodoFormModalProps> = ({
  open,
  initialState,
  onCancel,
}) => {
  const { trigger: create } = useCreateTodo();
  const { trigger: patch } = usePatchTodo();

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<ITodoCreationAttributes>();

  const onSave = useCallback(() => form.submit(), [form]);

  const handleSubmit = async (todo: ITodoCreationAttributes) => {
    const formattedTodo = {
      ...todo,
      title: todo.title.trim(),
      description: todo.description?.trim(),
      dueDate: todo.dueDate
        ? dayjs(todo.dueDate).format('YYYY-MM-DD')
        : undefined,
    };

    setLoading(true);
    try {
      if (initialState) {
        await patch({ id: initialState.id, ...formattedTodo });
      } else {
        await create(formattedTodo);
      }
      onCancel();
    } catch (e) {
      message.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      destroyOnClose
      onCancel={onCancel}
      footer={[
        <Button
          key="save"
          type="primary"
          block
          loading={loading}
          onClick={onSave}
          icon={<CheckCircleOutlined />}
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        preserve={false}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: 'This field is required' },
            {
              type: 'string',
              whitespace: true,
              message: 'This field cannot be empty',
            },
            {
              type: 'string',
              max: 20,
              transform: (val: string) => val.trim(),
              message: 'This field cannot be longer than 20 characters',
            },
          ]}
          initialValue={initialState?.title}
        >
          <Input placeholder="What needs to be done?" />
        </Form.Item>
        <Form.Item
          label="Description (optional)"
          name="description"
          initialValue={initialState?.description}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Due Date (optional)"
          name="dueDate"
          initialValue={
            initialState?.dueDate ? dayjs(initialState.dueDate) : undefined
          }
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="isImportant"
          valuePropName="checked"
          initialValue={initialState?.isImportant || false}
        >
          <Checkbox defaultChecked={false}>Mark as important</Checkbox>
        </Form.Item>
        <Form.Item
          name="isDone"
          valuePropName="checked"
          initialValue={initialState?.isDone || false}
        >
          <Checkbox>Mark as complete</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};
