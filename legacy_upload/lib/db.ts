import { User, Role, Organization, SubscriptionStatus, Job, JobStatus, Candidate, Application, ApplicationStatus, Conversation, Message, ConversationParticipant, MessageAttachment, TeamRole, ProjectCategory, TeamMember, SimulationResult, ProjectDetails, ShortlistRequest, ShortlistRequestStatus, Contract, ContractStatus, Payment, PaymentStatus, Interview, InterviewPlatform, InterviewStatus, Notification, NotificationType } from '../types';

// This file acts as our in-memory database.
// In a real application, this would be replaced with a database client like Prisma or Drizzle.

const MOCK_AVATAR_1 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80';
const MOCK_AVATAR_2 = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80';

// MOCK DATABASE (made mutable)
let USERS: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@plugplayers.com', role: Role.ADMIN },
  { id: 'user-2', name: 'Alice (Client Admin)', email: 'alice@startup.com', role: Role.CLIENT_ADMIN, organizationId: 'org-1' },
  { id: 'user-3', name: 'Bob (Client Member)', email: 'bob@startup.com', role: Role.CLIENT_MEMBER, organizationId: 'org-1' },
  { id: 'user-4', name: 'Charlie (Candidate)', email: 'charlie.dev@email.com', role: Role.CANDIDATE, avatarUrl: MOCK_AVATAR_1 },
  { id: 'user-5', name: 'Diana (Client Admin, No Subscription)', email: 'diana@freetier.com', role: Role.CLIENT_ADMIN, organizationId: 'org-2' },
  { id: 'user-6', name: 'Eve (Candidate)', email: 'eve.designer@email.com', role: Role.CANDIDATE, avatarUrl: MOCK_AVATAR_2 },
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

export const PROJECT_TEMPLATES: Record<ProjectCategory, { workUnits: number; team: TeamMember[]; explanation: string; comparison: { [key: string]: TeamMember[] } }> = {
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

const findCandidateByUserId = (userId: string) => CANDIDATES.find(c => c.email === USERS.find(u => u.id === userId)?.email);

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

// Export the database and utility functions for the API routes to use.
export const db = {
    USERS,
    ORGANIZATIONS,
    CANDIDATES,
    JOBS,
    APPLICATIONS,
    CONVERSATIONS,
    MESSAGES,
    INTERVIEWS,
    SHORTLIST_REQUESTS,
    CONTRACTS,
    PAYMENTS,
    NOTIFICATIONS,
    ROLES_DATABASE,
    PROJECT_TEMPLATES,
    utils: {
        findCandidateByUserId,
        createNotification,
    }
};
