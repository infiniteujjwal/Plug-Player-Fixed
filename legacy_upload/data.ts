import { GoogleGenAI, Type } from "@google/genai";
import { User, Role, Organization, SubscriptionStatus, Job, JobStatus, Candidate, Application, ApplicationStatus, Conversation, Message, ConversationParticipant, MessageAttachment, TeamRole, ProjectCategory, TeamMember, SimulationResult, ProjectDetails, ShortlistRequest, ShortlistRequestStatus, Contract, ContractStatus, Payment, PaymentStatus, Interview, InterviewPlatform, InterviewStatus, Notification, NotificationType } from './types';

const MOCK_AVATAR_1 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80';
const MOCK_AVATAR_2 = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80';

let ai: GoogleGenAI;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI. Make sure API_KEY is set.", error);
}

// MOCK DATABASE (made mutable)
let USERS: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@plugplayers.com', role: Role.ADMIN },
  { id: 'user-2', name: 'Alice (Client Admin)', email: 'alice@startup.com', role: Role.CLIENT_ADMIN, organizationId: 'org-1' },
  { id: 'user-3', name: 'Bob (Client Member)', email: 'bob@startup.com', role: Role.CLIENT_MEMBER, organizationId: 'org-1' },
  { id: 'user-4', name: 'Charlie (Candidate)', email: 'charlie.dev@email.com', role: Role.CANDIDATE, avatarUrl: MOCK_AVATAR_1 },
  { id: 'user-5', name: 'Diana (Client Admin, No Subscription)', email: 'diana@freetier.com', role: Role.CLIENT_ADMIN, organizationId: 'org-2' },
  { id: 'user-6', name: 'Eve (Candidate)', email: 'eve.designer@email.com', role: Role.CANDIDATE, avatarUrl: MOCK_AVATAR_2 },
];

export const demoUsers: User[] = [
    USERS.find(u => u.email === 'admin@plugplayers.com')!,
    USERS.find(u => u.email === 'alice@startup.com')!,
    USERS.find(u => u.email === 'charlie.dev@email.com')!,
];

let ORGANIZATIONS: Organization[] = [
  { id: 'org-1', name: 'Innovate Inc.', email: 'contact@innovate.com', subscriptionStatus: SubscriptionStatus.ACTIVE, members: USERS.filter(u => u.organizationId === 'org-1'), address: '123 Tech Lane, Silicon Valley, CA 94043', country: 'USA', industry: 'SaaS', businessId: 'INN-12345', contactPerson: 'Alice (Client Admin)' },
  { id: 'org-2', name: 'FreeTier Co.', email: 'hello@freetier.com', subscriptionStatus: SubscriptionStatus.INACTIVE, members: USERS.filter(u => u.organizationId === 'org-2'), address: '456 Open Source Rd, Remote', country: 'Global', industry: 'Open Source', businessId: 'FTC-67890', contactPerson: 'Diana (Client Admin, No Subscription)' },
  { id: 'org-3', name: 'Growth Stage LLC', email: 'bizdev@growthstage.com', subscriptionStatus: SubscriptionStatus.TRIALING, members: [], industry: 'FinTech', contactPerson: 'Admin Not Assigned' },
  { id: 'org-4', name: 'Synergy Solutions', email: 'info@synergysolutions.com', subscriptionStatus: SubscriptionStatus.ACTIVE, members: [], industry: 'Consulting', contactPerson: 'Admin Not Assigned' },
];

