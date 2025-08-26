import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/Layout';
import { Card, Badge, Button, Modal, Input, Label, Textarea, Select, Avatar } from '../components/ui';
import { CandidateProfileModal, ViewShortlistModal, ContractModal, MakePaymentModal, ScheduleInterviewModal } from '../components/modals';
import { Job, JobStatus, Organization, SubscriptionStatus, Application, Candidate, ApplicationStatus, ShortlistRequest, ShortlistRequestStatus, Contract, ContractStatus, Role, Payment, PaymentStatus, Interview, InterviewStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import api from '../data';
import MessagesPage from './MessagesPage';
import TeamBuilderPage from './TeamBuilderPage'; // Import the new Team Builder page
import DashboardCard from '../components/DashboardCard';

const STRIPE_CHECKOUT_LINK = 'https://buy.stripe.com/5kA15t13BflHeKk9AB';

const Icons = {
    Jobs: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25V14.15M18.75 18.75v-6.098a2.25 2.25 0 00-2.25-2.25h-3.51a2.25 2.25 0 00-2.25 2.25v6.098M18.75 18.75h-15M12 12.75h.008v.008H12v-.008z" /></svg>,
    Applications: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    Contracts: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    Shortlist: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    TeamBuilder: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.036-.259a3.375 3.375 0 002.455-2.456L18 13.5z" /></svg>,
    Payments: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

const SubscriptionBanner: React.FC<{ status: SubscriptionStatus; onUpgrade: () => void }> = ({ status, onUpgrade }) => {
    if (status === SubscriptionStatus.ACTIVE) return null;
    
    const message = status === SubscriptionStatus.INACTIVE 
        ? "Your subscription is inactive. Please upgrade to post jobs and view candidates."
        : "You are currently on a trial. Upgrade to a full plan to unlock all features.";

    return (
        <div className="bg-primary-50 dark:bg-primary-950/50 border-l-4 border-primary-500 p-4 mb-6">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-primary-500 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-primary-700 dark:text-primary-200">
                        {message}
                        <a href={STRIPE_CHECKOUT_LINK} target="_blank" rel="noopener noreferrer" className="ml-2 font-medium text-primary-600 dark:text-primary-300 underline hover:text-primary-500 dark:hover:text-primary-200">
                           {status === SubscriptionStatus.INACTIVE ? 'Upgrade to Activate' : 'Upgrade Now'}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

const PostJobModal: React.FC<{isOpen: boolean, onClose: () => void, onCreated: () => void, orgId: string }> = ({isOpen, onClose, onCreated, orgId}) => {
    const [jobDetails, setJobDetails] = useState({title: '', location: '', salaryRange: '', description: ''});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setJobDetails({...jobDetails, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await api.createJob({...jobDetails, organizationId: orgId});
        setLoading(false);
        onCreated();
        setJobDetails({title: '', location: '', salaryRange: '', description: ''});
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Post a New Job">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="title">Job Title</Label><Input id="title" name="title" type="text" value={jobDetails.title} onChange={handleChange} required /></div>
                <div><Label htmlFor="location">Location</Label><Input id="location" name="location" type="text" value={jobDetails.location} onChange={handleChange} required /></div>
                <div><Label htmlFor="salaryRange">Salary Range</Label><Input id="salaryRange" name="salaryRange" type="text" value={jobDetails.salaryRange} onChange={handleChange} required /></div>
                <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={jobDetails.description} onChange={handleChange} required /></div>
                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</Button>
                </div>
            </form>
        </Modal>
    )
}

const DashboardView: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ openJobs: 0, totalApplications: 0, activeHires: 0, pendingShortlists: 0 });
    const [activity, setActivity] = useState<(Application & { candidate?: Candidate, job?: Job })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.organizationId) {
            setLoading(true);
            Promise.all([
                api.getClientDashboardStats(user.organizationId),
                api.getRecentActivityForOrg(user.organizationId)
            ]).then(([statsData, activityData]) => {
                setStats(statsData);
                setActivity(activityData);
                setLoading(false);
            });
        }
    }, [user]);
    
    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Open Jobs" value={stats.openJobs} icon={<Icons.Jobs className="h-6 w-6"/>} />
                <DashboardCard title="Total Applications" value={stats.totalApplications} icon={<Icons.Applications className="h-6 w-6"/>} />
                <DashboardCard title="Active Hires" value={stats.activeHires} icon={<Icons.Contracts className="h-6 w-6"/>} />
                <DashboardCard title="Pending Shortlists" value={stats.pendingShortlists} icon={<Icons.Shortlist className="h-6 w-6"/>} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card title="Recent Activity">
                         {activity.length > 0 ? (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-800 -m-6">
                                {activity.map(app => (
                                    <li key={app.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <div className="flex items-center space-x-4">
                                            <Avatar src={app.candidate?.avatarUrl} name={app.candidate?.name} size="md"/>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    <span className="font-bold">{app.candidate?.name}</span> applied for the <Link to={`/client/jobs/${app.jobId}`} className="text-primary-600 dark:text-primary-400 hover:underline">{app.job?.title}</Link> role.
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {new Date(app.appliedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <Link to={`/client/jobs/${app.jobId}`}>
                                                <Button variant="ghost" size="sm">View</Button>
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-gray-500 py-8">No recent applications found.</p>
                        )}
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-1">
                    <Card title="Quick Actions">
                        <ul className="space-y-3">
                            <li><Link to="/client/jobs"><Button className="w-full justify-start" variant="secondary"><Icons.Jobs className="w-5 h-5 mr-3"/> Manage Job Postings</Button></Link></li>
                            <li><Link to="/client/team-builder"><Button className="w-full justify-start" variant="secondary"><Icons.TeamBuilder className="w-5 h-5 mr-3"/> Launch AI Team Builder</Button></Link></li>
                            <li><Link to="/client/payments"><Button className="w-full justify-start" variant="secondary"><Icons.Payments className="w-5 h-5 mr-3"/> Make a Payment</Button></Link></li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const JobsListView: React.FC = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchJobs = useCallback(() => {
        if(user?.organizationId) api.getJobsForOrg(user.organizationId).then(setJobs);
    }, [user]);

    useEffect(() => { fetchJobs() }, [fetchJobs]);

    const statusColorMap: Record<JobStatus, 'green' | 'gray' | 'yellow'> = {
        [JobStatus.OPEN]: 'green',
        [JobStatus.CLOSED]: 'gray',
        [JobStatus.DRAFT]: 'yellow',
    };

    return (
        <>
            {user?.organizationId && <PostJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={() => { setIsModalOpen(false); fetchJobs(); }} orgId={user.organizationId}/>}
            <Card title="Your Job Postings" actions={<Button onClick={() => setIsModalOpen(true)}>Post a New Job</Button>}>
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between hover:border-gray-300 dark:hover:border-gray-700 transition">
                            <div className="mb-4 sm:mb-0">
                                <Link to={`/client/jobs/${job.id}`} className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-bold text-lg">{job.title}</Link>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge color={statusColorMap[job.status]}>{job.status}</Badge>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{job.applicationsCount} Applications</span>
                                </div>
                            </div>
                            <Link to={`/client/jobs/${job.id}`}>
                                <Button variant="secondary" size="sm">View Applicants</Button>
                            </Link>
                        </div>
                    ))}
                    {jobs.length === 0 && <p className="text-center text-gray-500 py-8">No jobs posted yet.</p>}
                </div>
            </Card>
        </>
    );
};

const JobDetailsView: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState<(Application & { candidate?: Candidate, interviews?: Interview[] })[]>([]);
    const [jobTitle, setJobTitle] = useState('');
    const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
    const [newlyGeneratedContract, setNewlyGeneratedContract] = useState<Contract | null>(null);
    const [isGeneratingContract, setIsGeneratingContract] = useState(false);
    const [applicationBeingProcessed, setApplicationBeingProcessed] = useState<string | null>(null);
    const [schedulingForApp, setSchedulingForApp] = useState<(Application & { interview?: Interview }) | null>(null);
    const [cancellingInterviewId, setCancellingInterviewId] = useState<string | null>(null);

    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
            setOpenActionMenu(null);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [actionMenuRef]);

    const fetchApplications = useCallback(() => {
         if(jobId) {
            api.getApplicationsForJob(jobId).then(data => {
                setApplications(data.applications);
                setJobTitle(data.jobTitle);
            });
         }
    }, [jobId])

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleStatusChange = async (app: Application, status: ApplicationStatus) => {
        setApplicationBeingProcessed(app.id);

        if (status === ApplicationStatus.HIRED) {
            setIsGeneratingContract(true);
            try {
                await api.updateApplicationStatus(app.id, status);
                const contract = await api.generateContract(app.id);
                if (contract) {
                    setNewlyGeneratedContract(contract);
                } else {
                    alert('Failed to generate the contract. The candidate has been marked as Hired, but you may need to generate the contract manually.');
                }
            } catch (error) {
                console.error("Error hiring candidate and generating contract:", error);
                alert('An error occurred. Please try again.');
            } finally {
                setIsGeneratingContract(false);
                setApplicationBeingProcessed(null);
                fetchApplications();
            }
        } else {
            await api.updateApplicationStatus(app.id, status);
            fetchApplications();
            setApplicationBeingProcessed(null);
        }
    };
    
    const handleCancelInterview = async (interviewId: string) => {
        if (window.confirm("Are you sure you want to cancel this interview? The candidate will be notified.")) {
            setCancellingInterviewId(interviewId);
            await api.cancelInterview(interviewId);
            fetchApplications();
            setCancellingInterviewId(null);
        }
    };

    const handleMessageCandidate = async (candidate: Candidate) => {
        if (!user) return;
        const candidateUser = await api.getUserByEmail(candidate.email);
        if (!candidateUser) {
            alert("Could not find a user account for this candidate.");
            return;
        }
        const conversation = await api.findOrCreateConversation(user.id, candidateUser.id);
        navigate(`/client/messages/${conversation.id}`);
    };


    return (
        <div>
            <ScheduleInterviewModal
                isOpen={!!schedulingForApp}
                onClose={() => setSchedulingForApp(null)}
                application={schedulingForApp}
                interview={schedulingForApp?.interview}
                onScheduled={() => {
                    setSchedulingForApp(null);
                    fetchApplications();
                }}
            />
            <ContractModal
                isOpen={!!newlyGeneratedContract}
                onClose={() => setNewlyGeneratedContract(null)}
                contract={newlyGeneratedContract}
                userRole={user?.role || Role.CLIENT_MEMBER}
                onSigned={() => {
                    setNewlyGeneratedContract(null);
                }}
            />
            <CandidateProfileModal
                isOpen={!!viewingCandidate}
                onClose={() => setViewingCandidate(null)}
                candidate={viewingCandidate}
            />
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{`Applicants for ${jobTitle}`}</h2>
                <Link to="/client/jobs" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to all jobs
                </Link>
            </div>

            <Card>
                <div className="-m-6">
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="flex-grow basis-3/12">Candidate</div>
                        <div className="flex-grow basis-3/12">Status</div>
                        <div className="flex-grow basis-2/12">Applied Date</div>
                        <div className="flex-grow basis-2/12">Interview</div>
                        <div className="flex-grow basis-2/12 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {applications.map(app => (
                            <div key={app.id} className="p-4 md:px-6 flex flex-col md:flex-row md:items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                {/* Responsive container for each field */}
                                <div className="md:flex-grow md:basis-3/12 flex items-center">
                                    <div className="md:hidden w-24 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">Candidate</div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{app.candidate?.name}</div>
                                </div>
                                <div className="md:flex-grow md:basis-3/12 flex items-center">
                                    <div className="md:hidden w-24 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">Status</div>
                                    <div className="flex items-center w-full md:w-auto md:max-w-48">
                                        <Select 
                                            value={app.status} 
                                            onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)} 
                                            className="w-full text-sm !py-1.5"
                                            disabled={applicationBeingProcessed === app.id}
                                        >
                                            {Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                        </Select>
                                        {isGeneratingContract && applicationBeingProcessed === app.id && (
                                            <span className="ml-2 inline-flex items-center">
                                                <svg className="animate-spin h-4 w-4 text-primary-500 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">Generating...</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="md:flex-grow md:basis-2/12 flex items-center">
                                    <div className="md:hidden w-24 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">Applied</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(app.appliedDate).toLocaleDateString()}</div>
                                </div>
                                <div className="md:flex-grow md:basis-2/12 flex items-center">
                                     <div className="md:hidden w-24 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">Interview</div>
                                    {app.status === ApplicationStatus.INTERVIEW && (
                                        (!app.interviews || app.interviews.length === 0 || [InterviewStatus.CANCELLED_BY_CLIENT, InterviewStatus.DECLINED_BY_CANDIDATE].includes(app.interviews[0].status) ) ? (
                                            <Button size="sm" onClick={() => setSchedulingForApp(app)}>Schedule</Button>
                                        ) : (
                                            <div className="text-xs text-left text-gray-700 dark:text-gray-300 p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-xs">
                                                <p className="font-bold text-gray-800 dark:text-gray-200 flex justify-between items-center">
                                                    <span>{app.interviews[0].platform}</span>
                                                    <Badge color={app.interviews[0].status === InterviewStatus.SCHEDULED ? 'yellow' : 'gray'}>{app.interviews[0].status}</Badge>
                                                </p>
                                                <p>{new Date(app.interviews[0].dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="md:flex-grow md:basis-2/12 flex items-center justify-start md:justify-end">
                                    <div className="md:hidden w-24 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase"></div>
                                    <div ref={openActionMenu === app.id ? actionMenuRef : null} className="relative inline-block text-left w-full md:w-auto">
                                        <Button variant="secondary" size="sm" onClick={() => setOpenActionMenu(openActionMenu === app.id ? null : app.id)} className="w-full md:w-auto justify-between md:justify-center">
                                            <span>Actions</span>
                                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </Button>
                                        {openActionMenu === app.id && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1" role="menu" aria-orientation="vertical">
                                                    <button onClick={() => { setViewingCandidate(app.candidate || null); setOpenActionMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" role="menuitem">View Profile</button>
                                                    <button onClick={() => { if(app.candidate) handleMessageCandidate(app.candidate); setOpenActionMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" role="menuitem">Message Candidate</button>
                                                    {app.interviews && app.interviews.length > 0 && app.interviews[0].status === InterviewStatus.SCHEDULED && (
                                                        <>
                                                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                                            <button onClick={() => { setSchedulingForApp({...app, interview: app.interviews![0]}); setOpenActionMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" role="menuitem">Reschedule Interview</button>
                                                            <button onClick={() => { handleCancelInterview(app.interviews![0].id); setOpenActionMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50" role="menuitem" disabled={cancellingInterviewId === app.interviews[0].id}>
                                                              {cancellingInterviewId === app.interviews[0].id ? 'Cancelling...' : 'Cancel Interview'}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {applications.length === 0 && <p className="text-center text-gray-500 py-8">No applicants yet.</p>}
                    </div>
                </div>
            </Card>
        </div>
    );
};

const ClientJobs: React.FC = () => {
    return (
        <Routes>
            <Route index element={<JobsListView />} />
            <Route path=":jobId" element={<JobDetailsView />} />
        </Routes>
    );
}

const BillingModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    org: Organization;
    onSubscriptionChange: (newStatus: SubscriptionStatus) => Promise<void>;
}> = ({ isOpen, onClose, org, onSubscriptionChange }) => {
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        setLoading(true);
        await onSubscriptionChange(SubscriptionStatus.INACTIVE);
        setLoading(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Subscription">
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Current Plan</h4>
                    <p className="text-gray-600 dark:text-gray-400">You are on the <span className="font-bold capitalize">{org.subscriptionStatus} Plan</span>.</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {org.subscriptionStatus === SubscriptionStatus.ACTIVE && (
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Your plan is active. You have full access to all features.</p>
                            <Button variant="danger" size="sm" className="mt-4" onClick={handleCancel} disabled={loading}>
                                {loading ? 'Cancelling...' : 'Cancel Subscription'}
                            </Button>
                        </div>
                    )}
                    {(org.subscriptionStatus === SubscriptionStatus.INACTIVE || org.subscriptionStatus === SubscriptionStatus.TRIALING) && (
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Upgrade to the Growth plan for unlimited job posts and full candidate access.</p>
                            <a href={STRIPE_CHECKOUT_LINK} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" className="mt-4">
                                    Upgrade to Growth Plan
                                </Button>
                            </a>
                        </div>
                    )}
                </div>
                 <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
};

const BillingView: React.FC = () => {
    const { user } = useAuth();
    const [org, setOrg] = useState<Organization | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrg = useCallback(() => {
        if (user?.organizationId) api.getOrganization(user.organizationId).then(setOrg);
    }, [user]);

    useEffect(() => {
        fetchOrg();
    }, [fetchOrg]);

    const handleSubscriptionChange = async (newStatus: SubscriptionStatus) => {
        if(org) {
            await api.updateSubscription(org.id, newStatus);
            fetchOrg(); // Re-fetch to update UI
        }
    }

    if (!org) return <div>Loading...</div>;

    return (
        <>
            <BillingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                org={org}
                onSubscriptionChange={handleSubscriptionChange}
            />
            <Card title="Billing & Subscription">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Current Plan</h4>
                        <p className="text-gray-500 dark:text-gray-400">You are on the <span className="font-bold capitalize">{org.subscriptionStatus} Plan</span>.</p>
                    </div>
                     <div>
                        <h4 className="font-semibold">Status</h4>
                        <Badge color={org.subscriptionStatus === SubscriptionStatus.ACTIVE ? 'green' : org.subscriptionStatus === SubscriptionStatus.TRIALING ? 'yellow' : 'red'}>{org.subscriptionStatus}</Badge>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>Manage Subscription</Button>
                </div>
            </Card>
        </>
    );
};

const MyShortlistsView: React.FC = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<ShortlistRequest[]>([]);
    const [viewingRequest, setViewingRequest] = useState<ShortlistRequest | null>(null);

    useEffect(() => {
        if (user?.organizationId) {
            api.getShortlistRequestsForOrg(user.organizationId).then(setRequests);
        }
    }, [user]);

    const statusColorMap: Record<ShortlistRequestStatus, 'yellow' | 'green'> = {
        [ShortlistRequestStatus.PENDING]: 'yellow',
        [ShortlistRequestStatus.FULFILLED]: 'green',
    };

    return (
        <>
            <ViewShortlistModal
                isOpen={!!viewingRequest}
                onClose={() => setViewingRequest(null)}
                request={viewingRequest}
            />
            <Card title="My Shortlist Requests">
                <div className="-m-6">
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-6/12">Project Goal</div>
                        <div className="w-2/12">Status</div>
                        <div className="w-2/12">Date</div>
                        <div className="w-2/12 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {requests.map(req => (
                             <div key={req.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-6/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Goal</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 max-w-sm truncate">{req.projectDetails.goal}</div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[req.status]}>{req.status}</Badge></div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Date</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(req.requestedDate).toLocaleDateString()}</div></div>
                                <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                    {req.status === ShortlistRequestStatus.FULFILLED ? (
                                        <Button size="sm" onClick={() => setViewingRequest(req)}>View Shortlist</Button>
                                    ) : (
                                        <span className="text-sm italic text-gray-500">Pending Admin Review</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {requests.length === 0 && <p className="text-center text-gray-500 py-8">You haven't made any shortlist requests.</p>}
                </div>
            </Card>
        </>
    );
};

const ContractsView: React.FC = () => {
    const { user } = useAuth();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [viewingContract, setViewingContract] = useState<Contract | null>(null);

    const fetchContracts = useCallback(() => {
        if (user?.organizationId) {
            api.getContractsForOrg(user.organizationId).then(setContracts);
        }
    }, [user]);

    useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

    const statusColorMap: Record<ContractStatus, 'yellow' | 'blue' | 'green' | 'red'> = {
        [ContractStatus.PENDING_CLIENT_SIGNATURE]: 'yellow',
        [ContractStatus.PENDING_CANDIDATE_SIGNATURE]: 'blue',
        [ContractStatus.SIGNED]: 'green',
        [ContractStatus.CANCELLED]: 'red',
    };
    
    return (
        <>
            <ContractModal
                isOpen={!!viewingContract}
                onClose={() => setViewingContract(null)}
                contract={viewingContract}
                userRole={user?.role || Role.CLIENT_MEMBER}
                onSigned={fetchContracts}
            />
            <Card title="Agreements & Contracts">
                 <div className="-m-6">
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-4/12">Candidate</div>
                        <div className="w-3/12">Job Title</div>
                        <div className="w-2/12">Status</div>
                        <div className="w-1/12">Date</div>
                        <div className="w-2/12 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {contracts.map(c => (
                             <div key={c.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-4/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Candidate</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{c.candidateName}</div></div>
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Job Title</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.jobTitle}</div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[c.status]}>{c.status}</Badge></div></div>
                                <div className="md:w-1/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Date</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(c.generatedDate).toLocaleDateString()}</div></div>
                                <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                    <Button size="sm" variant="ghost" onClick={() => setViewingContract(c)}>View & Sign</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                     {contracts.length === 0 && <p className="text-center text-gray-500 py-8">No contracts found.</p>}
                </div>
            </Card>
        </>
    );
};

const PaymentsView: React.FC = () => {
    const { user } = useAuth();
    const [activeContracts, setActiveContracts] = useState<Contract[]>([]);
    const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [payingContract, setPayingContract] = useState<Contract | null>(null);
    const [view, setView] = useState<'pay' | 'history'>('pay');

    const fetchData = useCallback(() => {
        if (user?.organizationId) {
            setLoading(true);
            Promise.all([
                api.getContractsForOrg(user.organizationId),
                api.getPaymentsForOrg(user.organizationId),
            ]).then(([contracts, payments]) => {
                setActiveContracts(contracts.filter(c => c.status === ContractStatus.SIGNED));
                setPaymentHistory(payments.sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()));
                setLoading(false);
            });
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const statusColorMap: Record<PaymentStatus, 'yellow' | 'green'> = {
        [PaymentStatus.PENDING_DISBURSEMENT]: 'yellow',
        [PaymentStatus.DISBURSED]: 'green',
    };
    
    return (
        <>
            {payingContract && (
                <MakePaymentModal
                    isOpen={!!payingContract}
                    onClose={() => setPayingContract(null)}
                    contract={payingContract}
                    onPaymentMade={() => {
                        fetchData();
                        setView('history');
                    }}
                />
            )}
            <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setView('pay')} className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${view === 'pay' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-gray-300'}`}>Pay Team</button>
                    <button onClick={() => setView('history')} className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${view === 'history' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-gray-300'}`}>Payment History</button>
                </nav>
            </div>
            
            {loading ? (
                <p>Loading...</p>
            ) : view === 'pay' ? (
                 <Card title="Active Hires">
                    <div className="-m-6">
                         <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                            <div className="w-5/12">Candidate</div>
                            <div className="w-5/12">Job Title</div>
                            <div className="w-2/12 text-right">Actions</div>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {activeContracts.map(c => (
                                <div key={c.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                    <div className="md:w-5/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Candidate</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{c.candidateName}</div></div>
                                    <div className="md:w-5/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Job Title</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.jobTitle}</div></div>
                                    <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                        <Button size="sm" onClick={() => setPayingContract(c)}>Make Payment</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {activeContracts.length === 0 && <p className="text-center text-gray-500 py-8">No active contracts found. Once a contract is signed, the candidate will appear here.</p>}
                </Card>
            ) : (
                <Card title="Transaction History">
                     <div className="-m-6">
                        <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                            <div className="w-3/12">Candidate</div>
                            <div className="w-2/12">Amount</div>
                            <div className="w-2/12">Status</div>
                            <div className="w-2/12">Date</div>
                            <div className="w-3/12">Notes</div>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {paymentHistory.map(p => (
                                <div key={p.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                    <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Candidate</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{p.candidateName}</div></div>
                                    <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Amount</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.amount)}</div></div>
                                    <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[p.status]}>{p.status}</Badge></div></div>
                                    <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Date</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(p.paymentDate).toLocaleDateString()}</div></div>
                                    <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Notes</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.notes || '-'}</div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {paymentHistory.length === 0 && <p className="text-center text-gray-500 py-8">No payments have been made yet.</p>}
                </Card>
            )}
        </>
    );
};


const ClientPortal: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [organization, setOrganization] = useState<Organization | null>(null);

    const fetchOrg = useCallback(() => {
        if (user?.organizationId) {
            api.getOrganization(user.organizationId).then(setOrganization);
        }
    }, [user]);

    useEffect(() => {
        fetchOrg();
    }, [fetchOrg]);
    
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/team-builder')) return 'Auto-Team Builder';
        if (path.includes('/shortlists')) return 'My Shortlists';
        if (path.includes('/jobs')) return 'Job Postings';
        if (path.includes('/contracts')) return 'Contracts';
        if (path.includes('/payments')) return 'Payments';
        if (path.includes('/billing')) return 'Billing';
        if (path.includes('/messages')) return 'Messages';
        return 'Client Dashboard';
    };

    return (
        <PortalLayout pageTitle={getPageTitle()}>
            {organization && <SubscriptionBanner status={organization.subscriptionStatus} onUpgrade={() => {}}/>}
            <Routes>
                <Route index element={<DashboardView />} />
                <Route path="team-builder" element={<TeamBuilderPage />} />
                <Route path="jobs/*" element={<ClientJobs />} />
                <Route path="billing" element={<BillingView />} />
                <Route path="shortlists" element={<MyShortlistsView />} />
                <Route path="contracts" element={<ContractsView />} />
                <Route path="payments" element={<PaymentsView />} />
                <Route path="messages/:conversationId?" element={<MessagesPage />} />
            </Routes>
        </PortalLayout>
    );
};

export default ClientPortal;