import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Label, Input, Badge, Select, Avatar, Textarea, Table } from './ui';
import { Candidate, Organization, Conversation, ConversationParticipant, Role, ShortlistRequest, Contract, ContractStatus, SubscriptionStatus, Application, InterviewPlatform, Interview } from '../types';
import api from '../data';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';

// 1. Avatar Upload Modal
interface AvatarUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateId: string;
    onUploadSuccess: (userWithNewAvatar: any) => void;
}
export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ isOpen, onClose, candidateId, onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select an image file.');
            return;
        }
        setLoading(true);
        // Simulate upload by creating a blob URL and update the mock DB
        const tempAvatarUrl = URL.createObjectURL(file);
        const updatedUser = await api.updateCandidateAvatar(candidateId, tempAvatarUrl);
        setLoading(false);
        if (updatedUser) {
            onUploadSuccess(updatedUser);
        }
        onClose();
        setFile(null); // Reset after upload
    };
    
    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Upload Profile Photo">
            <div className="space-y-4">
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div>
                    <Label htmlFor="avatar-file">Select image file (PNG, JPG)</Label>
                    <Input id="avatar-file" type="file" onChange={handleFileChange} accept="image/png, image/jpeg" />
                </div>
                {file && <p className="text-sm text-gray-400">Selected file: <span className="font-medium">{file.name}</span></p>}
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || !file}>{loading ? 'Uploading...' : 'Upload Photo'}</Button>
                </div>
            </div>
        </Modal>
    )
}


// 2. Resume Upload Modal
interface ResumeUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateId: string;
    onUploadSuccess: () => void;
}
export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({ isOpen, onClose, candidateId, onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setLoading(true);
        // Simulate upload and update the mock DB
        await api.updateCandidateResume(candidateId, file.name);
        setLoading(false);
        onUploadSuccess();
        onClose();
        setFile(null); // Reset after upload
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Resume">
            <div className="space-y-4">
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div>
                    <Label htmlFor="resume-file">Select PDF or DOCX file</Label>
                    <Input id="resume-file" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                </div>
                {file && <p className="text-sm text-gray-400">Selected file: <span className="font-medium">{file.name}</span></p>}
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || !file}>{loading ? 'Uploading...' : 'Upload'}</Button>
                </div>
            </div>
        </Modal>
    );
};


// 3. Candidate Profile Modal
interface CandidateProfileModalProps {
     isOpen: boolean;
    onClose: () => void;
    candidate: Candidate | null;
}
export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({ isOpen, onClose, candidate }) => {
    if (!candidate) return null;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Candidate Profile" size="xl">
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar src={candidate.avatarUrl} name={candidate.name} size="lg" />
                        <div>
                            <h3 className="text-lg font-bold text-gray-100">{candidate.name}</h3>
                            <p className="text-sm text-gray-400">{candidate.email}</p>
                        </div>
                    </div>
                     {candidate.linkedinUrl && (
                        <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                             <Button variant="secondary" size="sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin mr-2" viewBox="0 0 16 16">
                                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                                </svg>
                                View on LinkedIn
                            </Button>
                        </a>
                    )}
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-400">Experience</h4>
                        <p className="text-gray-200">{candidate.experience}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-400">Expected Rate</h4>
                        <p className="text-gray-200">{candidate.expectedRate}</p>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-400">Skills</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {candidate.skills.map(skill => <Badge key={skill}>{skill}</Badge>)}
                    </div>
                </div>
                 <div>
                    <h4 className="text-sm font-medium text-gray-400">Resume</h4>
                    <p className="text-gray-200">{candidate.resumeFileName || 'Not uploaded'}</p>
                </div>
                 <div className="flex justify-end pt-4">
                     <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
}