let CANDIDATES: Candidate[] = [
  { id: 'cand-4', name: 'Charlie Davis', email: 'charlie.dev@email.com', skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'], experience: '5 years', expectedRate: '$80/hr', resumeUrl: 'resume-charlie.pdf', resumeFileName: 'Charlie_Davis_Resume.pdf', avatarUrl: MOCK_AVATAR_1, linkedinUrl: 'https://linkedin.com/in/charlie-davis' },
  { id: 'cand-6', name: 'Eve Williams', email: 'eve.designer@email.com', skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems'], experience: '3 years', expectedRate: '$65/hr', avatarUrl: MOCK_AVATAR_2, linkedinUrl: 'https://linkedin.com/in/eve-williams' },
  { id: 'cand-3', name: 'Frank Miller', email: 'frank.pm@email.com', skills: ['Agile', 'Jira', 'Product Roadmapping'], experience: '8 years', expectedRate: '$95/hr', resumeUrl: 'resume-frank.pdf', resumeFileName: 'Frank_Miller_Resume.pdf'},
  { id: 'cand-2', name: 'Grace Lee', email: 'grace.eng@email.com', skills: ['Python', 'Django', 'PostgreSQL', 'AWS'], experience: '6 years', expectedRate: '$85/hr', resumeUrl: 'resume-grace.pdf', resumeFileName: 'Grace_Lee_Resume.pdf' },
];

let JOBS: Job[] = [
  { id: 'job-1', title: 'Senior Frontend Engineer', organizationId: 'org-1', organizationName: 'Innovate Inc.', location: 'Remote', salaryRange: '$120k - $150k', description: 'Seeking a talented frontend engineer to build out our next-generation platform. Must have experience with modern JavaScript frameworks and a passion for clean code and delightful user experiences.', status: JobStatus.OPEN, applicationsCount: 2 },
  { id: 'job-2', title: 'UX/UI Designer', organizationId: 'org-1', organizationName: 'Innovate Inc.', location: 'New York, NY', salaryRange: '$90k - $110k', description: 'Design beautiful and intuitive user experiences for our core product. A strong portfolio is required.', status: JobStatus.OPEN, applicationsCount: 1 },
  { id: 'job-3', title: 'Product Manager', organizationId: 'org-4', organizationName: 'Synergy Solutions', location: 'Remote', salaryRange: '$130k - $160k', description: 'Define the future of our product lineup. You will be responsible for the product lifecycle from concept to launch.', status: JobStatus.CLOSED, applicationsCount: 0 },
  { id: 'job-4', title: 'Backend Engineer', organizationId: 'org-2', organizationName: 'FreeTier Co.', location: 'Remote', salaryRange: '$100k - $130k', description: 'Build scalable and reliable backend services using Node.js and PostgreSQL. Experience with cloud infrastructure is a plus.', status: JobStatus.DRAFT, applicationsCount: 0 },
];

let APPLICATIONS: Application[] = [
  { id: 'app-1', candidateId: 'cand-4', jobId: 'job-1', status: ApplicationStatus.SUBMITTED, appliedDate: '2023-10-26' },
  { id: 'app-2', candidateId: 'cand-6', jobId: 'job-2', status: ApplicationStatus.SHORTLISTED, appliedDate: '2023-10-25' },
  { id: 'app-3', candidateId: 'cand-2', jobId: 'job-1', status: ApplicationStatus.INTERVIEW, appliedDate: '2023-10-24' },
];

let CONVERSATIONS: Conversation[] = [
    { 
        id: 'convo-1', 
        participants: [{id: 'user-1', name: 'Admin User', role: Role.ADMIN}, {id: 'user-2', name: 'Innovate Inc.', role: Role.CLIENT_ADMIN}],
        lastMessageSnippet: 'Great, thanks for the update!',
        lastMessageTimestamp: '2023-10-27T10:05:00Z',
        unreadCount: 2,
    },
    { 
        id: 'convo-2', 
        participants: [{id: 'user-1', name: 'Admin User', role: Role.ADMIN}, {id: 'user-4', name: 'Charlie Davis', role: Role.CANDIDATE}],
        lastMessageSnippet: 'Can you tell me more about the role?',
        lastMessageTimestamp: '2023-10-26T14:30:00Z',
        unreadCount: 0,
    },
];

let MESSAGES: Message[] = [
    { id: 'msg-1', conversationId: 'convo-1', senderId: 'user-1', text: 'Hi Alice, just wanted to check in on the Frontend Engineer role. How is the candidate search going?', timestamp: '2023-10-27T10:00:00Z'},
    { id: 'msg-2', conversationId: 'convo-1', senderId: 'user-2', text: 'Hi! We\'ve had some great applicants. We\'re scheduling interviews for next week.', timestamp: '2023-10-27T10:02:00Z'},
    { id: 'msg-3', conversationId: 'convo-1', senderId: 'user-1', text: 'Great, thanks for the update!', timestamp: '2023-10-27T10:05:00Z'},
    { id: 'msg-4', conversationId: 'convo-2', senderId: 'user-1', text: 'Hi Charlie, thanks for your interest in PlugPlayers. I saw your profile and it looks like a great fit.', timestamp: '2023-10-26T14:28:00Z'},
    { id: 'msg-5', conversationId: 'convo-2', senderId: 'user-4', text: 'Thanks! Can you tell me more about the role?', timestamp: '2023-10-26T14:30:00Z'},
];

let INTERVIEWS: Interview[] = [
    { id: 'int-1', applicationId: 'app-3', dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), platform: InterviewPlatform.GOOGLE_MEET, meetingLink: 'https://meet.google.com/xyz-abc-def', notes: 'First round technical interview with the engineering manager.', status: InterviewStatus.SCHEDULED }
];

let SHORTLIST_REQUESTS: ShortlistRequest[] = [];
let CONTRACTS: Contract[] = [];
let PAYMENTS: Payment[] = [];
let NOTIFICATIONS: Notification[] = [];

// --- Team Builder Database ---
export const ROLES_DATABASE: TeamRole[] = [
    { id: 'fe-dev', name: 'Frontend Dev', skills: ['React', 'Next.js'], avgWeeklyHours: 40, costPerHour: 80, workUnitsPerWeek: 10 },
    { id: 'be-dev', name: 'Backend Dev', skills: ['Node.js', 'APIs'], avgWeeklyHours: 40, costPerHour: 85, workUnitsPerWeek: 10 },
    { id: 'designer', name: 'UI/UX Designer', skills: ['Figma', 'Prototyping'], avgWeeklyHours: 30, costPerHour: 65, workUnitsPerWeek: 8 },
    { id: 'qa', name: 'QA Engineer', skills: ['Testing', 'Automation'], avgWeeklyHours: 25, costPerHour: 55, workUnitsPerWeek: 6 },
    { id: 'marketing', name: 'Growth Marketer', skills: ['SEO', 'Content'], avgWeeklyHours: 35, costPerHour: 70, workUnitsPerWeek: 9 },
];

const PROJECT_TEMPLATES: Record<ProjectCategory, { workUnits: number; team: TeamMember[]; explanation: string; comparison: { [key: string]: TeamMember[] } }> = {
    [ProjectCategory.SAAS]: {
        workUnits: 200,
        team: [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 1 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }],
        explanation: "Because your project is a SaaS dashboard, we prioritized a strong frontend and backend balance. Adding a designer accelerates usability.",
        comparison: {
            'MVP Starter': [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 1 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }],
            'Balanced Growth': [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 1 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }],
            'Fast-Track': [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 2 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }, { roleId: 'qa', roleName: 'QA Engineer', count: 1 }],
        }
    },
    [ProjectCategory.ECOMMERCE]: {
        workUnits: 180,
        team: [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 1 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }, { roleId: 'qa', roleName: 'QA Engineer', count: 1 }],
        explanation: "For an e-commerce site, reliability is key. We've included a QA Engineer to ensure a smooth checkout process alongside core developers.",
        comparison: {
            'MVP Starter': [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 1 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }],
            'Balanced Growth': [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 1 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }, { roleId: 'qa', roleName: 'QA Engineer', count: 1 }],
            'Fast-Track': [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 2 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }, { roleId: 'qa', roleName: 'QA Engineer', count: 1 }],
        }
    },
    [ProjectCategory.MOBILE_APP]: {
        workUnits: 250,
        team: [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 2 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }],
        explanation: "Mobile apps require a heavy focus on user interface. We've suggested two frontend developers to accelerate UI development and iteration.",
        comparison: {
            'MVP Starter': [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 1 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }],
            'Balanced Growth': [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 2 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 1 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }],
            'Fast-Track': [{ roleId: 'fe-dev', roleName: 'Frontend Dev', count: 2 }, { roleId: 'be-dev', roleName: 'Backend Dev', count: 2 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }, { roleId: 'qa', roleName: 'QA Engineer', count: 1 }],
        }
    },
    [ProjectCategory.MARKETING_CAMPAIGN]: {
        workUnits: 80,
        team: [{ roleId: 'marketing', roleName: 'Growth Marketer', count: 1 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }],
        explanation: "A successful marketing campaign relies on great content and visuals. This lean team is optimized for creative output and reaching your audience.",
        comparison: {
            'MVP Starter': [{ roleId: 'marketing', roleName: 'Growth Marketer', count: 1 }],
            'Balanced Growth': [{ roleId: 'marketing', roleName: 'Growth Marketer', count: 1 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }],
            'Fast-Track': [{ roleId: 'marketing', roleName: 'Growth Marketer', count: 2 }, { roleId: 'designer', roleName: 'UI/UX Designer', count: 1 }, { roleId: 'fe-dev', roleName: 'Frontend Dev', count: 1 }],
        }
    },
};
// --- End Team Builder ---

