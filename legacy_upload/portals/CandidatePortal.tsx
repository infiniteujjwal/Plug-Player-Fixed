import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../components/Layout';
import { Card, Badge, Button, Input, Label, Avatar } from '../components/ui';
import { ResumeUploadModal, AvatarUploadModal, ContractModal } from '../components/modals';
import { Candidate, Job, Application, ApplicationStatus, Contract, ContractStatus, Role, Payment, Interview, InterviewStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import MessagesPage from './MessagesPage';

// (All sub-components like ProfileView, JobsView, etc. are defined here as before)
// ...
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
        setAppliedJobIds(new Set(myApps.map((app: Application) => app.jobId)));
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
                <div className