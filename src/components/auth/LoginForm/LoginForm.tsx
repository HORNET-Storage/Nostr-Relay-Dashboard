import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Form } from 'antd';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useLogin } from '@app/hooks/useLogin';
import { ReactComponent as FacebookIcon } from '@app/assets/icons/facebook.svg';
import { ReactComponent as GoogleIcon } from '@app/assets/icons/google.svg';
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
  password: 'test-pass',
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
  const [event, setEvent] = useState<any>(null);

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

    fetchPublicKey();

    const isFirstLoad = localStorage.getItem('isFirstLoad');
    if (!isFirstLoad) {
      window.location.reload();
      localStorage.setItem('isFirstLoad', 'true');
    }
  }, [form]);

  const handleSubmit = async (values: LoginFormData) => {
    try {
      const { success, event } = await login(values);
      if (success && event) {
        setEvent(event);
        // Automatically proceed to verification
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
        {/* <Auth.ActionsWrapper>
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Auth.FormCheckbox>
              <S.RememberMeText>{t('login.rememberMe')}</S.RememberMeText>
            </Auth.FormCheckbox>
          </Form.Item>
          <Link to="/auth/forgot-password">
            <S.ForgotPasswordText>{t('common.forgotPass')}</S.ForgotPasswordText>
          </Link>
        </Auth.ActionsWrapper> */}
        <Form.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.login')}
          </Auth.SubmitButton>
        </Form.Item>
        {/* <Form.Item noStyle>
          <Auth.SocialButton type="default" htmlType="button">
            <Auth.SocialIconWrapper>
              <GoogleIcon />
            </Auth.SocialIconWrapper>
            {t('signup.googleLink')}
          </Auth.SocialButton>
        </Form.Item>
        <Form.Item noStyle>
          <Auth.SocialButton type="default" htmlType="button">
            <Auth.SocialIconWrapper>
              <FacebookIcon />
            </Auth.SocialIconWrapper>
            {t('signup.facebookLink')}
          </Auth.SocialButton>
        </Form.Item> */}
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

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useDispatch } from 'react-redux';
// import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
// import { useLogin } from '@app/hooks/useLogin';
// import { ReactComponent as FacebookIcon } from '@app/assets/icons/facebook.svg';
// import { ReactComponent as GoogleIcon } from '@app/assets/icons/google.svg';
// import { setUser } from '@app/store/slices/userSlice';
// import { persistToken } from '@app/services/localStorage.service';
// import { notificationController } from '@app/controllers/notificationController';
// import * as S from './LoginForm.styles';
// import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';

// interface LoginFormData {
//   npub: string;
//   password: string;
// }

// export const initValues: LoginFormData = {
//   npub: 'npub1examplepublickey', // Replace with your default npub if needed
//   password: 'test-pass',
// };

// declare global {
//   interface Window {
//     nostr: {
//       getPublicKey: () => Promise<string>;
//       signEvent: (event: any) => Promise<any>;
//       getRelays: () => Promise<Record<string, { read: boolean; write: boolean }>>;
//       nip04: {
//         encrypt: (pubkey: string, plaintext: string) => Promise<string>;
//         decrypt: (pubkey: string, ciphertext: string) => Promise<string>;
//       };
//       nip44: {
//         encrypt: (pubkey: string, plaintext: string) => Promise<string>;
//         decrypt: (pubkey: string, ciphertext: string) => Promise<string>;
//       };
//     };
//   }
// }

// export const LoginForm: React.FC = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { login, verifyChallenge, isLoading } = useLogin();
//   const dispatch = useDispatch();

//   const [step, setStep] = useState(1);
//   const [event, setEvent] = useState<any>(null);

//   useEffect(() => {
//     const isFirstLoad = localStorage.getItem('isFirstLoad');
//     if (!isFirstLoad) {
//       window.location.reload();
//       localStorage.setItem('isFirstLoad', 'true');
//     }
//   }, []);

//   const handleSubmit = async (values: LoginFormData) => {
//     if (step === 1) {
//       try {
//         const { success, event } = await login(values);
//         if (success && event) {
//           setEvent(event);
//           setStep(2);
//         }
//       } catch (error: any) {
//         notificationController.error({ message: error.message });
//       }
//     } else if (step === 2) {
//       try {
//         if (!window.nostr) {
//           throw new Error('Nostr extension is not available');
//         }
//         console.log('event:', event);

//         const signedEvent = await window.nostr.signEvent(event);
//         console.log('Signed event:', signedEvent);

//         const response = await verifyChallenge({
//           challenge: signedEvent.content,
//           signature: signedEvent.sig,
//           messageHash: signedEvent.id,
//           event: signedEvent,
//         });

//         if (response.success) {
//           if (response.token && response.user) {
//             persistToken(response.token);
//             dispatch(setUser(response.user));
//             notificationController.success({
//               message: 'Login successful',
//               description: 'You have successfully logged in!',
//             });
//             navigate('/');
//           } else {
//             throw new Error('Login failed: Missing token or user data');
//           }
//         }
//       } catch (error: any) {
//         notificationController.error({ message: error.message });
//       }
//     }
//   };

//   return (
//     <Auth.FormWrapper>
//       <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
//         <Auth.FormTitle>{t('common.login')}</Auth.FormTitle>
//         <S.LoginDescription>{t('login.loginInfo')}</S.LoginDescription>
//         <Auth.FormItem name="npub" label="Npub" rules={[{ required: true, message: 'Npub is required' }]}>
//           <Auth.FormInput placeholder="Enter your Npub key" />
//         </Auth.FormItem>
//         <Auth.FormItem
//           label={t('common.password')}
//           name="password"
//           rules={[{ required: true, message: t('common.requiredField') }]}
//         >
//           <Auth.FormInputPassword placeholder={t('common.password')} />
//         </Auth.FormItem>
//         {step === 2 && (
//           <Auth.FormItem>
//             <div>Check your Nostr extension to sign the challenge.</div>
//           </Auth.FormItem>
//         )}
//         <Auth.ActionsWrapper>
//           <BaseForm.Item name="rememberMe" valuePropName="checked" noStyle>
//             <Auth.FormCheckbox>
//               <S.RememberMeText>{t('login.rememberMe')}</S.RememberMeText>
//             </Auth.FormCheckbox>
//           </BaseForm.Item>
//           <Link to="/auth/forgot-password">
//             <S.ForgotPasswordText>{t('common.forgotPass')}</S.ForgotPasswordText>
//           </Link>
//         </Auth.ActionsWrapper>
//         <BaseForm.Item noStyle>
//           <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
//             {step === 1 ? t('common.login') : t('common.verify')}
//           </Auth.SubmitButton>
//         </BaseForm.Item>
//         <BaseForm.Item noStyle>
//           <Auth.SocialButton type="default" htmlType="button">
//             <Auth.SocialIconWrapper>
//               <GoogleIcon />
//             </Auth.SocialIconWrapper>
//             {t('signup.googleLink')}
//           </Auth.SocialButton>
//         </BaseForm.Item>
//         <BaseForm.Item noStyle>
//           <Auth.SocialButton type="default" htmlType="button">
//             <Auth.SocialIconWrapper>
//               <FacebookIcon />
//             </Auth.SocialIconWrapper>
//             {t('signup.facebookLink')}
//           </Auth.SocialButton>
//         </BaseForm.Item>
//         <Auth.FooterWrapper>
//           <Auth.Text>
//             {t('login.noAccount')}{' '}
//             <Link to="/auth/sign-up">
//               <Auth.LinkText>{t('common.here')}</Auth.LinkText>
//             </Link>
//           </Auth.Text>
//         </Auth.FooterWrapper>
//       </BaseForm>
//     </Auth.FormWrapper>
//   );
// };