const findCandidateByUserId = (userId: string) => CANDIDATES.find(c => c.email === USERS.find(u => u.id === userId)?.email);
const findCandidateById = (candidateId: string) => CANDIDATES.find(c => c.id === candidateId);

const createNotification = (userId: string, type: NotificationType, message: string, link: string) => {
    const newNotification: Notification = {
        id: `notif-${Date.now()}-${Math.random()}`,
        userId,
        type,
        message,
        link,
        isRead: false,
        createdAt: new Date().toISOString(),
    };
    NOTIFICATIONS.unshift(newNotification);
};

// MOCK API LAYER
const api = {
  // Auth
  login: async (email: string): Promise<User | null> => {
    await new Promise(res => setTimeout(res, 500));
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? {...user} : null;
  },
  
  register: async (details: { name: string; email: string; role: Role; orgName?: string }): Promise<User | null> => {
    await new Promise(res => setTimeout(res, 800));
    if (USERS.some(u => u.email.toLowerCase() === details.email.toLowerCase())) {
        return null; // Email already exists
    }

    const newUserId = `user-${USERS.length + 1}`;
    let newUser: User = { id: newUserId, name: details.name, email: details.email, role: details.role };

    if (details.role === Role.CLIENT_ADMIN && details.orgName) {
        const newOrgId = `org-${ORGANIZATIONS.length + 1}`;
        const newOrg: Organization = { id: newOrgId, name: details.orgName, subscriptionStatus: SubscriptionStatus.TRIALING, members: [] };
        newUser.organizationId = newOrgId;
        newOrg.members.push(newUser);
        ORGANIZATIONS.push(newOrg);
    } else if (details.role === Role.CANDIDATE) {
        const newCandId = `cand-${newUserId.split('-')[1]}`;
        const newCandidate: Candidate = { id: newCandId, name: details.name, email: details.email, skills: [], experience: '', expectedRate: '' };
        CANDIDATES.push(newCandidate);
    }
    
    USERS.push(newUser);
    return {...newUser};
  },
  
  verifyOtp: async (email: string, otp: string): Promise<boolean> => {
    await new Promise(res => setTimeout(res, 500));
    // In a real app, you'd verify against a stored OTP. For demo, it's always '123456'.
    return otp === '123456';
  },

  getUser: async (userId: string): Promise<User | null> => {
    const user = USERS.find(u => u.id === userId);
    return user ? {...user} : null;
  },
  
  getUserByEmail: async (email: string): Promise<User | null> => {
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  },

  // Organizations
  getAllOrganizations: async (): Promise<Organization[]> => [...ORGANIZATIONS],
  getOrganization: async (id: string): Promise<Organization | null> => {
    const org = ORGANIZATIONS.find(o => o.id === id);
    return org ? {...org} : null;
  },
  createOrganization: async (data: Omit<Organization, 'id' | 'members' | 'subscriptionStatus'>): Promise<Organization> => {
      const newOrg: Organization = {
          id: `org-${Date.now()}`,
          ...data,
          members: [],
          subscriptionStatus: SubscriptionStatus.TRIALING,
      };
      ORGANIZATIONS.push(newOrg);
      return newOrg;
  },
  updateOrganization: async (id: string, data: Partial<Organization>): Promise<Organization> => {
      ORGANIZATIONS = ORGANIZATIONS.map(org => org.id === id ? { ...org, ...data } : org);
      return ORGANIZATIONS.find(org => org.id === id)!;
  },
  deleteOrganization: async (id: string): Promise<void> => {
      ORGANIZATIONS = ORGANIZATIONS.filter(org => org.id !== id);
      USERS = USERS.filter(user => user.organizationId !== id);
      JOBS = JOBS.filter(job => job.organizationId !== id);
  },
  
  updateSubscription: async (orgId: string, status: SubscriptionStatus): Promise<void> => {
      ORGANIZATIONS = ORGANIZATIONS.map(org => org.id === orgId ? { ...org, subscriptionStatus: status } : org);
  },

  // Jobs
  getAllJobs: async (): Promise<Job[]> => [...JOBS],
  getJobsForOrg: async (orgId: string): Promise<Job[]> => {
      return JOBS.filter(j => j.organizationId === orgId);
  },
  createJob: async (details: Omit<Job, 'id' | 'organizationName' | 'status' | 'applicationsCount'>): Promise<Job> => {
    const org = ORGANIZATIONS.find(o => o.id === details.organizationId);
    const newJob: Job = {
        ...details,
        id: `job-${JOBS.length + 1}`,
        organizationName: org?.name || 'Unknown',
        status: JobStatus.OPEN,
        applicationsCount: 0,
    };
    JOBS.push(newJob);
    return newJob;
  },

  // Candidates
  getAllCandidates: async (): Promise<Candidate[]> => [...CANDIDATES],
  getCandidate: async (id: string): Promise<Candidate | null> => CANDIDATES.find(c => c.id === id) || null,
  getCandidateProfile: async (userId: string): Promise<Candidate | null> => {
      const user = USERS.find(u => u.id === userId);
      if (!user) return null;
      const profile = CANDIDATES.find(c => c.email === user.email);
      return profile ? {...profile} : null;
  },
  updateCandidateProfile: async (profile: Candidate): Promise<void> => {
    CANDIDATES = CANDIDATES.map(c => c.id === profile.id ? profile : c);
  },
  updateCandidateResume: async (candidateId: string, fileName: string): Promise<void> => {
    CANDIDATES = CANDIDATES.map(c => c.id === candidateId ? { ...c, resumeFileName: fileName, resumeUrl: `resume-${candidateId}.pdf` } : c);
  },
  updateCandidateAvatar: async (candidateId: string, avatarUrl: string): Promise<User | null> => {
    let targetUser: User | undefined;
    CANDIDATES = CANDIDATES.map(c => {
        if (c.id === candidateId) {
            targetUser = USERS.find(u => u.email === c.email);
            return { ...c, avatarUrl };
        }
        return c;
    });
    if (targetUser) {
        USERS = USERS.map(u => u.id === targetUser!.id ? {...u, avatarUrl} : u);
        return USERS.find(u => u.id === targetUser!.id)!;
    }
    return null;
  },
  createCandidate: async (data: Omit<Candidate, 'id'>): Promise<Candidate> => {
      const newCand: Candidate = {
          id: `cand-${Date.now()}`,
          ...data,
      };
      CANDIDATES.push(newCand);
      return newCand;
  },
  createCandidatesFromCsv: async (data: Omit<Candidate, 'id'>[]): Promise<number> => {
      let createdCount = 0;
      data.forEach(cand => {
          if (!CANDIDATES.some(c => c.email.toLowerCase() === cand.email.toLowerCase())) {
              const newCand: Candidate = { id: `cand-${Date.now()}-${createdCount}`, ...cand };
              CANDIDATES.push(newCand);
              createdCount++;
          }
      });
      return createdCount;
  },
  scrapeLinkedInProfile: async (url: string): Promise<Partial<Candidate> | null> => {
    if (!ai) {
        console.error("Gemini AI not initialized.");
        return { name: "AI Offline", skills: ["Error"], experience: "N/A", avatarUrl: '' };
    }

    try {
        const urlParts = url.split('/').filter(p => p);
        const nameSlug = urlParts[urlParts.length - 1];
        const nameFromUrl = nameSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/\d+$/, '').trim();

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the name "${nameFromUrl}" from a LinkedIn URL, generate a plausible but FAKE candidate profile. Provide a name, a list of 5-7 relevant tech skills, years of experience, and an avatar URL. The avatar URL MUST be a direct, hotlinkable image URL from Unsplash Source using the format: https://source.unsplash.com/160x160/?portrait,person,{random_seed}. Use a different random_seed each time.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        experience: { type: Type.STRING },
                        avatarUrl: { type: Type.STRING }
                    },
                },
            },
        });
        const jsonString = response.text;
        return JSON.parse(jsonString) as Partial<Candidate>;
    } catch (error) {
        console.error("Error scraping LinkedIn profile with Gemini:", error);
        return null;
    }
  },

  // Applications
  getAvailableJobs: async(): Promise<Job[]> => JOBS.filter(j => j.status === JobStatus.OPEN),
  getCandidateApplications: async(userId: string): Promise<(Application & {job?: Job})[]> => {
    const candidate = findCandidateByUserId(userId);
    if (!candidate) return [];
    return APPLICATIONS.filter(app => app.candidateId === candidate.id).map(app => ({
        ...app,
        job: JOBS.find(j => j.id === app.jobId)
    }));
  },
   getApplicationsForCandidate: async(candidateUserId: string): Promise<(Application & {job?: Job})[]> => {
    const candidate = findCandidateByUserId(candidateUserId);
    if (!candidate) return [];
     return APPLICATIONS.filter(app => app.candidateId === candidate.id).map(app => ({
        ...app,
        job: JOBS.find(j => j.id === app.jobId)
    }));
  },
  applyForJob: async(userId: string, jobId: string): Promise<void> => {
      const candidate = findCandidateByUserId(userId);
      if (!candidate) return;
      if (APPLICATIONS.some(app => app.candidateId === candidate.id && app.jobId === jobId)) return; // Already applied
      const newApp: Application = {
          id: `app-${APPLICATIONS.length + 1}`,
          candidateId: candidate.id,
          jobId,
          status: ApplicationStatus.SUBMITTED,
          appliedDate: new Date().toISOString().split('T')[0],
      };
      APPLICATIONS.push(newApp);
      const job = JOBS.find(j => j.id === jobId);
      if (job) {
          job.applicationsCount += 1;
          const orgAdmins = USERS.filter(u => u.organizationId === job.organizationId && u.role === Role.CLIENT_ADMIN);
          orgAdmins.forEach(admin => {
              createNotification(admin.id, NotificationType.NEW_APPLICATION, `${candidate.name} applied for ${job.title}.`, `/client/jobs/${jobId}`);
          });
      }
  },
  getApplicationsForJob: async(jobId: string): Promise<{applications: (Application & {candidate?: Candidate})[], jobTitle: string}> => {
      const job = JOBS.find(j => j.id === jobId);
      if(!job) return {applications: [], jobTitle: ''};
      const apps = APPLICATIONS.filter(a => a.jobId === jobId).map(app => ({
          ...app,
          candidate: CANDIDATES.find(c => c.id === app.candidateId),
          interviews: INTERVIEWS.filter(i => i.applicationId === app.id).sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
      }));
      return {applications: apps, jobTitle: job.title};
  },
  updateApplicationStatus: async (appId: string, status: ApplicationStatus): Promise<void> => {
      APPLICATIONS = APPLICATIONS.map(app => app.id === appId ? { ...app, status } : app);
      const app = APPLICATIONS.find(a => a.id === appId);
      if (app) {
          const candidateUser = USERS.find(u => u.email === CANDIDATES.find(c => c.id === app.candidateId)?.email);
          const job = JOBS.find(j => j.id === app.jobId);
          if (candidateUser && job) {
              createNotification(candidateUser.id, NotificationType.CONTRACT_ACTION, `Your application status for ${job.title} was updated to ${status}.`, `/candidate/applications`);
          }
      }
  },

  // Interviews
  getInterviewsForCandidate: async(userId: string): Promise<(Interview & { job?: Job })[]> => {
    const candidate = findCandidateByUserId(userId);
    if (!candidate) return [];
    const candidateApps = APPLICATIONS.filter(app => app.candidateId === candidate.id);
    const appIds = new Set(candidateApps.map(app => app.id));
    return INTERVIEWS.filter(i => appIds.has(i.applicationId)).map(i => {
        const app = candidateApps.find(a => a.id === i.applicationId);
        const job = JOBS.find(j => j.id === app?.jobId);
        return {...i, job };
    }).sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  },
  scheduleInterview: async (applicationId: string, details: Omit<Interview, 'id' | 'applicationId' | 'status'>): Promise<Interview> => {
      const newInterview: Interview = {
          ...details,
          id: `int-${Date.now()}`,
          applicationId,
          status: InterviewStatus.SCHEDULED,
      };
      INTERVIEWS.push(newInterview);
      const application = APPLICATIONS.find(app => app.id === applicationId);
      if (application) {
          application.interviews = [...(application.interviews || []), newInterview];
          const candidateUser = USERS.find(u => u.email === CANDIDATES.find(c => c.id === application.candidateId)?.email);
          const job = JOBS.find(j => j.id === application.jobId);
          if(candidateUser && job){
              createNotification(candidateUser.id, NotificationType.INTERVIEW_SCHEDULED, `You have a new interview for ${job.title} with ${job.organizationName}.`, `/candidate/interviews`);
          }
      }
      return newInterview;
  },
  updateInterview: async (interviewId: string, status: InterviewStatus, details?: Partial<Omit<Interview, 'id' | 'applicationId' | 'status'>>): Promise<void> => {
      await new Promise(res => setTimeout(res, 800)); // Simulate network latency
      let originalInterview = INTERVIEWS.find(i => i.id === interviewId);
      INTERVIEWS = INTERVIEWS.map(i => i.id === interviewId ? { ...i, ...details, status } : i);
      
      const interview = INTERVIEWS.find(i => i.id === interviewId);
      const app = APPLICATIONS.find(a => a.id === interview?.applicationId);
      if (interview && app) {
          const job = JOBS.find(j => j.id === app.jobId);
          if (!job) return;

          const clientAdmin = USERS.find(u => u.organizationId === job.organizationId && u.role === Role.CLIENT_ADMIN);
          const candidateUser = USERS.find(u => u.email === CANDIDATES.find(c => c.id === app.candidateId)?.email);

          if (status === InterviewStatus.RESCHEDULE_REQUESTED_BY_CANDIDATE && clientAdmin) {
              createNotification(clientAdmin.id, NotificationType.INTERVIEW_SCHEDULED, `${candidateUser?.name} requested to reschedule an interview for ${job.title}.`, `/client/jobs/${app.jobId}`);
          } else if (status === InterviewStatus.DECLINED_BY_CANDIDATE && clientAdmin) {
               createNotification(clientAdmin.id, NotificationType.INTERVIEW_SCHEDULED, `${candidateUser?.name} declined an interview for ${job.title}.`, `/client/jobs/${app.jobId}`);
          } 
          // Client initiated reschedule
          else if (details && originalInterview?.status === InterviewStatus.SCHEDULED && status === InterviewStatus.SCHEDULED && candidateUser) {
               createNotification(candidateUser.id, NotificationType.INTERVIEW_SCHEDULED, `Your interview for ${job.title} has been rescheduled. Please check the new details.`, `/candidate/interviews`);
          }
      }
  },
   cancelInterview: async(interviewId: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 800)); // Simulate network latency
    INTERVIEWS = INTERVIEWS.map(i => i.id === interviewId ? { ...i, status: InterviewStatus.CANCELLED_BY_CLIENT } : i);
    const interview = INTERVIEWS.find(i => i.id === interviewId);
    const app = APPLICATIONS.find(a => a.id === interview?.applicationId);
    if (interview && app) {
        const candidateUser = USERS.find(u => u.email === CANDIDATES.find(c => c.id === app.candidateId)?.email);
        const job = JOBS.find(j => j.id === app.jobId);
        if (candidateUser && job) {
            createNotification(candidateUser.id, NotificationType.INTERVIEW_SCHEDULED, `Your interview for ${job.title} has been cancelled by ${job.organizationName}.`, `/candidate/interviews`);
        }
    }
  },
  getInterviewById: async (interviewId: string): Promise<(Interview & { job?: Job }) | null> => {
      const interview = INTERVIEWS.find(i => i.id === interviewId);
      if (!interview) return null;
      const application = APPLICATIONS.find(a => a.id === interview.applicationId);
      const job = JOBS.find(j => j.id === application?.jobId);
      return { ...interview, job };
  },

  // Messaging
  getConversationsForUser: async (userId: string): Promise<Conversation[]> => {
      return CONVERSATIONS.filter(c => c.participants.some(p => p.id === userId))
        .sort((a,b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());
  },
  getMessagesForConversation: async (conversationId: string): Promise<Message[]> => {
      return MESSAGES.filter(m => m.conversationId === conversationId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },
  sendMessage: async (conversationId: string, senderId: string, text: string, attachment?: MessageAttachment): Promise<Message> => {
      const newMessage: Message = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId,
          text,
          timestamp: new Date().toISOString(),
          attachment,
      };
      MESSAGES.push(newMessage);
      CONVERSATIONS = CONVERSATIONS.map(c => c.id === conversationId ? {
          ...c,
          lastMessageSnippet: text || 'Attachment sent',
          lastMessageTimestamp: newMessage.timestamp,
          unreadCount: (c.unreadCount || 0) + 1,
      } : c);
      return newMessage;
  },
  createConversation: async(adminId: string, recipient: ConversationParticipant): Promise<Conversation> => {
      const adminUser = USERS.find(u => u.id === adminId)!;
      const newConvo: Conversation = {
          id: `convo-${Date.now()}`,
          participants: [{id: adminUser.id, name: adminUser.name, role: adminUser.role}, recipient],
          lastMessageSnippet: 'Conversation started.',
          lastMessageTimestamp: new Date().toISOString(),
      };
      CONVERSATIONS.push(newConvo);
      return newConvo;
  },
  markConversationAsRead: async(conversationId: string): Promise<void> => {
      CONVERSATIONS = CONVERSATIONS.map(c => c.id === conversationId ? {...c, unreadCount: 0} : c);
  },
  findOrCreateConversation: async(clientId: string, candidateUserId: string): Promise<Conversation> => {
      let conversation = CONVERSATIONS.find(c => 
        c.participants.some(p => p.id === clientId) && 
        c.participants.some(p => p.id === candidateUserId)
      );
      if (conversation) return conversation;
      
      const client = USERS.find(u => u.id === clientId)!;
      const candidateUser = USERS.find(u => u.id === candidateUserId)!;
      
      const newConversation: Conversation = {
        id: `convo-${Date.now()}`,
        participants: [
          {id: client.id, name: ORGANIZATIONS.find(o => o.id === client.organizationId)?.name || client.name, role: client.role},
          {id: candidateUser.id, name: candidateUser.name, role: candidateUser.role}
        ],
        lastMessageSnippet: 'Conversation started.',
        lastMessageTimestamp: new Date().toISOString(),
      };
      CONVERSATIONS.push(newConversation);
      return newConversation;
  },

    // --- Team Builder ---
    generateTeamSuggestion: async (project: ProjectDetails): Promise<SimulationResult> => {
        await new Promise(res => setTimeout(res, 1000));
        const template = PROJECT_TEMPLATES[project.category];
        const totalWorkUnits = template.workUnits;

        const calculateTeamPerformance = (team: TeamMember[]) => {
            let weeklyWorkUnits = 0;
            let weeklyCost = 0;
            team.forEach(member => {
                const roleData = ROLES_DATABASE.find(r => r.id === member.roleId);
                if (roleData) {
                    weeklyWorkUnits += roleData.workUnitsPerWeek * member.count;
                    weeklyCost += roleData.costPerHour * roleData.avgWeeklyHours * member.count;
                }
            });
            return { weeklyWorkUnits, weeklyCost };
        };

        const { weeklyWorkUnits, weeklyCost } = calculateTeamPerformance(template.team);
        const estimatedWeeks = weeklyWorkUnits > 0 ? Math.ceil(totalWorkUnits / weeklyWorkUnits) : 0;
        const estimatedCost = estimatedWeeks * weeklyCost;

        return {
            team: template.team,
            estimatedWeeks,
            estimatedCost,
            aiExplanation: template.explanation,
            comparisonOptions: template.comparison,
        };
    },
    runSimulation: (team: TeamMember[], project: ProjectDetails) => {
        const template = PROJECT_TEMPLATES[project.category];
        const totalWorkUnits = template.workUnits;

        let weeklyWorkUnits = 0;
        let weeklyCost = 0;
        team.forEach(member => {
            const roleData = ROLES_DATABASE.find(r => r.id === member.roleId);
            if (roleData) {
                weeklyWorkUnits += roleData.workUnitsPerWeek * member.count;
                weeklyCost += roleData.costPerHour * roleData.avgWeeklyHours * member.count;
            }
        });

        const estimatedWeeks = weeklyWorkUnits > 0 ? Math.ceil(totalWorkUnits / weeklyWorkUnits) : 0;
        const estimatedCost = estimatedWeeks * weeklyCost;

        return { estimatedWeeks, estimatedCost };
    },
    createShortlistRequest: async (organizationId: string, projectDetails: ProjectDetails, requestedTeam: TeamMember[]): Promise<ShortlistRequest> => {
        const org = ORGANIZATIONS.find(o => o.id === organizationId);
        const newRequest: ShortlistRequest = {
            id: `slr-${Date.now()}`,
            organizationId,
            organizationName: org?.name || 'Unknown Org',
            projectDetails,
            requestedTeam,
            status: ShortlistRequestStatus.PENDING,
            requestedDate: new Date().toISOString(),
            assignedCandidates: [],
        };
        SHORTLIST_REQUESTS.push(newRequest);
        return newRequest;
    },
    getShortlistRequestsForOrg: async (organizationId: string): Promise<ShortlistRequest[]> => {
        return SHORTLIST_REQUESTS.filter(r => r.organizationId === organizationId).sort((a,b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
    },
    getShortlistRequestsForAdmin: async (): Promise<ShortlistRequest[]> => {
        return [...SHORTLIST_REQUESTS].sort((a,b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
    },
    assignCandidatesToRequest: async (requestId: string, candidateIds: string[]): Promise<void> => {
        const candidates = CANDIDATES.filter(c => candidateIds.includes(c.id));
        SHORTLIST_REQUESTS = SHORTLIST_REQUESTS.map(r => r.id === requestId ? { ...r, assignedCandidates: candidates, status: ShortlistRequestStatus.FULFILLED } : r);
        const request = SHORTLIST_REQUESTS.find(r => r.id === requestId);
        if (request) {
            const orgAdmin = USERS.find(u => u.organizationId === request.organizationId && u.role === Role.CLIENT_ADMIN);
            if (orgAdmin) {
                createNotification(orgAdmin.id, NotificationType.SHORTLIST_FULFILLED, `Your shortlist for "${request.projectDetails.goal}" is ready.`, `/client/shortlists`);
            }
        }
    },
    // --- Contracts ---
    generateContract: async (applicationId: string): Promise<Contract | null> => {
        const app = APPLICATIONS.find(a => a.id === applicationId);
        if (!app) return null;
        const job = JOBS.find(j => j.id === app.jobId);
        const candidate = CANDIDATES.find(c => c.id === app.candidateId);
        const org = ORGANIZATIONS.find(o => o.id === job?.organizationId);
        if (!job || !candidate || !org) return null;

        const content = `This Independent Contractor Agreement ("Agreement") is entered into between ${org.name} ("Company") and ${candidate.name} ("Contractor").\n\n1. Services: Contractor agrees to perform services as a ${job.title} for the Company.\n\n2. Compensation: The Company agrees to pay the Contractor ${candidate.expectedRate}.\n\n3. Term: This Agreement will begin on the date of signing and will continue until terminated by either party with 14 days written notice.\n\n4. Confidentiality: Contractor agrees to keep all Company information confidential.\n\n5. Independent Contractor Status: Contractor is an independent contractor, not an employee of the Company.\n\nIN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.`;

        const newContract: Contract = {
            id: `contract-${Date.now()}`,
            applicationId,
            organizationId: org.id,
            candidateId: candidate.id,
            jobTitle: job.title,
            clientName: org.name,
            candidateName: candidate.name,
            content,
            status: ContractStatus.PENDING_CLIENT_SIGNATURE,
            generatedDate: new Date().toISOString(),
        };
        CONTRACTS.push(newContract);
        return newContract;
    },
    getContractsForOrg: async (organizationId: string): Promise<Contract[]> => {
        return CONTRACTS.filter(c => c.organizationId === organizationId).sort((a,b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime());
    },
    getContractsForCandidate: async (userId: string): Promise<Contract[]> => {
        const candidate = findCandidateByUserId(userId);
        if (!candidate) return [];
        return CONTRACTS.filter(c => c.candidateId === candidate.id).sort((a,b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime());
    },
    getAllContracts: async(): Promise<Contract[]> => [...CONTRACTS].sort((a,b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime()),
    signContract: async (contractId: string, userId: string, signature: string): Promise<void> => {
        const contract = CONTRACTS.find(c => c.id === contractId);
        if (!contract) return;
        const user = USERS.find(u => u.id === userId);
        if (!user) return;
        
        if (user.role.startsWith('CLIENT') && contract.status === ContractStatus.PENDING_CLIENT_SIGNATURE) {
            contract.clientSignature = signature;
            contract.clientSignedDate = new Date().toISOString();
            contract.status = ContractStatus.PENDING_CANDIDATE_SIGNATURE;
            const candidateUser = USERS.find(u => u.email === contract.candidateName.split(' ')[0].toLowerCase() + '.dev@email.com'); // Hack for demo
            if (candidateUser) {
                createNotification(candidateUser.id, NotificationType.CONTRACT_ACTION, `${contract.clientName} has signed your contract for ${contract.jobTitle}.`, '/candidate/contracts');
            }
        } else if (user.role === Role.CANDIDATE && contract.status === ContractStatus.PENDING_CANDIDATE_SIGNATURE) {
            contract.candidateSignature = signature;
            contract.candidateSignedDate = new Date().toISOString();
            contract.status = ContractStatus.SIGNED;
            const clientAdmin = USERS.find(u => u.organizationId === contract.organizationId && u.role === Role.CLIENT_ADMIN);
            if (clientAdmin) {
                createNotification(clientAdmin.id, NotificationType.CONTRACT_ACTION, `${contract.candidateName} has signed the contract for ${contract.jobTitle}. It's official!`, '/client/contracts');
            }
        }
    },
    // --- Payments ---
    initiatePayment: async (contractId: string, amount: number, notes?: string): Promise<void> => {
        const contract = CONTRACTS.find(c => c.id === contractId);
        if (!contract) return;
        const newPayment: Payment = {
            id: `pay-${Date.now()}`,
            contractId,
            organizationId: contract.organizationId,
            candidateId: contract.candidateId,
            clientName: contract.clientName,
            candidateName: contract.candidateName,
            amount,
            notes,
            paymentDate: new Date().toISOString(),
            status: PaymentStatus.PENDING_DISBURSEMENT,
        };
        PAYMENTS.push(newPayment);
    },
    disbursePayment: async (paymentId: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 1000));
        PAYMENTS = PAYMENTS.map(p => p.id === paymentId ? { ...p, status: PaymentStatus.DISBURSED, disbursementDate: new Date().toISOString() } : p);
        const payment = PAYMENTS.find(p => p.id === paymentId);
        if(payment){
            const candidateUser = USERS.find(u => u.email === CANDIDATES.find(c => c.id === payment.candidateId)?.email);
            if(candidateUser){
                createNotification(candidateUser.id, NotificationType.PAYMENT_DISBURSED, `A payment of $${payment.amount} from ${payment.clientName} has been disbursed to you.`, '/candidate/payments');
            }
        }
    },
    getAllPayments: async (): Promise<Payment[]> => [...PAYMENTS],
    getPaymentsForOrg: async (organizationId: string): Promise<Payment[]> => PAYMENTS.filter(p => p.organizationId === organizationId),
    getPaymentsForCandidate: async (userId: string): Promise<Payment[]> => {
        const candidate = findCandidateByUserId(userId);
        if (!candidate) return [];
        return PAYMENTS.filter(p => p.candidateId === candidate.id && p.status === PaymentStatus.DISBURSED);
    },
    // --- Notifications ---
    getNotificationsForUser: async (userId: string): Promise<Notification[]> => NOTIFICATIONS.filter(n => n.userId === userId),
    markNotificationAsRead: async (notificationId: string): Promise<void> => {
        NOTIFICATIONS = NOTIFICATIONS.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
    },
    // --- Dashboard Stats ---
    getAdminDashboardStats: async () => {
        const activeOrgs = ORGANIZATIONS.filter(o => o.subscriptionStatus === SubscriptionStatus.ACTIVE).length;
        const trialingOrgs = ORGANIZATIONS.filter(o => o.subscriptionStatus === SubscriptionStatus.TRIALING).length;
        const candidatePoolSize = CANDIDATES.length;
        const openJobs = JOBS.filter(j => j.status === JobStatus.OPEN).length;
        return { activeOrgs, trialingOrgs, candidatePoolSize, openJobs };
    },
    getClientDashboardStats: async (organizationId: string) => {
        const openJobs = JOBS.filter(j => j.organizationId === organizationId && j.status === JobStatus.OPEN).length;
        const jobIds = new Set(JOBS.filter(j => j.organizationId === organizationId).map(j => j.id));
        const totalApplications = APPLICATIONS.filter(a => jobIds.has(a.jobId)).length;
        const activeHires = CONTRACTS.filter(c => c.organizationId === organizationId && c.status === ContractStatus.SIGNED).length;
        const pendingShortlists = SHORTLIST_REQUESTS.filter(r => r.organizationId === organizationId && r.status === ShortlistRequestStatus.PENDING).length;
        return { openJobs, totalApplications, activeHires, pendingShortlists };
    },
    getRecentActivityForOrg: async (organizationId: string): Promise<(Application & { candidate?: Candidate, job?: Job })[]> => {
        const jobIds = new Set(JOBS.filter(j => j.organizationId === organizationId).map(j => j.id));
        return APPLICATIONS
            .filter(a => jobIds.has(a.jobId))
            .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
            .slice(0, 5)
            .map(app => ({
                ...app,
                candidate: CANDIDATES.find(c => c.id === app.candidateId),
                job: JOBS.find(j => j.id === app.jobId),
            }));
    },
};

export default api;
