/**
 * @jest-environment jsdom
 */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';

import {
  initializeMockApp, render, screen,
} from '../../../setupTest';
import { reducer as modelsReducer } from '../../../generic/model-store';
import { reducer as courseHomeReducer } from '../../data';
import CourseDates from './CourseDates';

initializeMockApp();

describe('CourseDates widget', () => {
  const courseId = 'course-v1:edX+Test+run';

  const courseDateBlocks = [
    {
      title: 'Course starts',
      date: '2030-01-01T00:00:00Z',
      dateType: 'course-start-date',
    },
    {
      title: 'Assignment due',
      date: '2030-02-01T00:00:00Z',
      dateType: 'assignment-due-date',
    },
  ];

  const buildStore = ({ isSelfPaced, blocks = courseDateBlocks }) => configureStore({
    reducer: {
      models: modelsReducer,
      courseHome: courseHomeReducer,
    },
    preloadedState: {
      courseHome: { courseId },
      models: {
        courseHomeMeta: {
          [courseId]: {
            org: 'edX',
            userTimezone: 'UTC',
            isSelfPaced,
          },
        },
        outline: {
          [courseId]: {
            datesWidget: {
              courseDateBlocks: blocks,
              datesTabLink: '/course/dates',
            },
          },
        },
      },
    },
  });

  it('is shown for instructor-paced (scheduled) courses', () => {
    render(<CourseDates />, { store: buildStore({ isSelfPaced: false }) });

    expect(screen.getByRole('heading', { name: 'Important dates' })).toBeInTheDocument();
    expect(screen.getByText('Course starts')).toBeInTheDocument();
    expect(screen.getByText('Assignment due')).toBeInTheDocument();
    const allDatesLink = screen.getByRole('link', { name: 'View all course dates' });
    expect(allDatesLink).toBeInTheDocument();
    expect(allDatesLink).toHaveAttribute('href', '/course/dates');
  });

  it('is hidden for self-paced courses', () => {
    render(<CourseDates />, { store: buildStore({ isSelfPaced: true }) });

    expect(screen.queryByRole('heading', { name: 'Important dates' })).not.toBeInTheDocument();
    expect(screen.queryByText('Course starts')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View all course dates' })).not.toBeInTheDocument();
  });

  it('is hidden when there are no date blocks, even when instructor-paced', () => {
    render(
      <CourseDates />,
      { store: buildStore({ isSelfPaced: false, blocks: [] }) },
    );

    expect(screen.queryByRole('heading', { name: 'Important dates' })).not.toBeInTheDocument();
  });
});
