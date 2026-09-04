/**
 * @jest-environment jsdom
 */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';

import {
  initializeMockApp, render, screen,
} from '../../setupTest';
import { reducer as modelsReducer } from '../../generic/model-store';
import { reducer as courseHomeReducer } from '../../course-home/data';
import { reducer as toursReducer } from '../data';
import LaunchCourseHomeTourButton from './LaunchCourseHomeTourButton';

initializeMockApp();
jest.mock('@edx/frontend-platform/analytics');

describe('LaunchCourseHomeTourButton', () => {
  const courseId = 'course-v1:edX+Test+run';

  const buildStore = ({ toursEnabled }) => configureStore({
    reducer: {
      models: modelsReducer,
      courseHome: courseHomeReducer,
      tours: toursReducer,
    },
    preloadedState: {
      courseHome: { courseId },
      tours: { toursEnabled },
      models: {
        courseHomeMeta: {
          [courseId]: { org: 'edX' },
        },
      },
    },
  });

  it('renders the tour link reading "How to navigate a course" when tours are enabled', () => {
    render(<LaunchCourseHomeTourButton />, { store: buildStore({ toursEnabled: true }) });

    expect(screen.getByRole('button', { name: 'How to navigate a course' })).toBeInTheDocument();
  });

  it('renders nothing when tours are disabled', () => {
    render(<LaunchCourseHomeTourButton />, { store: buildStore({ toursEnabled: false }) });

    expect(screen.queryByRole('button', { name: 'How to navigate a course' })).not.toBeInTheDocument();
  });
});
