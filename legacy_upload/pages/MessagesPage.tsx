import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Conversation, Message, Role, Candidate, Application, MessageAttachment, Interview, Job } from '../types';
import api from '../data';
import { Card, Button, Input, Badge, Avatar } from '../components/ui';
import { NewConversationModal, ShareCandidateModal, CandidateProfileModal, ScheduleInterviewModal } from '../components/modals';

const Icons = {
    Job: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25V14.15M18.75 18.75v-6.098a2.25 2.25 0 00-2.25-2.25h-3.51a2.25 2.25 0 00-2.25 2.25v6.098M18.75 18.75h-15M12 12.75h.008v.008H12v-.008z" /></svg>,
    Calendar: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>,
    Platform: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>,
};

const CandidateProfileAttachment: React.FC<{ candidateId: string }> = ({ candidateId }) => {
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        api.getCandidate(candidateId).then(setCandidate);
    }, [candidateId]);

    if (!candidate) return <div className="p-3 text-sm text-gray-500 dark:text-gray-500">Loading candidate profile...</div>;

    return (
        <>
            <CandidateProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} candidate={candidate} />
            <div className="p-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Recommended Candidate:</p>
                <div className="flex items-center gap-3">
                    <Avatar src={candidate.avatarUrl} name={candidate.name} size="md" />
                    <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100">{candidate.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.skills.slice(0, 3).join(' · ')}</p>
                    </div>
                </div>
                <Button size="sm" variant="secondary" className="w-full mt-3" onClick={() => setIsModalOpen(true)}>
                    View Full Profile
                </Button>
            </div>
        </>
    );
}

const InterviewAttachmentCard: React.FC<{ interviewId: string }> = ({ interviewId }) => {
    const [interview, setInterview] = useState<(Interview & { job?: Job }) | null>(null);

    useEffect(() => {
        api.getInterviewById(interviewId).then(setInterview);
    }, [interviewId]);

    if (!interview) {
        return <div className="p-4 text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading interview details...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Interview Scheduled</h4>
                <Badge color="yellow">{interview.status}</Badge>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Icons.Job className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium">{interview.job?.title}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Icons.Calendar className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <span>{new Date(interview.dateTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Icons.Platform className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <span>{interview.platform}</span>
                </div>
            </div>
            {interview.meetingLink && (
                 <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="secondary" className="w-full mt-4">Join Meeting</Button>
                </a>
            )}
        </div>
    );
};


