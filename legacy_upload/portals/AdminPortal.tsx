import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../components/Layout';
import DashboardCard from '../components/DashboardCard';
import { Card, Badge, Button, Input, Select } from '../components/ui';
import { OrgDetailsModal, CandidateProfileModal, FulfillRequestModal, OrganizationFormModal, ContractModal, CandidateFormModal, CsvUploadModal } from '../components/modals';
import { Organization, Job, Candidate, SubscriptionStatus, JobStatus, ShortlistRequest, ShortlistRequestStatus, Contract, ContractStatus, Role, Payment, PaymentStatus } from '../types';
import api from '../lib/api';
import MessagesPage from './MessagesPage';
import { useAuth } from '../contexts/AuthContext';

// ... (component code remains largely the same, just removed react-router-dom imports)

// (All sub-components like DashboardView, OrgsView, etc. are defined here as before)
// Icons for Dashboard
const Icons = {
    Orgs: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Jobs: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h4"/></svg>,
    Candidates: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>,
    Trial: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
}

const DashboardView: React.FC = () => {
    const [stats, setStats] = useState({ activeOrgs: 0, trialingOrgs: 0, candidatePoolSize: 0, openJobs: 0 });
    useEffect(() => {
        api.getAdminDashboardStats().then(setStats);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard title="Active Orgs" value={stats.activeOrgs} icon={<Icons.Orgs className="h-6 w-6"/>} />
            <DashboardCard title="Trialing Orgs" value={stats.trialingOrgs} icon={<Icons.Trial className="h-6 w-6"/>} />
            <DashboardCard title="Candidate Pool" value={stats.candidatePoolSize} icon={<Icons.Candidates className="h-6 w-6"/>} />
            <DashboardCard title="Open Jobs" value={stats.openJobs} icon={<Icons.Jobs className="h-6 w-6"/>} />
        </div>
    );
};

const OrgsView: React.FC = () => {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [viewingOrg, setViewingOrg] = useState<Organization | null>(null);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    
    const fetchOrgs = useCallback(() => {
        api.getAllOrganizations().then(setOrgs);
    }, []);

    useEffect(() => { fetchOrgs(); }, [fetchOrgs]);
    
    const handleDelete = async (orgId: string, orgName: string) => {
        if (window.confirm(`Are you sure you want to delete ${orgName}? This will also delete all associated users and jobs. This action cannot be undone.`)) {
            await api.deleteOrganization(orgId);
            fetchOrgs();
        }
    }
    
    const statusColorMap: Record<SubscriptionStatus, 'green' | 'yellow' | 'red' | 'gray'> = {
        [SubscriptionStatus.ACTIVE]: 'green',
        [SubscriptionStatus.TRIALING]: 'yellow',
        [SubscriptionStatus.INACTIVE]: 'red',
        [SubscriptionStatus.HOLD]: 'gray',
    };

    return (
        <>
            <OrganizationFormModal 
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSave={() => {
                    fetchOrgs();
                }}
            />
            <OrgDetailsModal
                isOpen={!!viewingOrg}
                onClose={() => setViewingOrg(null)}
                organization={viewingOrg}
            />
             <OrganizationFormModal 
                isOpen={!!editingOrg}
                onClose={() => setEditingOrg(null)}
                onSave={() => {
                    fetchOrgs();
                }}
                initialData={editingOrg}
            />
            <Card title="All Organizations" actions={<Button onClick={() => setAddModalOpen(true)}>Add Organization</Button>}>
                <div className="-m-6">
                    {/* Headers */}
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-3/12">Name</div>
                        <div className="w-2/12">Industry</div>
                        <div className="w-3/12">Contact Person</div>
                        <div className="w-2/12">Status</div>
                        <div className="w-2/12 text-right">Actions</div>
                    </div>
                    {/* List */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {orgs.map(org => (
                            <div key={org.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-3/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Name</div>
                                    <div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{org.name}</div>
                                </div>
                                <div className="md:w-2/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Industry</div>
                                    <div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{org.industry || 'N/A'}</div>
                                </div>
                                <div className="md:w-3/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Contact</div>
                                    <div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{org.contactPerson || 'N/A'}</div>
                                </div>
                                <div className="md:w-2/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div>
                                    <div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[org.subscriptionStatus]}>{org.subscriptionStatus}</Badge></div>
                                </div>
                                <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => setViewingOrg(org)}>View</Button>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingOrg(org)}>Edit</Button>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={() => handleDelete(org.id, org.name)}>Delete</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </>
    );
};

const JobsView: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    useEffect(() => { api.getAllJobs().then(setJobs); }, []);
    
    const statusColorMap: Record<JobStatus, 'green' | 'gray' | 'yellow'> = {
        [JobStatus.OPEN]: 'green',
        [JobStatus.CLOSED]: 'gray',
        [JobStatus.DRAFT]: 'yellow',
    };

    return (
        <Card title="All Jobs">
            <div className="-m-6">
                 <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    <div className="w-4/12">Title</div>
                    <div className="w-3/12">Organization</div>
                    <div className="w-2/12">Status</div>
                    <div className="w-1/12">Apps</div>
                    <div className="w-2/12 text-right">Actions</div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {jobs.map(job => (
                         <div key={job.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                            <div className="md:w-4/12">
                                <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Title</div>
                                <div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{job.title}</div>
                            </div>
                            <div className="md:w-3/12">
                                <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Organization</div>
                                <div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{job.organizationName}</div>
                            </div>
                            <div className="md:w-2/12">
                                <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div>
                                <div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[job.status]}>{job.status}</Badge></div>
                            </div>
                            <div className="md:w-1/12">
                                <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Apps</div>
                                <div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{job.applicationsCount}</div>
                            </div>
                            <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                <Button variant="ghost" size="sm" onClick={() => alert(`Details for "${job.title}":\n\n${job.description}`)}>View Details</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

const CandidatesView: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isCsvModalOpen, setCsvModalOpen] = useState(false);

    const fetchCandidates = useCallback(() => {
        api.getAllCandidates().then(setCandidates);
    }, []);

    useEffect(() => { fetchCandidates(); }, [fetchCandidates]);
    
    return (
        <>
            <CandidateProfileModal
                isOpen={!!viewingCandidate}
                onClose={() => setViewingCandidate(null)}
                candidate={viewingCandidate}
            />
             <CandidateFormModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSave={fetchCandidates}
            />
            <CsvUploadModal
                isOpen={isCsvModalOpen}
                onClose={() => setCsvModalOpen(false)}
                onUploadComplete={fetchCandidates}
            />
            <Card title="All Candidates" actions={
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setCsvModalOpen(true)}>Upload CSV</Button>
                    <Button onClick={() => setAddModalOpen(true)}>Add Candidate</Button>
                </div>
            }>
                <div className="-m-6">
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-3/12">Name</div>
                        <div className="w-3/12">Email</div>
                        <div className="w-4/12">Skills</div>
                        <div className="w-2/12 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {candidates.map(c => (
                            <div key={c.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-3/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Name</div>
                                    <div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{c.name}</div>
                                </div>
                                <div className="md:w-3/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Email</div>
                                    <div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.email}</div>
                                </div>
                                <div className="md:w-4/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Skills</div>
                                    <div className="flex flex-wrap gap-1">
                                        {c.skills.slice(0, 4).map(skill => <Badge key={skill}>{skill}</Badge>)}
                                    </div>
                                </div>
                                <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                    <Button variant="ghost" size="sm" onClick={() => setViewingCandidate(c)}>View Profile</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </>
    );
};

const ShortlistRequestsView: React.FC = () => {
    const [requests, setRequests] = useState<ShortlistRequest[]>([]);
    const [fulfillingRequest, setFulfillingRequest] = useState<ShortlistRequest | null>(null);

    const fetchRequests = useCallback(() => {
        api.getShortlistRequestsForAdmin().then(setRequests);
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const statusColorMap: Record<ShortlistRequestStatus, 'yellow' | 'green'> = {
        [ShortlistRequestStatus.PENDING]: 'yellow',
        [ShortlistRequestStatus.FULFILLED]: 'green',
    };

    return (
        <>
            <FulfillRequestModal
                isOpen={!!fulfillingRequest}
                onClose={() => setFulfillingRequest(null)}
                request={fulfillingRequest}
                onFulfilled={fetchRequests}
            />
            <Card title="Client Shortlist Requests">
                <div className="-m-6">
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-4/12">Organization</div>
                        <div className="w-4/12">Project Goal</div>
                        <div className="w-1/12">Status</div>
                        <div className="w-1/12">Date</div>
                        <div className="w-2/12 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {requests.map(req => (
                             <div key={req.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-4/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Org</div>
                                    <div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{req.organizationName}</div>
                                </div>
                                <div className="md:w-4/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Goal</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{req.projectDetails.goal}</div>
                                </div>
                                <div className="md:w-1/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div>
                                    <div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[req.status]}>{req.status}</Badge></div>
                                </div>
                                <div className="md:w-1/12">
                                    <div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Date</div>
                                    <div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(req.requestedDate).toLocaleDateString()}</div>
                                </div>
                                <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                    {req.status === ShortlistRequestStatus.PENDING ? (
                                        <Button size="sm" onClick={() => setFulfillingRequest(req)}>Fulfill</Button>
                                    ) : (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Fulfilled ({req.assignedCandidates.length} assigned)</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </>
    );
}

const ContractsView: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewingContract, setViewingContract] = useState<Contract | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        api.getAllContracts().then(data => {
            setContracts(data);
            setFilteredContracts(data);
        });
    }, []);

    useEffect(() => {
        let result = contracts;
        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }
        if (searchTerm) {
            result = result.filter(c => 
                c.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredContracts(result);
    }, [searchTerm, statusFilter, contracts]);

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
                userRole={user!.role} // Admin role
                onSigned={() => { /* Admin doesn't sign, so no-op */ }}
            />
            <Card>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <Input 
                        placeholder="Search by name or job..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-grow"
                    />
                    <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        {Object.values(ContractStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                <div className="-mx-6 -mb-6">
                     <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-3/12">Candidate</div>
                        <div className="w-3/12">Client</div>
                        <div className="w-2/12">Job Title</div>
                        <div className="w-2/12">Status</div>
                        <div className="w-1/12">Date</div>
                        <div className="w-1/12 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {filteredContracts.map(c => (
                             <div key={c.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Candidate</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{c.candidateName}</div></div>
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Client</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.clientName}</div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Job</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.jobTitle}</div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[c.status]}>{c.status}</Badge></div></div>
                                <div className="md:w-1/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Date</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(c.generatedDate).toLocaleDateString()}</div></div>
                                <div className="md:w-1/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                    <Button size="sm" variant="ghost" onClick={() => setViewingContract(c)}>View</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </>
    );
};

const PaymentsView: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [disbursingId, setDisbursingId] = useState<string | null>(null);

    const fetchPayments = useCallback(() => {
        setLoading(true);
        api.getAllPayments().then(data => {
            const sorted = data.sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
            setPayments(sorted);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredPayments(payments);
        } else {
            setFilteredPayments(payments.filter(p => p.status === statusFilter));
        }
    }, [statusFilter, payments]);

    const handleDisburse = async (paymentId: string) => {
        setDisbursingId(paymentId);
        await api.disbursePayment(paymentId);
        fetchPayments();
        setDisbursingId(null);
    };
    
    const statusColorMap: Record<PaymentStatus, 'yellow' | 'green'> = {
        [PaymentStatus.PENDING_DISBURSEMENT]: 'yellow',
        [PaymentStatus.DISBURSED]: 'green',
    };
    
    return (
        <Card title="Platform Transactions">
            <div className="flex justify-end mb-4">
                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-auto">
                    <option value="all">All Statuses</option>
                    <option value={PaymentStatus.PENDING_DISBURSEMENT}>{PaymentStatus.PENDING_DISBURSEMENT}</option>
                    <option value={PaymentStatus.DISBURSED}>{PaymentStatus.DISBURSED}</option>
                </Select>
            </div>
            {loading ? <p>Loading payments...</p> : (
                <div className="-mx-6 -mb-6">
                    <div className="hidden md:flex items-center px-6 py-3 bg-gray-100 dark:bg-black/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                        <div className="w-3/12">Client</div>
                        <div className="w-3/12">Candidate</div>
                        <div className="w-2/12">Amount</div>
                        <div className="w-1/12">Date Paid</div>
                        <div className="w-1/12">Status</div>
                        <div className="w-2/12 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {filteredPayments.map(p => (
                            <div key={p.id} className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 space-y-4 md:space-y-0">
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Client</div><div className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{p.clientName}</div></div>
                                <div className="md:w-3/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Candidate</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.candidateName}</div></div>
                                <div className="md:w-2/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Amount</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.amount)}</div></div>
                                <div className="md:w-1/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Date</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(p.paymentDate).toLocaleDateString()}</div></div>
                                <div className="md:w-1/12"><div className="md:hidden text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-1">Status</div><div className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><Badge color={statusColorMap[p.status]}>{p.status}</Badge></div></div>
                                <div className="md:w-2/12 whitespace-nowrap text-left md:text-right text-sm font-medium">
                                    {p.status === PaymentStatus.PENDING_DISBURSEMENT && (
                                        <Button size="sm" onClick={() => handleDisburse(p.id)} disabled={disbursingId === p.id}>
                                            {disbursingId === p.id ? 'Processing...' : 'Disburse Funds'}
                                        </Button>
                                    )}
                                    {p.status === PaymentStatus.DISBURSED && <span className="text-xs text-gray-500">Disbursed on {new Date(p.disbursementDate!).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             {filteredPayments.length === 0 && !loading && <p className="text-center text-gray-500 py-8">No payments match the current filter.</p>}
        </Card>
    );
};


const AdminPortal: React.FC = () => {
    const router = useRouter();
    const { slug } = router.query;
    const page = Array.isArray(slug) ? slug[0] : 'dashboard';

    const getPageTitle = () => {
        if (page === 'organizations') return 'Organizations';
        if (page === 'jobs') return 'Jobs';
        if (page === 'candidates') return 'Candidates';
        if (page === 'shortlist-requests') return 'Shortlist Requests';
        if (page === 'contracts') return 'Contracts';
        if (page === 'payments') return 'Payments';
        if (page === 'messages') return 'Messages';
        return 'Admin Dashboard';
    };

    const renderContent = () => {
        switch(page) {
            case 'organizations': return <OrgsView />;
            case 'jobs': return <JobsView />;
            case 'candidates': return <CandidatesView />;
            case 'shortlist-requests': return <ShortlistRequestsView />;
            case 'contracts': return <ContractsView />;
            case 'payments': return <PaymentsView />;
            case 'messages': return <MessagesPage />;
            default: return <DashboardView />;
        }
    }

    return (
        <PortalLayout pageTitle={getPageTitle()}>
            {renderContent()}
        </PortalLayout>
    );
};

export default AdminPortal;
