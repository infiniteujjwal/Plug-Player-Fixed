

export enum Role {
  ADMIN = 'ADMIN',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  CLIENT_MEMBER = 'CLIENT_MEMBER',
  CANDIDATE = 'CANDIDATE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId?: string;
  avatarUrl?: string;
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    TRIALING = 'trialing',
    HOLD = 'on-hold',
}

export interface Organization {
    id: string;
    name: string;
    email?: string;
    subscriptionStatus: SubscriptionStatus;
    members: User[];
    address?: string;
    country?: string;
    industry?: string;
    businessId?: string;
    contactPerson?: string;
}

export enum JobStatus {
    OPEN = 'Open',
    CLOSED = 'Closed',
    DRAFT = 'Draft',
}

export interface Job {
    id: string;
    title: string;
    organizationId: string;
    organizationName: string;
    location: string;
    salaryRange: string;
    description: string;
    status: JobStatus;
    applicationsCount: number;
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    skills: string[];
    experience: string;
    expectedRate: string;
    resumeUrl?: string;
    resumeFileName?: string;
    avatarUrl?: string;
    linkedinUrl?: string;
}

export enum ApplicationStatus {
    SUBMITTED = 'Submitted',
    SHORTLISTED = 'Shortlisted',
    INTERVIEW = 'Interview',
    OFFER = 'Offer',
    HIRED = 'Hired',
    REJECTED = 'Rejected',
}

export enum InterviewPlatform {
  GOOGLE_MEET = 'Google Meet',
  ZOOM = 'Zoom',
  MICROSOFT_TEAMS = 'Microsoft Teams',
  OTHER = 'Other',
}

export enum InterviewStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED_BY_CLIENT = 'Cancelled by Client',
  RESCHEDULE_REQUESTED_BY_CANDIDATE = 'Reschedule Requested',
  DECLINED_BY_CANDIDATE = 'Declined by Candidate',
}

export interface Interview {
  id: string;
  applicationId: string;
  dateTime: string; // ISO string
  platform: InterviewPlatform;
  meetingLink?: string;
  notes?: string;
  status: InterviewStatus;
}

export interface Application {
    id: string;
    candidateId: string;
    jobId: string;
    status: ApplicationStatus;
    appliedDate: string;
    candidate?: Candidate;
    job?: Job;
    interviews?: Interview[];
}

export interface Shortlist {
    id: string;
    jobId: string;
    candidateId: string;
    notes: string;
}

// --- Messaging Types ---
interface CandidateProfileAttachment {
    type: 'candidateProfile';
    candidateId: string;
}

interface InterviewAttachment {
    type: 'interview';
    interviewId: string;
}

export type MessageAttachment = CandidateProfileAttachment | InterviewAttachment;


export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO string
  attachment?: MessageAttachment;
}

export interface ConversationParticipant {
    id: string;
    name: string;
    role?: Role;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessageSnippet: string;
  lastMessageTimestamp: string;
  unreadCount?: number;
}

// --- New Auto-Team Builder Types ---

export enum ProjectCategory {
    SAAS = 'SaaS',
    ECOMMERCE = 'E-commerce',
    MOBILE_APP = 'Mobile App',
    MARKETING_CAMPAIGN = 'Marketing Campaign',
}

export interface ProjectDetails {
    goal: string;
    category: ProjectCategory;
    timeline: number; // in weeks
    budget: number; // monthly
}

export interface TeamRole {
    id: string;
    name: string;
    skills: string[];
    avgWeeklyHours: number;
    costPerHour: number;
    workUnitsPerWeek: number;
}

export interface TeamMember {
    roleId: string;
    roleName: string;
    count: number;
}

export interface SimulationResult {
    team: TeamMember[];
    estimatedWeeks: number;
    estimatedCost: number;
    aiExplanation: string;
    comparisonOptions: {
        [key: string]: TeamMember[];
    };
}

// --- New Shortlist Request Types ---

export enum ShortlistRequestStatus {
    PENDING = 'Pending',
    FULFILLED = 'Fulfilled',
}

export interface ShortlistRequest {
    id: string;
    organizationId: string;
    organizationName: string;
    projectDetails: ProjectDetails;
    requestedTeam: TeamMember[];
    status: ShortlistRequestStatus;
    requestedDate: string; // ISO String
    assignedCandidates: Candidate[];
}

// --- New Contract Types ---

export enum ContractStatus {
  PENDING_CLIENT_SIGNATURE = 'Pending Client Signature',
  PENDING_CANDIDATE_SIGNATURE = 'Pending Candidate Signature',
  SIGNED = 'Signed',
  CANCELLED = 'Cancelled',
}

export interface Contract {
  id: string;
  applicationId: string;
  organizationId: string;
  candidateId: string;
  jobTitle: string;
  clientName: string;
  candidateName: string;
  content: string;
  status: ContractStatus;
  generatedDate: string; // ISO string
  clientSignedDate?: string;
  candidateSignedDate?: string;
  clientSignature?: string;
  candidateSignature?: string;
}

// --- New Payment Types ---

export enum PaymentStatus {
  PENDING_DISBURSEMENT = 'Pending Disbursement',
  DISBURSED = 'Disbursed',
}

export interface Payment {
  id: string;
  contractId: string;
  organizationId: string;
  candidateId: string;
  clientName: string;
  candidateName: string;
  amount: number;
  notes?: string;
  paymentDate: string; // ISO string when client pays
  disbursementDate?: string; // ISO string when admin disburses
  status: PaymentStatus;
}

// --- New Notification Types ---
export enum NotificationType {
    NEW_APPLICATION = 'NEW_APPLICATION',
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
    CONTRACT_ACTION = 'CONTRACT_ACTION',
    PAYMENT_DISBURSED = 'PAYMENT_DISBURSED',
    SHORTLIST_FULFILLED = 'SHORTLIST_FULFILLED',
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  link: string; // URL to navigate to
  isRead: boolean;
  createdAt: string; // ISO string
  type: NotificationType;
}