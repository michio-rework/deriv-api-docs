import React, { useCallback } from 'react';
import useWS from '@site/src/hooks/useWs';
import AppForm from '../components/AppForm';
import { Button } from '@deriv/ui';
import { scopesObjectToArray } from '@site/src/utils';
import { RegisterAppDialogError } from '../components/Dialogs/RegisterAppDialogError';
import { RegisterAppDialogSuccess } from '../components/Dialogs/RegisterAppDialogSuccess';
import { IRegisterAppForm } from '../types';

const AppRegistration = () => {
  const { is_loading, send: registerApp, error, clear, data } = useWS('app_register');

  const onSubmit = useCallback(
    (data: IRegisterAppForm) => {
      const { name, redirect_uri, verification_uri, app_markup_percentage } = data;
      const has_redirect_uri = redirect_uri !== '' && { redirect_uri };
      const has_verification_uri = verification_uri !== '' && { verification_uri };

      const selectedScopes = scopesObjectToArray({
        admin: data.admin,
        payments: data.payments,
        read: data.read,
        trade: data.trade,
        trading_information: data.trading_information,
      });
      registerApp({
        name,
        ...has_redirect_uri,
        ...has_verification_uri,
        app_markup_percentage: Number(app_markup_percentage),
        scopes: selectedScopes,
      });
    },
    [registerApp],
  );

  const renderButtons = () => {
    return (
      <>
        <Button role='submit' disabled={is_loading}>
          Register Application
        </Button>
      </>
    );
  };

  return (
    <>
      <AppForm renderButtons={renderButtons} submit={onSubmit} />
      {error && <RegisterAppDialogError error={error} onClose={clear} />}
      {data && <RegisterAppDialogSuccess onClose={clear} />}
    </>
  );
};

export default AppRegistration;
