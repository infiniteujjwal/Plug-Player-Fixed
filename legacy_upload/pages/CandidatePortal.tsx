import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PortalLayout from '../components/Layout';
import { Card, Badge, Button, Input, Label, Avatar } from '../components/ui';
import { ResumeUploadModal, AvatarUploadModal, ContractModal } from '../components/modals';
import { Candidate, Job, Application, ApplicationStatus, Contract, ContractStatus, Role, Payment, Interview, InterviewStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import api from '../data';
import MessagesPage from './MessagesPage'; // Import the new MessagesPage

const ProfileView: React.FC = () => {
    const { user, updateUserAvatar } = useAuth();
    const [profile, setProfile] = useState<Candidate | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isResumeModalOpen, setResumeModalOpen] = useState(false);
    const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);
    
    const fetchProfile = useCallback(() => {
        if (user?.id) api.getCandidateProfile(user.id).then(setProfile);
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSave = async () => {
        if(profile) {
            setIsSaving(true);
            await api.updateCandidateProfile(profile);
            setIsSaving(false);
            setIsEditing(false);
        }
    }
    
    const handleCancel = () => {
        setIsEditing(false);
        fetchProfile(); // Re-fetch to discard changes
    }
    
    const handleAvatarUploadSuccess = (updatedUser: { avatarUrl: string }) => {
        updateUserAvatar(updatedUser.avatarUrl);
        fetchProfile();
    }

    if (!profile) return <div>Loading profile...</div>;

    return (
        <>
        <ResumeUploadModal
            isOpen={isResumeModalOpen}
            onClose={() => setResumeModalOpen(false)}
            candidateId={profile.id}
            onUploadSuccess={fetchProfile}
        />
        <AvatarUploadModal
            isOpen={isAvatarModalOpen}
            onClose={() => setAvatarModalOpen(false)}
            candidateId={profile.id}
            onUploadSuccess={handleAvatarUploadSuccess}
        />
        <Card title="My Profile" actions={
            isEditing ? (
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                </div>
            ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )
        }>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Personal Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal details.</p>
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar src={profile.avatarUrl} name={profile.name} size="xl" />
                        {isEditing && <Button variant="secondary" size="sm" onClick={() => setAvatarModalOpen(true)}>Change Photo</Button>}
                    </div>
                   <div>
                        <Label>Full Name</Label>
                        <Input type="text" value={profile.name} disabled={!isEditing} onChange={e => setProfile({...profile, name: e.target.value})} />
                   </div>
                   <div>
                        <Label>Email</Label>
                        <Input type="email" value={profile.email} disabled />
                   </div>
                </div>
            </div>
            <hr className="my-6 border-gray-200 dark:border-gray-800"/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Professional Details</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your skills, experience, and desired rate.</p>
                </div>
                 <div className="md:col-span-2 space-y-4">
                    <div>
                        <Label>Skills (comma-separated)</Label>
                        <Input type="text" value={profile.skills.join(', ')} disabled={!isEditing} onChange={e => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim())})} />
                    </div>
                    <div>
                        <Label>Years of Experience</Label>
                        <Input type="text" value={profile.experience} disabled={!isEditing} onChange={e => setProfile({...profile, experience: e.target.value})} />
                    </div>
                    <div>
                        <Label>Expected Rate</Label>
                        <Input type="text" value={profile.expectedRate} disabled={!isEditing} onChange={e => setProfile({...profile, expectedRate: e.target.value})} />
                    </div>
                 </div>
            </div>
            <hr className="my-6 border-gray-200 dark:border-gray-800"/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Resume</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upload your latest resume.</p>
                </div>
                <div className="md:col-span-2">
                    {profile.resumeFileName ? (
                        <div className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800/50">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{profile.resumeFileName}</p>
                            {isEditing && <Button variant="secondary" size="sm" onClick={() => setResumeModalOpen(true)}>Replace</Button>}
                        </div>
                    ) : (
                         <Button disabled={!isEditing} onClick={() => setResumeModalOpen(true)}>Upload Resume</Button>
                    )}
                </div>
            </div>
        </Card>
        </>
    );
};

