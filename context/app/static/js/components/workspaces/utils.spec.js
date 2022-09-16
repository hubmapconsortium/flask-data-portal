import { mergeJobsIntoWorkspaces, condenseJobs } from './utils';

test('it should merge jobs into workspaces', () => {
  const workspaces = [{ id: 1, other_ws_info: true, status: 'active' }];
  const jobs = [{ id: 42, workspace_id: 1, other_job_info: true, status: 'running' }];
  const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
  expect(mergedWorkspaces).toEqual([
    {
      id: 1,
      other_ws_info: true,
      status: 'active',
      jobs: [
        {
          id: 42,
          workspace_id: 1,
          other_job_info: true,
          status: 'running',
        },
      ],
    },
  ]);
});

test('it should filter out workspaces that are not "active" or "idle"', () => {
  const workspaces = [
    { id: 1, status: 'active' },
    { id: 2, status: 'idle' },
    { id: 3, status: 'deleting' },
    { id: 4, status: 'error' },
  ];
  const jobs = [];
  const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
  expect(mergedWorkspaces).toEqual([
    { id: 1, status: 'active', jobs: [] },
    { id: 2, status: 'idle', jobs: [] },
  ]);
});

test('it should pick one active job if available', () => {
  const jobs = [
    {
      status: 'pending',
    },
    {
      status: 'running',
      job_details: {
        current_job_details: { connection_details: { url_domain: 'http://example.com/', url_path: 'this' } },
      },
    },
    {
      status: 'running',
      job_details: {
        current_job_details: { connection_details: { url_domain: 'http://example.com/', url_path: 'not-this' } },
      },
    },
  ];
  const job = condenseJobs(jobs);
  expect(job).toEqual({ allowNew: false, status: 'Active', url: 'http://example.com/this' });
});

test('it should pick an activating job if no active jobs are available', () => {
  const jobs = [
    {
      status: 'failed',
    },
    {
      status: 'pending',
    },
  ];
  const job = condenseJobs(jobs);
  expect(job).toEqual({ allowNew: false, status: 'Activating', message: 'Activating' });
});

test('it should return allowNew for an empty list', () => {
  const jobs = [];
  const job = condenseJobs(jobs);
  expect(job).toEqual({ allowNew: true, status: undefined });
});
