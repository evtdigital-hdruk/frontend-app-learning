import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  AlertModal,
  Button,
} from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendActivationEmail } from '../../courseware/data';
import messages from './messages';

const AccountActivationAlert = ({
  intl,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [waitForResend, setWaitForResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (waitForResend && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setWaitForResend(false);
    }
    return () => clearTimeout(timer);
  }, [waitForResend, timeLeft]);

  const handleOnClick = () => {
    setWaitForResend(true);
    setTimeLeft(60);
    sendActivationEmail().then(() => {
    });
  };

  const showAccountActivationAlert = Cookies.get('show-account-activation-popup');
  useEffect(() => {
    if (Cookies.get('show-account-activation-popup') === 'True') {
      setShowModal(true);
    }
  }, [showAccountActivationAlert]);

  const button = (
    <Button
      variant="danger"
      className=""
      disabled={waitForResend}
      onClick={handleOnClick}
    >
      {
        waitForResend
          ? (
            <FormattedMessage
              id="account-activation.resend.link"
              defaultMessage={`Resend verification email (${timeLeft}s)`}
              description="Message for resending link in account activation alert which is shown after the registration"
            />
          )
          : (
            <FormattedMessage
              id="account-activation.resend.link"
              defaultMessage="Resend verification email"
              description="Message for resending link in account activation alert which is shown after the registration"
            />
          )
      }
    </Button>
  );

  const children = () => {
    const message = (
      <FormattedMessage
        id="account-activation.alert.message"
        defaultMessage="We've sent you an email to verify your account. Please check your inbox to confirm and keep learning."
        description="Message for account activation alert which is shown after the registration"
      />
    );
    const bodyContent = (
      <div>
        {message}
      </div>
    );
    return bodyContent;
  };

  return (
    <AlertModal
      isOpen={showModal}
      title={intl.formatMessage(messages.accountActivationAlertTitle)}
      footerNode={button}
      onClose={() => ({})}
    >
      {children()}
    </AlertModal>
  );
};

AccountActivationAlert.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AccountActivationAlert);