// 4. Organization Details Modal
interface OrgDetailsModalProps {
     isOpen: boolean;
    onClose: () => void;
    organization: Organization | null;
}
export const OrgDetailsModal: React.FC<OrgDetailsModalProps> = ({ isOpen, onClose, organization }) => {
    if (!organization) return null;
    
    const statusColorMap: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
        [SubscriptionStatus.ACTIVE]: 'green',
        [SubscriptionStatus.TRIALING]: 'yellow',
        [SubscriptionStatus.INACTIVE]: 'red',
        [SubscriptionStatus.HOLD]: 'gray',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${organization.name}`} size="xl">
            <div className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                     <div>
                        <h4 className="text-sm font-medium text-gray-400">Subscription Status</h4>
                        <p><Badge color={statusColorMap[organization.subscriptionStatus]}>{organization.subscriptionStatus}</Badge></p>
                     </div>
                     <div>
                        <h4 className="text-sm font-medium text-gray-400">Industry</h4>
                        <p className="text-gray-200">{organization.industry || 'N/A'}</p>
                    </div>
                     <div>
                        <h4 className="text-sm font-medium text-gray-400">Contact Person</h4>
                        <p className="text-gray-200">{organization.contactPerson || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-400">Primary Email</h4>
                        <p className="text-gray-200">{organization.email || 'N/A'}</p>
                    </div>
                     <div>
                        <h4 className="text-sm font-medium text-gray-400">Business ID</h4>
                        <p className="text-gray-200">{organization.businessId || 'N/A'}</p>
                    </div>
                     <div className="sm:col-span-2">
                        <h4 className="text-sm font-medium text-gray-400">Address</h4>
                        <p className="text-gray-200">{`${organization.address || 'N/A'}, ${organization.country || 'N/A'}`}</p>
                    </div>
                 </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-400">Members ({organization.members.length})</h4>
                    <ul className="mt-2 divide-y divide-gray-800 border-t border-b border-gray-800">
                        {organization.members.map(member => (
                            <li key={member.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Avatar src={member.avatarUrl} name={member.name} size="sm"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-100">{member.name}</p>
                                        <p className="text-sm text-gray-400">{member.email}</p>
                                    </div>
                                </div>
                                <Badge color="blue">{member.role.replace('CLIENT_', '').toLowerCase()}</Badge>
                            </li>
                        ))}
                        {organization.members.length === 0 && <li className="py-2 text-sm text-gray-400">No members found.</li>}
                    </ul>
                </div>
                <div className="flex justify-end pt-4">
                     <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
};

// 5. Iframe Modal for Cal.com
export const IframeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    src: string;
    title: string;
}> = ({ isOpen, onClose, src, title }) => {
    if (!isOpen) return null;

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-900/80 transition-opacity backdrop-blur-sm"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-0 text-center sm:p-4">
                    <div className="relative flex flex-col transform overflow-hidden rounded-none bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:rounded-xl h-screen sm:h-[85vh] sm:max-h-[750px]">
                        <div className="flex items-center justify-between p-4 border-b">
                           <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
                           <button type="button" onClick={onClose} className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <iframe
                            src={src}
                            className="w-full flex-grow border-0"
                            title={title}
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6. New Conversation Modal
export const NewConversationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    adminId: string;
    onConversationCreated: (conversation: Conversation) => void;
}> = ({ isOpen, onClose, adminId, onConversationCreated }) => {
    const [orgRecipients, setOrgRecipients] = useState<ConversationParticipant[]>([]);
    const [candRecipients, setCandRecipients] = useState<ConversationParticipant[]>([]);
    const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            Promise.all([api.getAllOrganizations(), api.getAllCandidates()]).then(async ([orgs, cands]) => {
                const orgsWithAdmin = orgs.map(org => {
                    const adminMember = org.members.find(m => m.role === Role.CLIENT_ADMIN);
                    return adminMember ? { id: adminMember.id, name: org.name, role: adminMember.role } : null;
                }).filter(Boolean) as ConversationParticipant[];
                setOrgRecipients(orgsWithAdmin);

                const userPromises = cands.map(cand => api.getUserByEmail(cand.email));
                const users = await Promise.all(userPromises);

                const candsAsUsers = cands.map((cand, index) => {
                    const user = users[index];
                    return user ? { id: user.id, name: cand.name, role: user.role } : null;
                }).filter(Boolean) as ConversationParticipant[];
                setCandRecipients(candsAsUsers);
            });
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!selectedRecipientId) return;
        setLoading(true);
        const allRecipients = [...orgRecipients, ...candRecipients];
        const recipient = allRecipients.find(r => r.id === selectedRecipientId);
        if (recipient) {
            const newConvo = await api.createConversation(adminId, recipient);
            onConversationCreated(newConvo);
        }
        setLoading(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Message">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="recipient">Select a Recipient</Label>
                    <Select id="recipient" value={selectedRecipientId} onChange={(e) => setSelectedRecipientId(e.target.value)}>
                        <option value="">Choose...</option>
                        <optgroup label="Organizations">
                            {orgRecipients.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </optgroup>
                        <optgroup label="Candidates">
                            {candRecipients.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </optgroup>
                    </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || !selectedRecipientId}>
                        {loading ? 'Starting...' : 'Start Conversation'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// 7. Share Candidate Modal
export const ShareCandidateModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onShare: (candidateId: string) => void;
}> = ({ isOpen, onClose, onShare }) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
    
    useEffect(() => {
        if(isOpen) api.getAllCandidates().then(setCandidates);
    }, [isOpen]);

    const handleShare = () => {
        if (selectedCandidateId) {
            onShare(selectedCandidateId);
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share a Candidate Profile">
            <div className="space-y-4">
                <p className="text-sm text-gray-400">Select a candidate to recommend in this chat.</p>
                <div className="max-h-60 overflow-y-auto border border-gray-800 rounded-lg">
                    {candidates.map(c => (
                        <div 
                            key={c.id} 
                            onClick={() => setSelectedCandidateId(c.id)}
                            className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-800 last:border-b-0 ${selectedCandidateId === c.id ? 'bg-primary-500/20' : 'hover:bg-gray-800/50'}`}
                        >
                            <Avatar src={c.avatarUrl} name={c.name} size="md"/>
                            <div>
                                <p className="font-semibold text-gray-100">{c.name}</p>
                                <p className="text-sm text-gray-400">{c.skills.slice(0, 3).join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleShare} disabled={!selectedCandidateId}>Share Profile</Button>
                </div>
            </div>
        </Modal>
    );
};