const JobsView: React.FC = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
    
    const fetchJobsAndApps = useCallback(async () => {
        if (!user) return;
        const [availableJobs, myApps] = await Promise.all([
            api.getAvailableJobs(),
            api.getCandidateApplications(user.id),
        ]);
        setJobs(availableJobs);
        setAppliedJobIds(new Set(myApps.map(app => app.jobId)));
    }, [user]);

    useEffect(() => {
        fetchJobsAndApps();
    }, [fetchJobsAndApps]);

    const handleApply = async (jobId: string) => {
        if (!user) return;
        await api.applyForJob(user.id, jobId);
        setAppliedJobIds(prev => new Set(prev).add(jobId));
    };

    return (
        <Card title="Find Available Jobs">
            <div className="space-y-4">
                {jobs.map(job => {
                    const hasApplied = appliedJobIds.has(job.id);
                    return (
                        <div key={job.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between hover:border-gray-300 dark:hover:border-gray-700 transition">
                            <div className="mb-4 sm:mb-0">
                                <h4 className="font-bold text-lg text-primary-600 dark:text-primary-400">{job.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{job.organizationName} &middot; {job.location}</p>
                                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">{job.salaryRange}</p>
                            </div>
                            <Button onClick={() => handleApply(job.id)} disabled={hasApplied} className="w-full sm:w-auto">
                                {hasApplied ? 'Applied' : 'Apply Now'}
                            </Button>
                        </div>
                    );
                })}
                 {jobs.length === 0 && <p className="text-center text-gray-500 py-8">No open jobs at the moment. Check back soon!</p>}
            </div>
        </Card>
    );
};

const ApplicationsView: React.FC = () => {
    const [applications, setApplications] = useState<(Application & {job?: Job})[]>([]);
    const { user } = useAuth();
    useEffect(() => { 
        if(user) api.getCandidateApplications(user.id).then(setApplications);
    }, [user]);

     const statusColorMap: Record<ApplicationStatus, any> = {
        [ApplicationStatus.SUBMITTED]: 'gray',
        [ApplicationStatus.SHORTLISTED]: 'blue',
        [ApplicationStatus.INTERVIEW]: 'yellow',
        [ApplicationStatus.OFFER]: 'purple',
        [ApplicationStatus.HIRED]: 'green',
        [ApplicationStatus.REJECTED]: 'red',
    };

    return (
        <Card title="My Applications">
             <div className="-m-6">
                <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    <div className="w-4/12">Job Title</div>
                    <div className="w-3/12">Company</div>
                    <div className="w-3/12">Status</div>
                    <div className="w-2/12">Date Applied</div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {applications.map(app => (
                        <div key={app.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                           <div className="md:w-4/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Job Title</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{app.job?.title}</div></div>
                           <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Company</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.job?.organizationName}</div></div>
                           <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[app.status]}>{app.status}</Badge></div></div>
                           <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Date</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.appliedDate}</div></div>
                        </div>
                    ))}
                </div>
             </div>
             {applications.length === 0 && <p className="text-center text-gray-500 py-8">You haven't applied to any jobs yet.</p>}
        </Card>
    );
};

