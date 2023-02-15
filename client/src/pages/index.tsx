import React, { startTransition, useCallback, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Row, Col, Card, Layout, Spin } from 'antd';

import { Header } from '@/components/atoms/Header';
import {
  Filter,
  LeftSider,
  ILeftSiderProps,
} from '@/components/atoms/LeftSider';
import { Footer } from '@/components/atoms/Footer';

import { TodoList } from '@/components/molecules/TodoList';

const TodoFormModal = dynamic(
  () =>
    import('../components/atoms/TodoFormModal').then(
      (module) => module.TodoFormModal,
    ),
  { loading: () => <Spin /> },
);

import type { ITodo } from 'todo-list';

import styles from './styles.module.css';

const columns = {
  xs: { span: 23 },
  sm: { span: 23 },
  md: { span: 21 },
  lg: { span: 20 },
  xl: { span: 18 },
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<ITodo | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<Filter>('all');

  const onMenuSelect = useCallback<ILeftSiderProps['onMenuSelect']>((info) => {
    setFilter(info.key as Filter);
  }, []);

  const onEditTodo = useCallback((todo: ITodo) => {
    startTransition(() => {
      setSelectedTodo(todo);
      setIsModalOpen(true);
    });
  }, []);

  const openModal = useCallback(() => {
    startTransition(() => {
      setIsModalOpen(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setSelectedTodo(undefined);
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <Head>
        <title>To-do List</title>
        <meta name="description" content="To-do List" />
      </Head>
      <Layout hasSider className={styles.layout}>
        <LeftSider onMenuSelect={onMenuSelect} onPressAdd={openModal} />
        <Layout.Content className={styles.content}>
          <Header />
          <Row className={styles.row} justify="center">
            <Col
              xs={columns.xs}
              sm={columns.sm}
              md={columns.md}
              lg={columns.lg}
              xl={columns.xl}
            >
              <Card>
                <TodoList filter={filter} onEdit={onEditTodo} />
              </Card>
            </Col>
          </Row>
          <Footer />
        </Layout.Content>
        <TodoFormModal
          open={isModalOpen}
          initialState={selectedTodo}
          onCancel={closeModal}
        />
      </Layout>
    </>
  );
};

export default App;