const MessagesPage: React.FC = () => {
    const { user } = useAuth();
    const { conversationId } = useParams<{ conversationId?: string }>();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isNewConvoModalOpen, setIsNewConvoModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [applicationsForScheduling, setApplicationsForScheduling] = useState<Application[]>([]);


    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSelectConversation = useCallback(async (convo: Conversation | null) => {
        const path = `/${user?.role.split('_')[0].toLowerCase()}/messages${convo ? `/${convo.id}` : ''}`;
        navigate(path);
        setSelectedConversation(convo);
        if (convo && convo.unreadCount && convo.unreadCount > 0) {
            await api.markConversationAsRead(convo.id);
            // Optimistically update the UI to remove the unread bubble
            setConversations(prev => prev.map(c => 
                c.id === convo.id ? { ...c, unreadCount: 0 } : c
            ));
        }
    }, [user, navigate]);

    const fetchConversations = useCallback(() => {
        if (user) {
            setLoadingConversations(true);
            api.getConversationsForUser(user.id).then(data => {
                setConversations(data);
                setLoadingConversations(false);
            });
        }
    }, [user]);
    
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const convoToSelect = conversations.find(c => c.id === conversationId);
            if (convoToSelect && convoToSelect.id !== selectedConversation?.id) {
                setSelectedConversation(convoToSelect);
            }
        } else if (!conversationId) {
            setSelectedConversation(null);
        }
    }, [conversationId, conversations, selectedConversation]);

    useEffect(() => {
        if (selectedConversation) {
            setLoadingMessages(true);
            api.getMessagesForConversation(selectedConversation.id).then(data => {
                setMessages(data);
                setLoadingMessages(false);
            });
        } else {
            setMessages([]);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text: string, attachment?: MessageAttachment) => {
        if (!selectedConversation || !user) return;
        if (!text.trim() && !attachment) return;

        const tempMessage: Message = {
            id: 'temp-' + Date.now(),
            conversationId: selectedConversation.id,
            senderId: user.id,
            text: text.trim(),
            timestamp: new Date().toISOString(),
            attachment,
        };
        
        setMessages(prev => [...prev, tempMessage]);
        if (!attachment) {
            setNewMessage('');
        }
        
        await api.sendMessage(selectedConversation.id, user.id, tempMessage.text, tempMessage.attachment);
        
        // Refresh everything to ensure sync
        api.getMessagesForConversation(selectedConversation.id).then(setMessages);
        fetchConversations();
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(newMessage);
    }

    const handleShareCandidate = (candidateId: string) => {
        handleSendMessage('', { type: 'candidateProfile', candidateId });
    }
    
    const handleConversationCreated = (newConvo: Conversation) => {
        fetchConversations();
        handleSelectConversation(newConvo);
    };

    const handleOpenScheduleModal = async () => {
        const otherParticipant = getOtherParticipant(selectedConversation!);
        if (otherParticipant?.role === Role.CANDIDATE) {
            const candidateUser = await api.getUser(otherParticipant.id);
            if(candidateUser){
                const apps = await api.getApplicationsForCandidate(candidateUser.id);
                if (apps.length > 0) {
                    setApplicationsForScheduling(apps);
                    setIsScheduleModalOpen(true);
                } else {
                    alert("This candidate has no active job applications to schedule an interview for.");
                }
            }
        }
    };
    
    const handleInterviewScheduled = (interview: Interview) => {
        setIsScheduleModalOpen(false);
        const text = `I've scheduled the interview.`;
        const attachment: MessageAttachment = { type: 'interview', interviewId: interview.id };
        handleSendMessage(text, attachment);
    };


    const getOtherParticipant = (convo: Conversation) => {
        return convo.participants.find(p => p.id !== user?.id);
    };

    const otherParticipant = selectedConversation ? getOtherParticipant(selectedConversation) : null;
    const isChatWithCandidate = otherParticipant?.role === Role.CANDIDATE;
    const canSchedule = (user?.role === Role.ADMIN || user?.role.startsWith('CLIENT')) && isChatWithCandidate;

    return (
        <>
            {user && (
                <>
                <NewConversationModal
                    isOpen={isNewConvoModalOpen}
                    onClose={() => setIsNewConvoModalOpen(false)}
                    adminId={user.id}
                    onConversationCreated={handleConversationCreated}
                />
                <ShareCandidateModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    onShare={handleShareCandidate}
                />
                <ScheduleInterviewModal
                    isOpen={isScheduleModalOpen}
                    onClose={() => setIsScheduleModalOpen(false)}
                    onScheduled={handleInterviewScheduled}
                    applications={applicationsForScheduling}
                    context="chat"
                />
                </>
            )}
            <div className="flex h-[calc(100vh-140px)] rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                {/* Conversations List */}
                 <div className={`
                    ${selectedConversation && conversationId ? 'hidden md:flex' : 'flex'} 
                    w-full md:w-1/3 border-r border-gray-200 dark:border-gray-800 flex-col
                `}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Conversations</h2>
                        {user?.role === Role.ADMIN && (
                            <Button size="sm" onClick={() => setIsNewConvoModalOpen(true)}>New Message</Button>
                        )}
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {loadingConversations ? <p className="p-4 text-sm text-gray-500">Loading...</p> : conversations.map(convo => (
                            <div
                                key={convo.id}
                                onClick={() => handleSelectConversation(convo)}
                                className={`p-4 cursor-pointer border-b border-gray-200 dark:border-gray-800 flex justify-between items-start ${selectedConversation?.id === convo.id ? 'bg-primary-50 dark:bg-primary-950/40' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                            >
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{getOtherParticipant(convo)?.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{convo.lastMessageSnippet}</p>
                                </div>
                                {convo.unreadCount && convo.unreadCount > 0 ? (
                                    <Badge color="yellow" className="ml-2 !px-2 !py-1 !text-xs">{convo.unreadCount}</Badge>
                                ) : null}
                            </div>
                        ))}
                         {conversations.length === 0 && !loadingConversations && (
                            <p className="p-4 text-center text-sm text-gray-500">No conversations yet.</p>
                         )}
                    </div>
                </div>

                {/* Messages View */}
                <div className={`
                    ${selectedConversation && conversationId ? 'flex' : 'hidden md:flex'} 
                    w-full md:w-2/3 flex-col bg-gray-50 dark:bg-gray-950
                `}>
                    {selectedConversation ? (
                        <>
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
                                 <button className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => handleSelectConversation(null)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                 </button>
                                <h2 className="text-lg font-semibold">{getOtherParticipant(selectedConversation)?.name}</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {loadingMessages ? <p className="text-sm text-gray-500">Loading messages...</p> : messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl shadow-sm ${msg.senderId === user?.id ? 'bg-primary-500 text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'} ${msg.attachment ? '' : 'px-4 py-2'}`}>
                                           {msg.text && !msg.attachment && <p>{msg.text}</p>}
                                           {msg.attachment?.type === 'candidateProfile' && <CandidateProfileAttachment candidateId={msg.attachment.candidateId} /> }
                                           {msg.attachment?.type === 'interview' && (
                                                <div className="shadow-lg rounded-xl bg-white/60 dark:bg-gray-700/30 backdrop-blur-lg border border-gray-200 dark:border-gray-600/50">
                                                    <InterviewAttachmentCard interviewId={msg.attachment.interviewId} />
                                                </div>
                                           )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                                    {user?.role === Role.ADMIN && otherParticipant?.role?.startsWith('CLIENT') && (
                                        <Button type="button" variant="secondary" onClick={() => setIsShareModalOpen(true)} title="Share a candidate profile">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                        </Button>
                                    )}
                                    {canSchedule && (
                                         <Button type="button" variant="secondary" onClick={handleOpenScheduleModal} title="Schedule an interview">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                                        </Button>
                                    )}
                                    <Input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit">Send</Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MessagesPage;