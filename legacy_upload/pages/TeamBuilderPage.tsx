import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Label, Select, Textarea, Badge } from '../components/ui';
import { ShortlistConfirmationModal } from '../components/modals';
import { ProjectDetails, ProjectCategory, SimulationResult, TeamMember } from '../types';
import api, { ROLES_DATABASE } from '../data';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from '../components/Logo';

const Icons = {
    Clock: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    Cost: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    Team: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Print: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>,
}

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['Project Goal', 'Timeline & Budget', 'Simulation'];
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                        {stepIdx < currentStep ? (
                             <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-primary-500"></div>
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-gray-900 font-bold">
                                    <span>{stepIdx + 1}</span>
                                </div>
                            </>
                        ) : stepIdx === currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-500 bg-white dark:bg-gray-900">
                                    <span className="text-primary-600 dark:text-primary-400">{stepIdx + 1}</span>
                                </div>
                                <div className="absolute bottom-[-2rem] text-center w-full min-w-max">
                                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{step}</span>
                                </div>
                            </>
                        ) : (
                             <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                                    <span className="text-gray-600 dark:text-gray-400">{stepIdx + 1}</span>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

const TeamBuilderPage: React.FC = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [project, setProject] = useState<ProjectDetails>({
        goal: '',
        category: ProjectCategory.SAAS,
        timeline: 12,
        budget: 50000,
    });
    const [simulation, setSimulation] = useState<SimulationResult | null>(null);
    const [currentTeam, setCurrentTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [roleToAdd, setRoleToAdd] = useState<string>('');
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    
    useEffect(() => {
        if(simulation) {
            const result = api.runSimulation(currentTeam, project);
            setSimulation(sim => sim ? {...sim, estimatedWeeks: result.estimatedWeeks, estimatedCost: result.estimatedCost } : null);
        }
    }, [currentTeam, project]);

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = await api.generateTeamSuggestion(project);
        setSimulation(result);
        setCurrentTeam(result.team);
        setLoading(false);
        setStep(3);
    };
    
    const handleTeamChange = (roleId: string, change: 1 | -1) => {
        setCurrentTeam(prevTeam =>
            prevTeam
                .map(member =>
                    member.roleId === roleId
                        ? { ...member, count: member.count + change }
                        : member
                )
                .filter(member => member.count > 0)
        );
    };

    const handleAddRole = () => {
        if (!roleToAdd || currentTeam.some(m => m.roleId === roleToAdd)) return;

        const roleData = ROLES_DATABASE.find(r => r.id === roleToAdd);
        if (roleData) {
            setCurrentTeam(prev => [...prev, {
                roleId: roleData.id,
                roleName: roleData.name,
                count: 1,
            }]);
            setRoleToAdd('');
        }
    };

    const handleComparisonSelect = (team: TeamMember[]) => {
        setCurrentTeam(team);
    }

    const handleRequestShortlist = async () => {
        if (!user?.organizationId) {
            alert("Error: Could not find your organization ID.");
            return;
        }
        setLoading(true);
        await api.createShortlistRequest(user.organizationId, project, currentTeam);
        setLoading(false);
        setConfirmationModalOpen(true);
    };
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    
    const availableRolesToAdd = ROLES_DATABASE.filter(
        role => !currentTeam.some(member => member.roleId === role.id)
    );

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                        <div>
                            <Label htmlFor="goal">What is your main project goal?</Label>
                            <Textarea id="goal" placeholder="e.g., Build an MVP SaaS dashboard for data visualization..." value={project.goal} onChange={e => setProject(prev => ({...prev, goal: e.target.value}))} required />
                        </div>
                        <div>
                            <Label htmlFor="category">Select a project category:</Label>
                            <Select id="category" value={project.category} onChange={e => setProject(prev => ({...prev, category: e.target.value as ProjectCategory}))}>
                                {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </Select>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit">Next: Timeline & Budget &rarr;</Button>
                        </div>
                    </form>
                );
            case 2:
                 return (
                    <form onSubmit={handleProjectSubmit} className="space-y-8">
                        <div>
                            <div className="flex justify-between">
                                <Label htmlFor="timeline">Desired Timeline (in weeks)</Label>
                                <span className="font-bold text-primary-600 dark:text-primary-400">{project.timeline} weeks</span>
                            </div>
                            <input type="range" id="timeline" min="4" max="52" value={project.timeline} onChange={e => setProject(prev => ({...prev, timeline: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"/>
                        </div>
                         <div>
                            <div className="flex justify-between">
                                <Label htmlFor="budget">Monthly Budget</Label>
                                <span className="font-bold text-primary-600 dark:text-primary-400">{formatCurrency(project.budget)}</span>
                            </div>
                            <input type="range" id="budget" min="5000" max="100000" step="1000" value={project.budget} onChange={e => setProject(prev => ({...prev, budget: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"/>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                             <Button type="button" variant="secondary" onClick={() => setStep(1)}>&larr; Back</Button>
                             <Button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Generate Team & Simulation &rarr;'}</Button>
                        </div>
                    </form>
                );
            case 3:
                if (!simulation) return <p>No simulation data found.</p>;

                const progress = Math.min(100, (project.timeline / simulation.estimatedWeeks) * 100);

                return (
                    <div id="proposal-content" className="space-y-8 print:space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Panel: Team Composition */}
                            <Card title="Suggested Team" className="lg:col-span-1">
                                <div className="space-y-4">
                                    {currentTeam.map(member => (
                                         <div key={member.roleId} className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">{member.roleName}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleTeamChange(member.roleId, -1)} className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600">-</button>
                                                <span className="w-6 text-center font-bold">{member.count}</span>
                                                <button onClick={() => handleTeamChange(member.roleId, 1)} className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600">+</button>
                                            </div>
                                         </div>
                                    ))}
                                    {currentTeam.length === 0 && <p className="text-sm text-center text-gray-500 py-4">Add a role to get started.</p>}
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                                    <Label>Add a new role:</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Select
                                            value={roleToAdd}
                                            onChange={e => setRoleToAdd(e.target.value)}
                                            className="flex-grow"
                                        >
                                            <option value="">Select a role...</option>
                                            {availableRolesToAdd.map(role => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleAddRole}
                                            disabled={!roleToAdd}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <h4 className="font-semibold text-sm mb-2">Comparison Scenarios:</h4>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleComparisonSelect(simulation.comparisonOptions['MVP Starter'])}>Lean</Button>
                                        <Button size="sm" variant="secondary" onClick={() => handleComparisonSelect(simulation.comparisonOptions['Balanced Growth'])}>Balanced</Button>
                                        <Button size="sm" variant="secondary" onClick={() => handleComparisonSelect(simulation.comparisonOptions['Fast-Track'])}>Fast-Track</Button>
                                    </div>
                                </div>
                            </Card>
                            
                            {/* Right Panel: Simulation & Cost */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card title="Timeline & Cost Simulation">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <Icons.Clock className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-1" />
                                                <p className="font-bold text-2xl">{simulation.estimatedWeeks} <span className="text-lg font-medium text-gray-500 dark:text-gray-400">wks</span></p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                                            </div>
                                             <div className="text-center">
                                                <Icons.Cost className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-1" />
                                                <p className="font-bold text-2xl">{formatCurrency(simulation.estimatedCost)}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Cost</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Delivery vs. Deadline ({project.timeline} weeks)</Label>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                                <div className={`h-4 rounded-full ${progress >= 100 ? 'bg-green-500' : progress > 70 ? 'bg-primary-500' : 'bg-red-500'}`} style={{width: `${progress}%`}}></div>
                                            </div>
                                             <p className={`text-sm mt-1 font-semibold ${progress >= 100 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                                {progress >= 100 ? 'On track to meet your deadline!' : 'Team may be too small for this deadline.'}
                                             </p>
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">AI Recommendation</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{simulation.aiExplanation}</p>
                                </Card>
                            </div>
                        </div>
                        <div className="flex justify-between items-center print:hidden">
                            <Button variant="secondary" onClick={() => setStep(1)}>&larr; Start Over</Button>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => window.print()}><Icons.Print className="mr-2"/> Export as PDF</Button>
                                <Button onClick={handleRequestShortlist} disabled={loading}>{loading ? 'Submitting...' : 'Request Shortlist'}</Button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }
    
    return (
        <div className="space-y-10">
            <ShortlistConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
            />
            <div className="flex justify-center py-4 print:hidden">
                <StepIndicator currentStep={step-1} />
            </div>
            
            <div id="print-header" className="hidden print:block mb-8 text-gray-900">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <LogoIcon className="h-7 w-auto" />
                         <span className="font-bold text-xl text-gray-800">PlugPlayers</span>
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold">Project Team Proposal</h1>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                 </div>
                 <hr className="mt-4" />
            </div>

            <Card title={
                step === 1 ? 'Describe Your Project' :
                step === 2 ? 'Set Your Constraints' :
                'Review Your Custom Team Plan'
            } className="print:shadow-none print:border-0 dark:print:border print:bg-white print:text-gray-900">
                {renderStep()}
            </Card>

            <style>{`
                @media print {
                    html, body {
                        background-color: white !important;
                        color: #111827 !important;
                    }
                    .dark {
                        --tw-bg-opacity: 1 !important;
                        background-color: white !important;
                    }
                    .dark body {
                        color: #111827 !important;
                    }
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:border-0 { border-width: 0 !important; }
                    .print\\:border { border-width: 1px !important; border-color: #e5e7eb !important; }
                    main.py-10 { padding: 2rem 0 !important; }
                    .print\\:bg-white { background-color: white !important; }
                    .print\\:text-gray-900 * { color: #111827 !important; }
                    .print\\:text-gray-900 { color: #111827 !important; }
                }
            `}</style>
        </div>
    );
};

export default TeamBuilderPage;