const MyInterviewsView: React.FC = () => {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState<(Interview & { job?: Job })[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);


    const fetchInterviews = useCallback(() => {
        if (user) {
            setLoading(true);
            api.getInterviewsForCandidate(user.id).then(data => {
                setInterviews(data);
                setLoading(false);
            });
        }
    }, [user]);

    useEffect(() => {
        fetchInterviews();
    }, [fetchInterviews]);
    
    const handleAction = async (interviewId: string, status: InterviewStatus) => {
        let confirmationText = '';
        if(status === InterviewStatus.DECLINED_BY_CANDIDATE) {
            confirmationText = "Are you sure you want to decline this interview? This will withdraw your application for this role.";
        } else if (status === InterviewStatus.RESCHEDULE_REQUESTED_BY_CANDIDATE) {
            confirmationText = "Are you sure you want to request a reschedule? The client will be notified to arrange a new time.";
        }

        if (window.confirm(confirmationText)) {
            setActionLoadingId(interviewId);
            await api.updateInterview(interviewId, status);
            fetchInterviews();
            setActionLoadingId(null);
        }
    };


    const statusColorMap: Record<InterviewStatus, 'yellow' | 'green' | 'red' | 'blue' | 'gray'> = {
        [InterviewStatus.SCHEDULED]: 'yellow',
        [InterviewStatus.COMPLETED]: 'green',
        [InterviewStatus.CANCELLED_BY_CLIENT]: 'red',
        [InterviewStatus.RESCHEDULE_REQUESTED_BY_CANDIDATE]: 'blue',
        [InterviewStatus.DECLINED_BY_CANDIDATE]: 'gray',
    };

    return (
        <Card title="My Interviews">
            {loading ? <p>Loading interviews...</p> : (
                <div className="-m-6">
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-3/12">Company</div>
                        <div className="w-2/12">Job Title</div>
                        <div className="w-3/12">Date & Time</div>
                        <div className="w-2/12">Status</div>
                        <div className="w-2/12 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {interviews.map(interview => (
                             <div key={interview.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Company</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{interview.job?.organizationName}</div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Job</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{interview.job?.title}</div></div>
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Time</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(interview.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[interview.status]}>{interview.status}</Badge></div></div>
                                <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                    <div className="flex items-center justify-start md:justify-end gap-2">
                                        {interview.status === InterviewStatus.SCHEDULED && (
                                            <>
                                                <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                                                    <Button size="sm">Join</Button>
                                                </a>
                                                <Button size="sm" variant="secondary" onClick={() => handleAction(interview.id, InterviewStatus.RESCHEDULE_REQUESTED_BY_CANDIDATE)} disabled={actionLoadingId === interview.id}>
                                                    {actionLoadingId === interview.id ? '...' : 'Reschedule'}
                                                </Button>
                                                <Button size="sm" variant="danger" onClick={() => handleAction(interview.id, InterviewStatus.DECLINED_BY_CANDIDATE)} disabled={actionLoadingId === interview.id}>
                                                    {actionLoadingId === interview.id ? '...' : 'Decline'}
                                                </Button>
                                            </>
                                        )}
                                        {interview.status !== InterviewStatus.SCHEDULED && <span className="text-xs text-gray-500 italic">No actions</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {!loading && interviews.length === 0 && <p className="text-center text-gray-500 py-8">You have no upcoming interviews scheduled.</p>}
        </Card>
    );
};

const ContractsView: React.FC = () => {
    const { user } = useAuth();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [viewingContract, setViewingContract] = useState<Contract | null>(null);

    const fetchContracts = useCallback(() => {
        if (user) {
            api.getContractsForCandidate(user.id).then(setContracts);
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
                userRole={user?.role || Role.CANDIDATE}
                onSigned={fetchContracts}
            />
            <Card title="My Contracts & Agreements">
                <div className="-m-6">
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-4/12">Company</div>
                        <div className="w-3/12">Job Title</div>
                        <div className="w-2/12">Status</div>
                        <div className="w-1/12">Date</div>
                        <div className="w-2/12 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {contracts.map(c => (
                            <div key={c.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-4/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Company</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{c.clientName}</div></div>
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Job Title</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.jobTitle}</div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[c.status]}>{c.status}</Badge></div></div>
                                <div className="md:w-1/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Date</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(c.generatedDate).toLocaleDateString()}</div></div>
                                <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                    <Button size="sm" variant="ghost" onClick={() => setViewingContract(c)}>View & Sign</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 {contracts.length === 0 && <p className="text-center text-gray-500 py-8">You have no contracts yet.</p>}
            </Card>
        </>
    );
};

const PaymentsView: React.FC = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.getPaymentsForCandidate(user.id).then(data => {
                setPayments(data.sort((a,b) => new Date(b.disbursementDate!).getTime() - new Date(a.disbursementDate!).getTime()));
                setLoading(false);
            });
        }
    }, [user]);

    const totalEarnings = payments.reduce((acc, p) => acc + p.amount, 0);

    return (
        <Card>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold">My Earnings</h2>
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Received: </span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalEarnings)}</span>
                </div>
            </div>
            {loading ? <p>Loading payment history...</p> : (
                 <div className="-m-6">
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-4/12">From</div>
                        <div className="w-3/12">Amount</div>
                        <div className="w-2/12">Date Received</div>
                        <div className="w-3/12">Notes</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {payments.map(p => (
                             <div key={p.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-4/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">From</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{p.clientName}</div></div>
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Amount</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.amount)}</div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Date</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(p.disbursementDate!).toLocaleDateString()}</div></div>
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Notes</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.notes || '-'}</div></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {payments.length === 0 && !loading && <p className="text-center text-gray-500 py-8">You have not received any payments yet.</p>}
        </Card>
    );
};

const CandidatePortal: React.FC = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/jobs')) return 'Find Jobs';
        if (path.includes('/applications')) return 'My Applications';
        if (path.includes('/interviews')) return 'My Interviews';
        if (path.includes('/contracts')) return 'My Contracts';
        if (path.includes('/payments')) return 'My Payments';
        if (path.includes('/messages')) return 'Messages';
        return 'My Profile';
    };
    
    return (
        <PortalLayout pageTitle={getPageTitle()}>
            <Routes>
                <Route index element={<ProfileView />} />
                <Route path="jobs" element={<JobsView />} />
                <Route path="applications" element={<ApplicationsView />} />
                <Route path="interviews" element={<MyInterviewsView />} />
                <Route path="contracts" element={<ContractsView />} />
                <Route path="payments" element={<PaymentsView />} />
                <Route path="messages/:conversationId?" element={<MessagesPage />} />
            </Routes>
        </PortalLayout>
    );
};

export default CandidatePortal;