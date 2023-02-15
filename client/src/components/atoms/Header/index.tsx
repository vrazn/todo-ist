import {
  Col,
  Layout,
  Row,
  Space,
  Grid,
  Typography,
  Progress,
  Avatar,
} from 'antd';

import { useGetTodos } from '@/components/hooks/todos';

import styles from './styles.module.css';

const { Text } = Typography;

export const getProgressWidth = (
  screens: ReturnType<typeof Grid['useBreakpoint']>,
) => {
  if (screens.xxl) return 300;
  if (screens.xl) return 300;
  if (screens.lg) return 250;
  if (screens.md) return 250;
  if (screens.sm) return 200;
  if (screens.xs) return 100;
};

const columns = {
  xs: { span: 23 },
  sm: { span: 23 },
  md: { span: 21 },
  lg: { span: 20 },
  xl: { span: 18 },
};

export const Header = () => {
  const screens = Grid.useBreakpoint();

  const { todos, isLoading } = useGetTodos();

  const percent =
    !isLoading && todos?.length
      ? // Calculates the done / all ratio
        Math.round(
          (todos.reduce((acc, curr) => {
            if (curr.isDone) acc++;
            return acc;
          }, 0) /
            todos.length) *
            100,
        )
      : 0;

  return (
    <Layout.Header className={styles.header}>
      <Row justify="center">
        <Col
          xs={columns.xs}
          sm={columns.sm}
          md={columns.md}
          lg={columns.lg}
          xl={columns.xl}
        >
          <Row justify="end" align="middle">
            <Space size="large" direction="horizontal">
              {!isLoading && (
                <div
                  data-testid="progress-container"
                  className={styles['progress-container']}
                  style={{
                    width: getProgressWidth(screens),
                  }}
                >
                  <Text>All tasks:</Text>
                  <Progress
                    aria-label="Task completition progress"
                    percent={percent}
                    status="active"
                  />
                </div>
              )}
              <Avatar
                alt="user avatar"
                size={64}
                src="https://avatars.githubusercontent.com/u/8733843?s=96"
              />
            </Space>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  );
};
