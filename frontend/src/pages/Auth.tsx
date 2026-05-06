import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Auth.css';

export const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const isSignup = searchParams.get('signup') === 'true';
  const [mode, setMode] = useState<'login' | 'signup'>(isSignup ? 'signup' : 'login');

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(values.email, values.password);
        message.success('Connexion réussie!');
      } else {
        await signup(values.email, values.password);
        message.success('Inscription réussie!');
      }
      setTimeout(() => {
        navigate('/movies');
      }, 500);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Une erreur est survenue';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title={mode === 'login' ? 'Connexion' : 'Inscription'}>
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email requis' },
                { type: 'email', message: 'Email invalide' },
              ]}
            >
              <Input placeholder="vous@exemple.com" />
            </Form.Item>

            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[{ required: true, message: 'Mot de passe requis' }]}
            >
              <Input.Password placeholder="Votre mot de passe" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              {mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </Button>
          </Form>

          <div className="auth-toggle">
            {mode === 'login' ? (
              <p>
                Pas de compte?{' '}
                <a
                  onClick={() => {
                    setMode('signup');
                    form.resetFields();
                  }}
                >
                  S'inscrire
                </a>
              </p>
            ) : (
              <p>
                Déjà un compte?{' '}
                <a
                  onClick={() => {
                    setMode('login');
                    form.resetFields();
                  }}
                >
                  Se connecter
                </a>
              </p>
            )}
          </div>
        </Spin>
      </Card>
    </div>
  );
};
