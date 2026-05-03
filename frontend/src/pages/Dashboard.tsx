import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { VideoCameraOutlined, BgColorsOutlined } from '@ant-design/icons';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>Tableau de bord</h2>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Films"
              value={0}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Salles"
              value={0}
              prefix={<BgColorsOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
