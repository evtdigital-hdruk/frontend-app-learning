import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { Alert, Button, Hyperlink } from '@openedx/paragon';
import { Info, WarningFilled } from '@openedx/paragon/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useModel } from '../../generic/model-store';

import messages from './messages';
import useEnrollClickHandler from './clickHook';
import { buyUrl } from './purchase';

const EnrollmentAlert = ({ payload }) => {
  const intl = useIntl();
  const {
    canEnroll,
    courseId,
    extraText,
    isStaff,
    requiresPurchase,
  } = payload;

  const {
    org,
  } = useModel('courseHomeMeta', courseId);

  const { enrollClickHandler, loading } = useEnrollClickHandler(
    courseId,
    org,
    intl.formatMessage(messages.success),
  );

  let text = intl.formatMessage(requiresPurchase ? messages.purchaseAlert : messages.alert);
  let type = 'warning';
  let icon = WarningFilled;
  if (isStaff) {
    text = intl.formatMessage(messages.staffAlert);
    type = 'info';
    icon = Info;
  } else if (extraText) {
    text = `${text} ${extraText}`;
  }

  let button = canEnroll && (
    <Button disabled={loading} variant="link" className="p-0 border-0 align-top mx-1" size="sm" style={{ textDecoration: 'underline' }} onClick={enrollClickHandler}>
      {intl.formatMessage(messages.enrollNowSentence)}
    </Button>
  );
  if (canEnroll && requiresPurchase) {
    button = (
      <Hyperlink className="mx-1" style={{ textDecoration: 'underline' }} destination={buyUrl(courseId)}>
        {intl.formatMessage(messages.buyAccessSentence)}
      </Hyperlink>
    );
  }

  return (
    <Alert variant={type} icon={icon}>
      <div className="d-flex">
        {text}
        {button}
        {loading && <FontAwesomeIcon icon={faSpinner} spin />}
      </div>
    </Alert>
  );
};

EnrollmentAlert.propTypes = {
  payload: PropTypes.shape({
    canEnroll: PropTypes.bool,
    courseId: PropTypes.string,
    extraText: PropTypes.string,
    isStaff: PropTypes.bool,
    requiresPurchase: PropTypes.bool,
  }).isRequired,
};

export default EnrollmentAlert;
