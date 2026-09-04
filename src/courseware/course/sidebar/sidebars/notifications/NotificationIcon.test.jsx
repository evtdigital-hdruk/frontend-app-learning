/**
 * @jest-environment jsdom
 */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';

import {
  initializeMockApp, render, screen,
} from '../../../../../setupTest';
import { reducer as modelsReducer } from '../../../../../generic/model-store';
import NotificationIcon from './NotificationIcon';

// Mock the Paragon `Notifications` (bell) icon so we can assert the exact
// icon component NotificationIcon renders.
jest.mock('@openedx/paragon/icons', () => ({
  ...jest.requireActual('@openedx/paragon/icons'),
  Notifications: function MockNotificationsIcon(props) {
    // eslint-disable-next-line react/jsx-filename-extension
    return <svg data-testid="notifications-bell-icon" {...props} />;
  },
}));

initializeMockApp();

describe('NotificationIcon', () => {
  const store = configureStore({ reducer: { models: modelsReducer } });

  const renderIcon = (props = {}) => render(
    <NotificationIcon notificationColor="bg-danger-500" {...props} />,
    { store },
  );

  it('renders the (bell) Notifications icon with the accessible trigger label', () => {
    const { container } = renderIcon();

    const bellIcon = screen.getByTestId('notifications-bell-icon');
    expect(bellIcon).toBeInTheDocument();
    expect(container.querySelector('[alt="Show notification tray"]')).toBeInTheDocument();
  });

  it('renders the notification dot when status is active', () => {
    renderIcon({ status: 'active' });

    expect(screen.getByTestId('notifications-bell-icon')).toBeInTheDocument();
    expect(screen.getByTestId('notification-dot')).toBeInTheDocument();
  });

  it('does not render the notification dot when status is not active', () => {
    renderIcon({ status: 'inactive' });

    expect(screen.getByTestId('notifications-bell-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('notification-dot')).not.toBeInTheDocument();
  });
});
