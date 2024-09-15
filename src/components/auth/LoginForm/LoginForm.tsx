import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Form } from 'antd';
import { useLogin } from '@app/hooks/useLogin';
import { setUser } from '@app/store/slices/userSlice';
import { persistToken } from '@app/services/localStorage.service';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';

interface LoginFormData {
  npub: string;
  password: string;
}

export const initValues: LoginFormData = {
  npub: '', // This will be dynamically set
  password: '',
};

declare global {
  interface Window {
    nostr: {
      getPublicKey: () => Promise<string>;
      signEvent: (event: any) => Promise<any>;
      getRelays: () => Promise<Record<string, { read: boolean; write: boolean }>>;
      nip04: {
        encrypt: (pubkey: string, plaintext: string) => Promise<string>;
        decrypt: (pubkey: string, ciphertext: string) => Promise<string>;
      };
      nip44: {
        encrypt: (pubkey: string, plaintext: string) => Promise<string>;
        decrypt: (pubkey: string, ciphertext: string) => Promise<string>;
      };
    };
  }
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, verifyChallenge, isLoading } = useLogin();
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        if (window.nostr) {
          const pubkey = await window.nostr.getPublicKey();
          form.setFieldsValue({ npub: pubkey });
        } else {
          console.warn('Nostr extension is not available');
        }
      } catch (error) {
        console.error('Failed to get public key:', error);
      }
    };
  
    const intervalId = setInterval(() => {
      if (window.nostr) {
        fetchPublicKey();
        clearInterval(intervalId);
      }
    }, 1000); // Retry every 1 second
  
    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, [form]);
  

  const [event, setEvent] = useState<any>(null);

  const handleSubmit = async (values: LoginFormData) => {
    try {
      if (!window.nostr) {
        notificationController.error({ message: 'Nostr extension is not available' });
        return;
      }
      
      const { success, event } = await login(values);
      if (success && event) {
        setEvent(event);
        const signedEvent = await window.nostr.signEvent(event);
        console.log('Signed event:', signedEvent);
  
        const response = await verifyChallenge({
          challenge: signedEvent.content,
          signature: signedEvent.sig,
          messageHash: signedEvent.id,
          event: signedEvent,
        });
  
        if (response.success) {
          if (response.token && response.user) {
            persistToken(response.token);
            dispatch(setUser(response.user));
            notificationController.success({
              message: 'Login successful',
              description: 'You have successfully logged in!',
            });
            navigate('/');
          } else {
            throw new Error('Login failed: Missing token or user data');
          }
        }
      }
    } catch (error: any) {
      notificationController.error({ message: error.message });
    }
  };
  

  return (
    <Auth.FormWrapper>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initValues}>
        <Auth.FormTitle>{t('common.login')}</Auth.FormTitle>
        <S.LoginDescription>{t('login.loginInfo')}</S.LoginDescription>
        <S.HiddenInput>
          <Form.Item name="npub" label="Npub" rules={[{ required: true, message: 'Npub is required' }]}>
            <Auth.FormInput placeholder="Enter your Npub key" />
          </Form.Item>
        </S.HiddenInput>
        <Form.Item
          label={t('common.password')}
          name="password"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </Form.Item>
        <Form.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.login')}
          </Auth.SubmitButton>
        </Form.Item>
        <Auth.FooterWrapper>
          <Auth.Text>
            {t('login.noAccount')}{' '}
            <Link to="/auth/sign-up">
              <Auth.LinkText>{t('common.here')}</Auth.LinkText>
            </Link>
          </Auth.Text>
        </Auth.FooterWrapper>
      </Form>
    </Auth.FormWrapper>
  );
};