// 8. Shortlist Confirmation Modal
export const ShortlistConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request Submitted">
            <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                     <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <p className="text-lg font-semibold leading-6 text-gray-100">Shortlist request received!</p>
                    <div className="mt-2">
                        <p className="text-sm text-gray-400">
                           Our team has received your custom team request. We will review it and send you a curated shortlist of matching candidates within 24 hours.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-6">
                <Button className="w-full" onClick={onClose}>Got it, thanks!</Button>
            </div>
        </Modal>
    )
};


// 9. Fulfill Request Modal (Admin)
export const FulfillRequestModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    request: ShortlistRequest | null;
    onFulfilled: () => void;
}> = ({ isOpen, onClose, request, onFulfilled }) => {
    const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
    const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if(isOpen) {
            api.getAllCandidates().then(setAllCandidates);
            setSelectedCandidateIds(new Set()); // Reset on open
        }
    }, [isOpen]);

    const handleToggleCandidate = (candidateId: string) => {
        setSelectedCandidateIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(candidateId)) {
                newSet.delete(candidateId);
            } else {
                newSet.add(candidateId);
            }
            return newSet;
        });
    }

    const handleSubmit = async () => {
        if (!request) return;
        setLoading(true);
        await api.assignCandidatesToRequest(request.id, Array.from(selectedCandidateIds));
        setLoading(false);
        onFulfilled();
        onClose();
    }
    
    const filteredCandidates = allCandidates.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!request) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Fulfill Request for ${request.organizationName}`} size="xl">
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-200">Requested Team</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {request.requestedTeam.map(member => (
                            <Badge key={member.roleId} color="blue">{`${member.count}x ${member.roleName}`}</Badge>
                        ))}
                    </div>
                </div>
                 <div>
                    <Label htmlFor="search-candidates">Find & Select Candidates</Label>
                    <Input id="search-candidates" type="text" placeholder="Search by name or skill..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="max-h-80 overflow-y-auto border border-gray-800 rounded-lg">
                    {filteredCandidates.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-3 border-b border-gray-800 last:border-b-0">
                            <div className="flex items-center gap-3">
                                <Avatar src={c.avatarUrl} name={c.name} size="md" />
                                <div>
                                    <p className="font-semibold text-gray-100">{c.name}</p>
                                    <p className="text-sm text-gray-400">{c.skills.slice(0,4).join(', ')}</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-gray-700 bg-gray-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-900"
                                checked={selectedCandidateIds.has(c.id)}
                                onChange={() => handleToggleCandidate(c.id)}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center pt-4">
                    <p className="text-sm font-semibold text-gray-200">{selectedCandidateIds.size} candidates selected</p>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={loading || selectedCandidateIds.size === 0}>
                            {loading ? 'Assigning...' : 'Assign Candidates'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};


// 10. View Shortlist Modal (Client)
export const ViewShortlistModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    request: ShortlistRequest | null;
}> = ({ isOpen, onClose, request }) => {
    const [viewingProfile, setViewingProfile] = useState<Candidate | null>(null);

    if (!request) return null;

    return (
        <>
        <CandidateProfileModal
            isOpen={!!viewingProfile}
            onClose={() => setViewingProfile(null)}
            candidate={viewingProfile}
        />
        <Modal isOpen={isOpen} onClose={onClose} title={`Curated Shortlist for "${request.projectDetails.goal}"`} size="xl">
            <div className="space-y-4">
                 <p className="text-sm text-gray-400">Our admin team has selected the following candidates based on your project requirements.</p>
                 <div className="max-h-96 overflow-y-auto space-y-3 p-1">
                    {request.assignedCandidates.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-3 border border-gray-800 rounded-lg bg-gray-900/50">
                            <div className="flex items-center gap-3">
                                <Avatar src={c.avatarUrl} name={c.name} size="md" />
                                <div>
                                    <p className="font-semibold text-gray-100">{c.name}</p>
                                    <p className="text-sm text-gray-400">{c.skills.slice(0,4).join(', ')}</p>
                                </div>
                            </div>
                             <Button variant="ghost" size="sm" onClick={() => setViewingProfile(c)}>View Profile</Button>
                        </div>
                    ))}
                    {request.assignedCandidates.length === 0 && (
                        <p className="text-center text-gray-400 py-4">No candidates have been assigned to this shortlist yet.</p>
                    )}
                 </div>
                 <div className="flex justify-end pt-4">
                     <Button variant="secondary" onClick={onClose}>Close</Button>
                 </div>
            </div>
        </Modal>
        </>
    )
};

// 11. Contract Generated Modal
export const ContractGeneratedModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
}> = ({ isOpen, onClose, candidateName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Contract Generation in Progress">
             <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <p className="text-lg font-semibold leading-6 text-gray-100">Agreement Generated!</p>
                    <div className="mt-2">
                        <p className="text-sm text-gray-400">
                           An agreement for {candidateName} has been generated. Both parties can now view and sign it from their respective "Contracts" pages.
                        </p>
                    </div>
                </div>
            </div>
             <div className="mt-5 sm:mt-6">
                <Button className="w-full" onClick={onClose}>Okay, got it!</Button>
            </div>
        </Modal>
    )
};

// Signature Pad Component
const SignaturePad: React.FC<{ onEnd: (dataUrl: string) => void, onClear: () => void }> = ({ onEnd, onClear }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set high-DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        ctx.strokeStyle = '#F3F4F6'; // gray-100
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);
    
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };
    
    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (canvasRef.current) {
            onEnd(canvasRef.current.toDataURL());
        }
    };
    
    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        
        if (e.nativeEvent instanceof MouseEvent) {
             return { x: e.nativeEvent.clientX - rect.left, y: e.nativeEvent.clientY - rect.top };
        }
        if (e.nativeEvent instanceof TouchEvent) {
            return { x: e.nativeEvent.touches[0].clientX - rect.left, y: e.nativeEvent.touches[0].clientY - rect.top };
        }
        return { x: 0, y: 0 };
    }

    const clearPad = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onClear();
    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                className="w-full h-48 border border-gray-700 rounded-lg bg-gray-800 touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
            />
            <Button type="button" variant="ghost" size="sm" onClick={clearPad} className="mt-2">Clear</Button>
        </div>
    );
};


// 12. Contract Modal (View & Sign)
export const ContractModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    contract: Contract | null;
    userRole: Role;
    onSigned: () => void;
}> = ({ isOpen, onClose, contract, userRole, onSigned }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSignatureData(null);
            setActiveTab('draw');
        }
    }, [isOpen, contract]);
    
    const handleSign = async () => {
        if (!contract || !user || !signatureData) return;
        setLoading(true);
        await api.signContract(contract.id, user.id, signatureData);
        setLoading(false);
        onSigned();
        onClose();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSignatureData(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    
    const handleDownloadPdf = async () => {
        if (!contract) return;
        setIsDownloading(true);

        try {
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4'
            });

            pdf.setFont('Helvetica', 'normal');

            const pageHeight = pdf.internal.pageSize.height;
            const pageWidth = pdf.internal.pageSize.width;
            const margin = 50;
            const contentWidth = pageWidth - margin * 2;
            let y = margin;
            
            const addText = (text: string, options: { size?: number, style?: 'normal' | 'bold', x?: number, y?: number, align?: 'left' | 'center' | 'right', spaceAfter?: number } = {}) => {
                if (y > pageHeight - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.setFontSize(options.size || 10).setFont(undefined, options.style || 'normal');
                pdf.text(text, options.x || margin, y, { align: options.align || 'left', maxWidth: contentWidth });
                y += (pdf.getTextDimensions(text, { maxWidth: contentWidth }).h) + (options.spaceAfter || 0);
            };
            
            addText(`Independent Contractor Agreement`, { size: 18, style: 'bold', align: 'center', spaceAfter: 20 });
            addText(`This Agreement is made on ${new Date(contract.generatedDate).toLocaleDateString()}.`, { size: 10, spaceAfter: 15 });
            addText(`BETWEEN:`, {size: 11, style: 'bold'});
            addText(`${contract.clientName} (the "Company")`, { x: margin + 20, size: 11, spaceAfter: 10 });
            addText(`AND:`, {size: 11, style: 'bold'});
            addText(`${contract.candidateName} (the "Contractor")`, { x: margin + 20, size: 11, spaceAfter: 30 });
            
            // Split content into lines and render
            const lines = pdf.splitTextToSize(contract.content, contentWidth);
            lines.forEach((line: string) => {
                addText(line, { spaceAfter: 2 });
            });
            
             // --- Signatures ---
            if (y + 120 > pageHeight - margin) {
                pdf.addPage();
                y = margin;
            }
            y += 50;

            const sigBlockWidth = (contentWidth - 20) / 2;
            let sigY = y;

            const addSignatureBlock = (name: string, date: string | undefined, signature: string | undefined, x: number) => {
                if (signature) {
                    try {
                        pdf.addImage(signature, 'PNG', x, sigY, 120, 50);
                    } catch (e) { console.error("Could not add signature image", e); }
                }
                pdf.setDrawColor(0);
                pdf.line(x, sigY + 60, x + sigBlockWidth, sigY + 60);
                addText(name, { x, y: sigY + 75 });
                if (date) {
                    addText(`Date: ${new Date(date).toLocaleDateString()}`, { x, y: sigY + 90 });
                }
            };
            
            addSignatureBlock(contract.clientName, contract.clientSignedDate, contract.clientSignature, margin);
            addSignatureBlock(contract.candidateName, contract.candidateSignedDate, contract.candidateSignature, margin + sigBlockWidth + 20);
            
            pdf.save(`Contract-${contract.candidateName.replace(/\s/g, '_')}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Sorry, there was an error generating the PDF.");
        } finally {
            setIsDownloading(false);
        }
    };


    if (!contract) return null;

    const isClient = userRole.startsWith('CLIENT');
    const isCandidate = userRole === Role.CANDIDATE;
    const isAdmin = userRole === Role.ADMIN;

    const canClientSign = isClient && contract.status === ContractStatus.PENDING_CLIENT_SIGNATURE;
    const canCandidateSign = isCandidate && contract.status === ContractStatus.PENDING_CANDIDATE_SIGNATURE;
    const canSign = canClientSign || canCandidateSign;
    
    const SignatureDisplay: React.FC<{label: string, date?: string, signature?: string}> = ({ label, date, signature }) => (
        <div>
            <h4 className="font-semibold text-gray-100">{label}</h4>
            {signature ? (
                <>
                    <img src={signature} alt="Signature" className="h-16 w-auto border-b border-gray-600 bg-white p-1 rounded" />
                    <p className="text-xs text-gray-400 mt-1">Signed on {new Date(date!).toLocaleDateString()}</p>
                </>
            ) : (
                <div className="h-16 flex items-center">
                    <Badge color={label === contract.clientName && contract.status === ContractStatus.PENDING_CLIENT_SIGNATURE ? 'yellow' : (label === contract.candidateName && contract.status === ContractStatus.PENDING_CANDIDATE_SIGNATURE ? 'yellow' : 'gray')}>
                        Pending Signature
                    </Badge>
                </div>
            )}
        </div>
    );
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Agreement for ${contract.jobTitle}`} size="2xl">
            <div className="space-y-6">
                <div id="contract-content-wrapper">
                    <div className="max-h-[40vh] overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 p-4 prose prose-sm prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans">{contract.content}</pre>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                        <SignatureDisplay label={contract.clientName} date={contract.clientSignedDate} signature={contract.clientSignature} />
                        <SignatureDisplay label={contract.candidateName} date={contract.candidateSignedDate} signature={contract.candidateSignature} />
                    </div>
                </div>
                
                {canSign && (
                    <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                        <h3 className="font-semibold text-lg text-gray-100 mb-2">Provide Your Signature</h3>
                        <div className="border-b border-gray-700">
                             <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button onClick={() => setActiveTab('draw')} className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium ${activeTab === 'draw' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'}`}>Draw</button>
                                <button onClick={() => setActiveTab('upload')} className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium ${activeTab === 'upload' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'}`}>Upload</button>
                            </nav>
                        </div>
                        <div className="pt-4">
                            {activeTab === 'draw' && (
                                <SignaturePad onEnd={setSignatureData} onClear={() => setSignatureData(null)} />
                            )}
                            {activeTab === 'upload' && (
                                <div>
                                    <Label htmlFor="sig-upload">Upload an image of your signature</Label>
                                    <Input id="sig-upload" type="file" accept="image/*" onChange={handleFileUpload} />
                                    {signatureData && <img src={signatureData} alt="Signature preview" className="mt-2 h-16 w-auto border border-gray-600 rounded bg-white p-1" />}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="flex justify-between items-center gap-4 pt-4">
                     {canSign && <p className="text-sm text-gray-400">By signing, you agree to the terms.</p>}
                     <div className="flex-grow"></div>
                     <Button variant="secondary" onClick={handleDownloadPdf} disabled={isDownloading}>
                        {isDownloading ? 'Downloading...' : 'Download PDF'}
                     </Button>
                     <Button variant="secondary" onClick={onClose}>{isAdmin ? "Close" : "Cancel"}</Button>
                     {canSign && <Button onClick={handleSign} disabled={loading || !signatureData}>{loading ? 'Signing...' : 'Sign Agreement'}</Button>}
                </div>
            </div>
        </Modal>
    );
};

// 13. New Organization Form Modal
interface OrganizationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: Organization | null;
}
export const OrganizationFormModal: React.FC<OrganizationFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const isEditMode = !!initialData;
    const [orgData, setOrgData] = useState<Partial<Organization>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setOrgData(initialData || { name: '', email: '', address: '', country: '', industry: '', businessId: '', contactPerson: '' });
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setOrgData({ ...orgData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (isEditMode && initialData) {
            const { id, members, ...updatePayload } = orgData;
            await api.updateOrganization(initialData.id, updatePayload);
        } else {
            const { id, members, subscriptionStatus, ...createPayload } = orgData;
            await api.createOrganization(createPayload as any); // Type assertion is okay here for mock API
        }
        setLoading(false);
        onSave();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? `Edit ${initialData.name}` : "Add New Organization"} size="xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Organization Name</Label>
                        <Input id="name" name="name" type="text" value={orgData.name || ''} onChange={handleChange} required />
                    </div>
                     <div>
                        <Label htmlFor="email">Primary Email</Label>
                        <Input id="email" name="email" type="email" value={orgData.email || ''} onChange={handleChange} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input id="contactPerson" name="contactPerson" type="text" value={orgData.contactPerson || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" name="industry" type="text" value={orgData.industry || ''} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" type="text" value={orgData.address || ''} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" type="text" value={orgData.country || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="businessId">Business ID</Label>
                        <Input id="businessId" name="businessId" type="text" value={orgData.businessId || ''} onChange={handleChange} />
                    </div>
                </div>
                {isEditMode && (
                     <div>
                        <Label htmlFor="subscriptionStatus">Subscription Status</Label>
                        <Select id="subscriptionStatus" name="subscriptionStatus" value={orgData.subscriptionStatus} onChange={handleChange}>
                            {Object.values(SubscriptionStatus).map(s => <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                        </Select>
                    </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Organization')}</Button>
                </div>
            </form>
        </Modal>
    );
};

// 14. Make Payment Modal
export const MakePaymentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    contract: Contract;
    onPaymentMade: () => void;
}> = ({ isOpen, onClose, contract, onPaymentMade }) => {
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setNotes('');
            setError('');
            setLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Please enter a valid positive amount.');
            return;
        }
        setError('');
        setLoading(true);
        await api.initiatePayment(contract.id, numericAmount, notes);
        setLoading(false);
        onPaymentMade();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Make Payment to ${contract.candidateName}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 {error && <p className="text-sm text-red-500">{error}</p>}
                <div>
                    <Label htmlFor="payment-amount">Amount ($)</Label>
                    <Input id="payment-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 2500" required />
                </div>
                <div>
                    <Label htmlFor="payment-notes">Notes (optional)</Label>
                    <Input id="payment-notes" type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g., October Salary" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Submit Payment'}</Button>
                </div>
            </form>
        </Modal>
    );
};

// 15. Admin: Add/Edit Candidate Modal
interface CandidateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: Candidate | null;
}
export const CandidateFormModal: React.FC<CandidateFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const isEditMode = !!initialData;
    const [candData, setCandData] = useState<Partial<Candidate>>({});
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCandData(initialData || { name: '', email: '', skills: [], experience: '', expectedRate: '', linkedinUrl: '' });
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCandData({ ...candData, [e.target.name]: e.target.value });
    };

    const handleFetchDetails = async () => {
        if (!candData.linkedinUrl) return;
        setIsFetching(true);
        try {
            const fetchedData = await api.scrapeLinkedInProfile(candData.linkedinUrl);
            if (fetchedData) {
                setCandData(prev => ({
                    ...prev,
                    name: fetchedData.name || prev.name,
                    skills: fetchedData.skills || prev.skills,
                    experience: fetchedData.experience || prev.experience,
                    avatarUrl: fetchedData.avatarUrl || prev.avatarUrl,
                }));
            } else {
                alert("Could not fetch details from LinkedIn profile. Please check the URL or try again later.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while fetching details.");
        }
        setIsFetching(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const dataToSave = {
            ...candData,
            skills: typeof candData.skills === 'string' ? (candData.skills as string).split(',').map(s => s.trim()) : candData.skills
        };

        if (isEditMode) {
            await api.updateCandidateProfile(dataToSave as Candidate);
        } else {
            await api.createCandidate(dataToSave as Omit<Candidate, 'id'>);
        }
        setLoading(false);
        onSave();
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? `Edit ${initialData?.name}` : "Add New Candidate"} size="xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                    <div className="flex items-center gap-2">
                        <Input 
                            id="linkedinUrl" 
                            name="linkedinUrl" 
                            type="url" 
                            value={candData.linkedinUrl || ''} 
                            onChange={handleChange} 
                            placeholder="https://www.linkedin.com/in/..." 
                            className="flex-grow"
                        />
                        <Button type="button" variant="secondary" onClick={handleFetchDetails} disabled={isFetching || !candData.linkedinUrl}>
                            {isFetching ? 'Fetching...' : 'Fetch Details'}
                        </Button>
                    </div>
                </div>
                 <hr className="border-gray-800"/>
                <div className="flex items-start gap-6">
                    <Avatar src={candData.avatarUrl} name={candData.name} size="xl" className="mt-6 flex-shrink-0" />
                    <div className="flex-grow space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" type="text" value={candData.name || ''} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={candData.email || ''} onChange={handleChange} required disabled={isEditMode} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="skills">Skills (comma-separated)</Label>
                            <Input id="skills" name="skills" type="text" value={Array.isArray(candData.skills) ? candData.skills.join(', ') : (candData.skills || '')} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="experience">Experience</Label>
                        <Input id="experience" name="experience" type="text" value={candData.experience || ''} onChange={handleChange} placeholder="e.g., 5 years" />
                    </div>
                     <div>
                        <Label htmlFor="expectedRate">Expected Rate</Label>
                        <Input id="expectedRate" name="expectedRate" type="text" value={candData.expectedRate || ''} onChange={handleChange} placeholder="e.g., $80/hr" />
                    </div>
                </div>
                 <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Candidate'}</Button>
                </div>
            </form>
        </Modal>
    )
};

