const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = json?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }
    return json?.data !== undefined ? json.data : json;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, err);
    throw err;
  }
}

export const authApi = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getUser: (id) => request(`/auth/user/${id}`),
};

export const jobsApi = {
  getJobs: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.location) query.append('location', params.location);
    if (params.type && params.type !== 'All') query.append('type', params.type);
    if (params.experienceLevel && params.experienceLevel !== 'All') query.append('experienceLevel', params.experienceLevel);
    if (params.recruiterId) query.append('recruiterId', params.recruiterId);
    const qs = query.toString();
    return request(`/jobs${qs ? `?${qs}` : ''}`);
  },
  getJobById: (id) => request(`/jobs/${id}`),
  createJob: (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateJob: (id, data) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
  getRecruiterJobs: (recruiterId) => request(`/jobs/recruiter/${recruiterId}`),
};

export const candidatesApi = {
  getAll: () => request('/candidates'),
  getById: (id) => request(`/candidates/${id}`),
  updateProfile: (id, data) => request(`/candidates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const matchApi = {
  calculate: (data) => request('/match/calculate', { method: 'POST', body: JSON.stringify(data) }),
  matchJobAndCandidate: (jobId, candidateId) => request(`/match/job/${jobId}/candidate/${candidateId}`),
  getRankedJobsForCandidate: (candidateId) => request(`/match/candidate/${candidateId}/jobs`),
  getRankedCandidatesForJob: (jobId) => request(`/match/job/${jobId}/candidates`),
};

export const applicationsApi = {
  apply: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
  getByCandidate: (candidateId) => request(`/applications/candidate/${candidateId}`),
  getByJob: (jobId) => request(`/applications/job/${jobId}`),
  updateStatus: (id, status) => request(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};

export const systemApi = {
  getHealth: () => request('/health'),
  resetSeedData: () => request('/seed/reset', { method: 'POST' }),
  getMeta: () => request('/meta'),
};
