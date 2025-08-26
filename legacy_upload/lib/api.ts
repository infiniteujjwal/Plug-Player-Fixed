// This is the new frontend API client.
// It has the same interface as the old `data.ts` api object,
// but now it makes network requests to our Next.js backend.

const fetcher = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        try {
          const info = await res.json();
          (error as any).info = info;
        } catch (e) {
            (error as any).info = { message: 'Response not valid JSON' };
        }
        (error as any).status = res.status;
        throw error;
    }
    // Handle cases where the response might be empty
    const text = await res.text();
    return text ? JSON.parse(text) : {};
};

const api = {
    // Auth
    login: (email: string) => fetcher('/api/auth/login', { method: 'POST', body: JSON.stringify({ email }) }),
    register: (details: any) => fetcher('/api/auth/register', { method: 'POST', body: JSON.stringify(details) }),
    verifyOtp: (email: string, otp: string) => fetcher('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
    getUser: (userId: string) => fetcher(`/api/users/${userId}`),
    getUserByEmail: (email: string) => fetcher(`/api/users/by-email/${encodeURIComponent(email)}`),

    // Organizations
    getAllOrganizations: () => fetcher('/api/organizations'),
    getOrganization: (id: string) => fetcher(`/api/organizations/${id}`),
    createOrganization: (data: any) => fetcher('/api/organizations', { method: 'POST', body: JSON.stringify(data) }),
    updateOrganization: (id: string, data: any) => fetcher(`/api/organizations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteOrganization: (id: string) => fetcher(`/api/organizations/${id}`, { method: 'DELETE' }),
    updateSubscription: (orgId: string, status: string) => fetcher(`/api/organizations/${orgId}/subscription`, { method: 'PUT', body: JSON.stringify({ status }) }),
    
    // Jobs
    getAllJobs: () => fetcher('/api/jobs'),
    getJobsForOrg: (orgId: string) => fetcher(`/api/jobs/for-org/${orgId}`),
    createJob: (details: any) => fetcher('/api/jobs', { method: 'POST', body: JSON.stringify(details) }),
    
    // Candidates
    getAllCandidates: () => fetcher('/api/candidates'),
    getCandidate: (id: string) => fetcher(`/api/candidates/${id}`),
    getCandidateProfile: (userId: string) => fetcher(`/api/candidates/profile/${userId}`),
    updateCandidateProfile: (profile: any) => fetcher(`/api/candidates/${profile.id}`, { method: 'PUT', body: JSON.stringify(profile) }),
    updateCandidateResume: (candidateId: string, fileName: string) => fetcher(`/api/candidates/${candidateId}/resume`, { method: 'POST', body: JSON.stringify({ fileName }) }),
    updateCandidateAvatar: (candidateId: string, avatarUrl: string) => fetcher(`/api/candidates/${candidateId}/avatar`, { method: 'POST', body: JSON.stringify({ avatarUrl }) }),
    createCandidate: (data: any) => fetcher('/api/candidates', { method: 'POST', body: JSON.stringify(data) }),
    createCandidatesFromCsv: (data: any) => fetcher('/api/candidates/bulk', { method: 'POST', body: JSON.stringify(data) }),
    scrapeLinkedInProfile: (url: string) => fetcher('/api/scrape/linkedin', { method: 'POST', body: JSON.stringify({ url }) }),
    
    // Applications
    getAvailableJobs: () => fetcher('/api/jobs/available'),
    getCandidateApplications: (userId: string) => fetcher(`/api/applications/for-candidate/${userId}`),
    getApplicationsForCandidate: (userId: string) => fetcher(`/api/applications/for-candidate/${userId}`),
    applyForJob: (userId: string, jobId: string) => fetcher('/api/applications', { method: 'POST', body: JSON.stringify({ userId, jobId }) }),
    getApplicationsForJob: (jobId: string) => fetcher(`/api/applications/for-job/${jobId}`),
    updateApplicationStatus: (appId: string, status: string) => fetcher(`/api/applications/${appId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    
    // Interviews
    getInterviewsForCandidate: (userId: string) => fetcher(`/api/interviews/for-candidate/${userId}`),
    scheduleInterview: (applicationId: string, details: any) => fetcher(`/api/interviews`, { method: 'POST', body: JSON.stringify({ applicationId, details }) }),
    updateInterview: (interviewId: string, status: string, details?: any) => fetcher(`/api/interviews/${interviewId}`, { method: 'PUT', body: JSON.stringify({ status, details }) }),
    cancelInterview: (interviewId: string) => fetcher(`/api/interviews/${interviewId}/cancel`, { method: 'POST' }),
    getInterviewById: (interviewId: string) => fetcher(`/api/interviews/${interviewId}`),
    
    // Messaging
    getConversationsForUser: (userId: string) => fetcher(`/api/conversations/for-user/${userId}`),
    getMessagesForConversation: (conversationId: string) => fetcher(`/api/messages/for-conversation/${conversationId}`),
    sendMessage: (conversationId: string, senderId: string, text: string, attachment?: any) => fetcher(`/api/messages`, { method: 'POST', body: JSON.stringify({ conversationId, senderId, text, attachment }) }),
    createConversation: (adminId: string, recipient: any) => fetcher('/api/conversations', { method: 'POST', body: JSON.stringify({ adminId, recipient }) }),
    markConversationAsRead: (conversationId: string) => fetcher(`/api/conversations/${conversationId}/read`, { method: 'POST' }),
    findOrCreateConversation: (clientId: string, candidateUserId: string) => fetcher('/api/conversations/find-or-create', { method: 'POST', body: JSON.stringify({ clientId, candidateUserId }) }),

    // Team Builder
    generateTeamSuggestion: (project: any) => fetcher('/api/team-builder/generate', { method: 'POST', body: JSON.stringify({ project }) }),
    runSimulation: (team: any, project: any) => fetcher('/api/team-builder/simulate', { method: 'POST', body: JSON.stringify({ team, project }) }),
    createShortlistRequest: (organizationId: string, projectDetails: any, requestedTeam: any) => fetcher('/api/shortlist-requests', { method: 'POST', body: JSON.stringify({ organizationId, projectDetails, requestedTeam }) }),
    getShortlistRequestsForOrg: (organizationId: string) => fetcher(`/api/shortlist-requests/for-org/${organizationId}`),
    getShortlistRequestsForAdmin: () => fetcher('/api/shortlist-requests'),
    assignCandidatesToRequest: (requestId: string, candidateIds: string[]) => fetcher(`/api/shortlist-requests/${requestId}/assign`, { method: 'POST', body: JSON.stringify({ candidateIds }) }),
    
    // Contracts
    generateContract: (applicationId: string) => fetcher('/api/contracts/generate', { method: 'POST', body: JSON.stringify({ applicationId }) }),
    getContractsForOrg: (organizationId: string) => fetcher(`/api/contracts/for-org/${organizationId}`),
    getContractsForCandidate: (userId: string) => fetcher(`/api/contracts/for-candidate/${userId}`),
    getAllContracts: () => fetcher('/api/contracts'),
    signContract: (contractId: string, userId: string, signature: string) => fetcher(`/api/contracts/${contractId}/sign`, { method: 'POST', body: JSON.stringify({ userId, signature }) }),
    
    // Payments
    initiatePayment: (contractId: string, amount: number, notes?: string) => fetcher('/api/payments', { method: 'POST', body: JSON.stringify({ contractId, amount, notes }) }),
    disbursePayment: (paymentId: string) => fetcher(`/api/payments/${paymentId}/disburse`, { method: 'POST' }),
    getAllPayments: () => fetcher('/api/payments'),
    getPaymentsForOrg: (organizationId: string) => fetcher(`/api/payments/for-org/${organizationId}`),
    getPaymentsForCandidate: (userId: string) => fetcher(`/api/payments/for-candidate/${userId}`),
    
    // Notifications
    getNotificationsForUser: (userId: string) => fetcher(`/api/notifications/for-user/${userId}`),
    markNotificationAsRead: (notificationId: string) => fetcher(`/api/notifications/${notificationId}/read`, { method: 'POST' }),
    
    // Dashboard Stats
    getAdminDashboardStats: () => fetcher('/api/stats/admin'),
    getClientDashboardStats: (organizationId: string) => fetcher(`/api/stats/client/${organizationId}`),
    getRecentActivityForOrg: (organizationId: string) => fetcher(`/api/activity/for-org/${organizationId}`),
};

export default api;