// 16. Admin: CSV Upload Modal
export const CsvUploadModal: React.FC<{isOpen: boolean, onClose: () => void, onUploadComplete: () => void}> = ({ isOpen, onClose, onUploadComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<Omit<Candidate, 'id'>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetState = () => {
        setFile(null);
        setParsedData([]);
        setError('');
        setLoading(false);
    }
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if(selectedFile.type !== 'text/csv') {
            setError('Please upload a valid .csv file.');
            return;
        }

        setFile(selectedFile);
        setError('');
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const rows = text.split('\n').slice(1); // Skip header
            const candidates: Omit<Candidate, 'id'>[] = [];
            rows.forEach(row => {
                const [name, email, skills, experience, expectedRate] = row.split(',').map(s => s.trim());
                if (name && email) {
                    candidates.push({ name, email, skills: skills ? skills.split(';').map(s => s.trim()) : [], experience: experience || '', expectedRate: expectedRate || '' });
                }
            });
            setParsedData(candidates);
        };
        reader.readAsText(selectedFile);
    };

    const handleUpload = async () => {
        if (parsedData.length === 0) return;
        setLoading(true);
        const createdCount = await api.createCandidatesFromCsv(parsedData);
        alert(`${createdCount} new candidates were successfully added. Duplicates were ignored.`);
        setLoading(false);
        onUploadComplete();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { resetState(); onClose(); }} title="Upload Candidates via CSV" size="2xl">
            <div className="space-y-4">
                <div className="p-4 bg-blue-900/50 border border-blue-500/30 rounded-lg text-sm text-blue-200">
                    <p>Upload a CSV file with the headers: <strong>name, email, skills, experience, expectedRate</strong></p>
                    <p className="mt-1">Skills should be separated by a semicolon (e.g., "React;Node.js;TypeScript").</p>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Input type="file" accept=".csv" onChange={handleFileChange} />

                {parsedData.length > 0 && (
                    <>
                    <h4 className="font-semibold text-gray-200">Preview ({parsedData.length} records found)</h4>
                    <div className="max-h-60 overflow-y-auto border border-gray-800 rounded-lg">
                        <Table headers={['Name', 'Email', 'Skills']}>
                            {parsedData.slice(0, 10).map((cand, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-2 text-sm text-gray-200">{cand.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-300">{cand.email}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">{cand.skills.join(', ')}</td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                    </>
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={() => { resetState(); onClose(); }}>Cancel</Button>
                    <Button onClick={handleUpload} disabled={loading || parsedData.length === 0}>{loading ? `Adding ${parsedData.length} candidates...` : `Add ${parsedData.length} Candidates`}</Button>
                </div>
            </div>
        </Modal>
    );
};

// 17. Date Time Picker Component for Interview Modal
const DateTimePicker: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date(value || Date.now()));
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const [selectedTime, setSelectedTime] = useState<string>(value ? new Date(value).toTimeString().slice(0, 5) : '');

    useEffect(() => {
        if (selectedDate && selectedTime) {
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const newDateTime = new Date(selectedDate);
            newDateTime.setHours(hours, minutes, 0, 0);
            onChange(newDateTime.toISOString().slice(0, 16));
        }
    }, [selectedDate, selectedTime]);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();

    const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDay }, (_, i) => null);
    const calendarDays = [...blanks, ...daysInMonth];

    const timeSlots = Array.from({ length: 18 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calendar */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1 rounded-full hover:bg-gray-800 text-gray-200">&larr;</button>
                    <span className="font-semibold text-gray-200">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1 rounded-full hover:bg-gray-800 text-gray-200">&rarr;</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 mt-1">
                    {calendarDays.map((day, index) => (
                        day ? (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                className={`p-2 rounded-full text-sm text-gray-200 ${
                                    selectedDate && isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), selectedDate)
                                        ? 'bg-primary-500 text-gray-900 font-bold'
                                        : 'hover:bg-primary-500/20'
                                }`}
                            >
                                {day}
                            </button>
                        ) : (<div key={index}></div>)
                    ))}
                </div>
            </div>
            {/* Time Slots */}
            <div className="max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map(time => (
                        <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            disabled={!selectedDate}
                            className={`p-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                                selectedTime === time
                                    ? 'bg-primary-500 text-gray-900 font-bold'
                                    : 'bg-gray-800 text-gray-200 hover:bg-primary-500/20'
                            }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 18. Schedule Interview Modal
export const ScheduleInterviewModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onScheduled: (interview: Interview) => void;
    application?: Application | null;
    applications?: Application[];
    interview?: Interview | null;
    context?: 'job_details' | 'chat';
}> = ({ isOpen, onClose, onScheduled, application, applications, interview, context='job_details' }) => {
    const isReschedule = !!interview;
    const isFromChat = context === 'chat';
    const [selectedAppId, setSelectedAppId] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [platform, setPlatform] = useState<InterviewPlatform>(InterviewPlatform.GOOGLE_MEET);
    const [meetingLink, setMeetingLink] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const initialDateTime = new Date();
            initialDateTime.setDate(initialDateTime.getDate() + 1);
            initialDateTime.setHours(10, 0, 0, 0);

            setDateTime(interview?.dateTime || initialDateTime.toISOString().slice(0, 16));
            setPlatform(interview?.platform || InterviewPlatform.GOOGLE_MEET);
            setMeetingLink(interview?.meetingLink || '');
            setNotes(interview?.notes || '');
            setSelectedAppId(application?.id || (isFromChat && applications && applications.length > 0 ? applications[0].id : ''));
        }
    }, [isOpen, interview, application, applications]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const appId = isFromChat ? selectedAppId : application?.id;
        if (!appId) return;
        setLoading(true);

        const payload = {
            dateTime: new Date(dateTime).toISOString(),
            platform,
            meetingLink,
            notes,
        };

        if (isReschedule && interview) {
            await api.updateInterview(interview.id, interview.status, payload);
            onScheduled({ ...interview, ...payload });
        } else {
            const newInterview = await api.scheduleInterview(appId, payload);
            onScheduled(newInterview);
        }
        
        setLoading(false);
        onClose();
    };
    
    const targetApplication = isFromChat ? applications?.find(a => a.id === selectedAppId) : application;
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${isReschedule ? 'Reschedule' : 'Schedule'} Interview with ${targetApplication?.candidate?.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isFromChat && applications && (
                    <div>
                        <Label htmlFor="applicationId">For Job Application</Label>
                        <Select id="applicationId" value={selectedAppId} onChange={e => setSelectedAppId(e.target.value)} required>
                            {applications.map(app => <option key={app.id} value={app.id}>{app.job?.title}</option>)}
                        </Select>
                    </div>
                )}

                <div>
                    <Label>Date & Time</Label>
                    <DateTimePicker value={dateTime} onChange={setDateTime} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Select id="platform" value={platform} onChange={e => setPlatform(e.target.value as InterviewPlatform)}>
                            {Object.values(InterviewPlatform).map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="meetingLink">Meeting Link</Label>
                        <Input id="meetingLink" type="url" value={meetingLink} onChange={e => setMeetingLink(e.target.value)} placeholder="https://..." />
                    </div>
                </div>
                <div>
                    <Label htmlFor="notes">Notes for Candidate (optional)</Label>
                    <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isReschedule ? 'Update Interview' : 'Schedule Interview')}</Button>
                </div>
            </form>
        </Modal>
    );
};
