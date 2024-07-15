import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { SignUpForm } from '@app/components/auth/SignUpForm/SignUpForm';

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.signUp')}</PageTitle>
      {console.log("About to render SignUpForm")}
      <SignUpForm />
      {console.log("After rendering SignUpForm")}
    </>
  );
};

export default SignUpPage;
