import { Layout, Row, Space, Tooltip, Typography } from 'antd';
import {
  CoffeeOutlined,
  GithubOutlined,
  LinkedinOutlined,
  InstagramOutlined,
} from '@ant-design/icons';

const { Text, Link } = Typography;

import styles from './styles.module.css';

export const Footer = () => (
  <Layout.Footer className={styles.footer}>
    <Row justify="center">
      <Space direction="vertical" align="center">
        <Tooltip data-testid="tooltip" title="Coffees to make this project: 29">
          <CoffeeOutlined />
        </Tooltip>
        <Text>
          Styled with{' '}
          <Link
            href="https://ant.design/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ant Design
          </Link>
        </Text>
        <Text>
          Source code available on{' '}
          <Link
            href="https://github.com/vrazn/todo-list"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </Text>
        <Space direction="horizontal">
          Vrazn on social:
          <Link
            href="https://github.com/vrazn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubOutlined />
          </Link>
          <Link
            href="https://www.linkedin.com/in/vrazn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinOutlined />
          </Link>
          <Link
            href="https://www.instagram.com/vrazn_"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramOutlined />
          </Link>
        </Space>
      </Space>
    </Row>
  </Layout.Footer>
);
