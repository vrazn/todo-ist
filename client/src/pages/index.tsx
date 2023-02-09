import React, { useCallback, useState } from 'react';
import { Row, Col, Card, Layout } from 'antd';

import { Header } from '@/components/atoms/Header';
import { Filter, LeftSider } from '@/components/atoms/LeftSider';
import { Footer } from '@/components/atoms/Footer';
import { TodoFormModal } from '@/components/atoms/TodoFormModal';

import { TodoList } from '@/components/molecules/TodoList';

import type { ITodo } from 'todo-list';

import styles from './styles.module.css';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<ITodo | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<Filter>('all');

  const onEditTodo = useCallback((todo: ITodo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedTodo(undefined);
    setIsModalOpen(false);
  }, []);

  return (
    <Layout hasSider className={styles.layout}>
      <LeftSider
        onMenuSelect={(info) => setFilter(info.key as Filter)}
        onPressAdd={() => setIsModalOpen(true)}
      />
      <Layout.Content className={styles.content}>
        <Header />
        <Row className={styles.row} justify="center">
          <Col
            xs={{ span: 23 }}
            sm={{ span: 23 }}
            md={{ span: 21 }}
            lg={{ span: 20 }}
            xl={{ span: 18 }}
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
  );
};

export default App;
