import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Employee, ChatGroup, ChatMessage, DirectChat, ActiveChat } from '@/types/chat';
import ChatHeader from '../chat/ChatHeader';
import ChatList from '../chat/ChatList';
import ChatWindow from '../chat/ChatWindow';
import MessageInput from '../chat/MessageInput';
import CreateGroupDialog from '../chat/CreateGroupDialog';

interface FloatingChatProps {
  onClose?: () => void;
  currentUser?: {
    id: string;
    name: string;
    role: string;
  };
}

const FloatingChat: React.FC<FloatingChatProps> = ({ onClose, currentUser }) => {
  // UI State
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 384, height: 480 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [position, setPosition] = useState({ x: 24, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });

  // Chat State
  const [currentView, setCurrentView] = useState<'chatList' | 'chat' | 'profile'>('chatList');
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    searchType: 'all',
    employeeName: '',
    groupName: '',
    department: '',
    messageContent: '',
    fileName: '',
    topics: '',
    dateRange: { start: '', end: '' }
  });

  // Data State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [directChats, setDirectChats] = useState<DirectChat[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);

  // Dialog State
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);


  // Refs
  const chatRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock Data Initialization
  useEffect(() => {
    const mockEmployees: Employee[] = [
      { id: '1', name: 'John Smith', email: 'john@company.com', position: 'Developer', department: 'Engineering', isOnline: true },
      { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', position: 'Designer', department: 'Design', isOnline: false, lastSeen: new Date(Date.now() - 300000) },
      { id: '3', name: 'Mike Davis', email: 'mike@company.com', position: 'Manager', department: 'Management', isOnline: true },
      { id: '4', name: 'Lisa Chen', email: 'lisa@company.com', position: 'Analyst', department: 'Analytics', isOnline: false, lastSeen: new Date(Date.now() - 1800000) },
      { id: '5', name: 'David Wilson', email: 'david@company.com', position: 'Developer', department: 'Engineering', isOnline: true },
    ];

    const mockDirectChats: DirectChat[] = [
      {
        id: 'direct_1',
        participants: [mockEmployees[0]],
        lastMessage: {
          id: 'msg_1',
          senderId: '1',
          senderName: 'John Smith',
          content: 'Hey, are you available for a quick call about the project timeline?',
          type: 'text',
          timestamp: new Date(Date.now() - 120000),
          isRead: false
        },
        unreadCount: 2,
        messages: [
          {
            id: 'msg_1a',
            senderId: '1',
            senderName: 'John Smith',
            content: 'Here is the budget report for Q4',
            type: 'file',
            timestamp: new Date(Date.now() - 240000),
            isRead: true,
            fileName: 'Budget_Report_Q4.xlsx',
            topics: ['budget', 'quarterly report', 'finance']
          }
        ]
      },
      {
        id: 'direct_2',
        participants: [mockEmployees[1]],
        lastMessage: {
          id: 'msg_2',
          senderId: '2',
          senderName: 'Sarah Johnson',
          content: 'The UI design mockups are ready for review',
          type: 'text',
          timestamp: new Date(Date.now() - 180000),
          isRead: false
        },
        unreadCount: 1,
        messages: [
          {
            id: 'msg_2a',
            senderId: '2',
            senderName: 'Sarah Johnson',
            content: 'Updated design system documentation',
            type: 'file',
            timestamp: new Date(Date.now() - 360000),
            isRead: true,
            fileName: 'Design_System_v2.pdf',
            topics: ['design', 'documentation', 'UI/UX']
          }
        ]
      }
    ];

    const mockGroups: ChatGroup[] = [
      {
        id: 'group_1',
        name: 'Engineering Team',
        description: 'Main engineering discussion group',
        members: [mockEmployees[0], mockEmployees[4], mockEmployees[2]],
        admins: ['1', '2'],
        createdBy: '1',
        createdAt: new Date(Date.now() - 86400000),
        lastMessage: {
          id: 'msg_2',
          senderId: '4',
          senderName: 'David Wilson',
          content: 'Sprint planning meeting at 3 PM',
          type: 'text',
          timestamp: new Date(Date.now() - 30000),
          isRead: false
        },
        unreadCount: 5,
        messages: [
          {
            id: 'msg_eng_1',
            senderId: '1',
            senderName: 'John Smith',
            content: 'API documentation for the new endpoints',
            type: 'file',
            timestamp: new Date(Date.now() - 3600000),
            isRead: true,
            fileName: 'API_Documentation.md',
            topics: ['API', 'documentation', 'endpoints', 'development']
          },
          {
            id: 'msg_eng_2',
            senderId: '4',
            senderName: 'David Wilson',
            content: 'Code review checklist updated with security guidelines',
            type: 'text',
            timestamp: new Date(Date.now() - 7200000),
            isRead: true,
            topics: ['code review', 'security', 'guidelines', 'development']
          }
        ]
      },
      {
        id: 'group_2',
        name: 'Design Team',
        description: 'Creative collaboration space',
        members: [mockEmployees[1], mockEmployees[3]],
        admins: ['2'],
        createdBy: '2',
        createdAt: new Date(Date.now() - 172800000),
        lastMessage: {
          id: 'msg_3',
          senderId: '2',
          senderName: 'Sarah Johnson',
          content: 'New brand guidelines are ready',
          type: 'text',
          timestamp: new Date(Date.now() - 60000),
          isRead: false
        },
        unreadCount: 3,
        messages: [
          {
            id: 'msg_des_1',
            senderId: '2',
            senderName: 'Sarah Johnson',
            content: 'Brand guidelines v3.0',
            type: 'file',
            timestamp: new Date(Date.now() - 120000),
            isRead: true,
            fileName: 'Brand_Guidelines_v3.pdf',
            topics: ['branding', 'guidelines', 'design system', 'visual identity']
          }
        ]
      }
    ];

    setEmployees(mockEmployees);
    setDirectChats(mockDirectChats);
    setGroups(mockGroups);
  }, []);

  // Event Listeners
  useEffect(() => {
    const handleOpenChat = () => {
      setIsExpanded(true);
      setIsMinimized(false);
    };
    window.addEventListener('openFloatingChat', handleOpenChat);
    return () => window.removeEventListener('openFloatingChat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, resizeStartPos, resizeStartSize, resizeHandle]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('floatingChatPosition', JSON.stringify(position));
    localStorage.setItem('floatingChatSize', JSON.stringify(chatSize));
  }, [position, chatSize]);

  useEffect(() => {
    const savedPosition = localStorage.getItem('floatingChatPosition');
    const savedSize = localStorage.getItem('floatingChatSize');

    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        const isMobile = window.innerWidth < 768;
        const minY = isMobile ? 100 : 8;
        const validX = Math.max(8, Math.min(parsed.x, window.innerWidth - 320 - 8));
        const validY = Math.max(minY, Math.min(parsed.y, window.innerHeight - 100 - 8));
        setPosition({ x: validX, y: validY });
      } catch (error) {
        console.error('Error parsing saved chat position:', error);
      }
    }

    if (savedSize) {
      try {
        const parsed = JSON.parse(savedSize);
        const validWidth = Math.max(320, Math.min(parsed.width, window.innerWidth - 100));
        const validHeight = Math.max(400, Math.min(parsed.height, window.innerHeight - 100));
        setChatSize({ width: validWidth, height: validHeight });
      } catch (error) {
        console.error('Error parsing saved chat size:', error);
      }
    }
  }, []);

  // Handlers
  const toggleChat = () => {
    if (isMinimized) setIsMinimized(false);
    setIsExpanded(!isExpanded);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isExpanded) setIsExpanded(false);
  };

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setIsExpanded(true);
      setIsMinimized(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsExpanded(false);
      setIsMinimized(false);
      setIsFullScreen(false);
    }
  };

  const startDirectChat = (employee: Employee) => {
    let chat = directChats.find(dc =>
      dc.participants.some(p => p.id === employee.id)
    );

    if (!chat) {
      chat = {
        id: `direct_${Date.now()}`,
        participants: [employee],
        unreadCount: 0
      };
      setDirectChats([...directChats, chat]);
    }

    setActiveChat({
      id: chat.id,
      type: 'direct',
      data: chat,
      messages: chat.messages || []
    });
    setCurrentView('chat');
  };

  const createGroup = (name: string, memberIds: string[]) => {
    if (!name.trim() || memberIds.length === 0) return;

    const groupMembers = employees.filter(emp => memberIds.includes(emp.id));
    const newGroup: ChatGroup = {
      id: `group_${Date.now()}`,
      name: name,
      description: '',
      members: groupMembers,
      admins: [currentUser?.id || ''],
      createdBy: currentUser?.id || '',
      createdAt: new Date(),
      unreadCount: 0
    };

    setGroups([...groups, newGroup]);
    setShowNewGroupDialog(false);
  };

  const sendMessage = (content: string) => {
    if (!activeChat || !content.trim()) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || '',
      senderName: currentUser?.name || '',
      content,
      type: 'text',
      timestamp: new Date(),
      isRead: false
    };

    // Update local state for immediate feedback
    const updatedMessages = [...(activeChat.messages || []), message];
    setActiveChat({
      ...activeChat,
      messages: updatedMessages
    });

    // Update the actual chat data
    if (activeChat.type === 'direct') {
      setDirectChats(prev => prev.map(chat =>
        chat.id === activeChat.id
          ? { ...chat, messages: [...(chat.messages || []), message], lastMessage: message }
          : chat
      ));
    } else {
      setGroups(prev => prev.map(group =>
        group.id === activeChat.id
          ? { ...group, messages: [...(group.messages || []), message], lastMessage: message }
          : group
      ));
    }

    setMessageInput('');
  };

  // Resize Logic
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeStartSize({ ...chatSize });
    document.body.style.userSelect = 'none';
    document.body.style.cursor = getCursorForHandle(handle);
  };

  const getCursorForHandle = (handle: string) => {
    switch (handle) {
      case 'nw': return 'nw-resize';
      case 'ne': return 'ne-resize';
      case 'sw': return 'sw-resize';
      case 'se': return 'se-resize';
      case 'n': return 'n-resize';
      case 's': return 's-resize';
      case 'w': return 'w-resize';
      case 'e': return 'e-resize';
      default: return 'auto';
    }
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || isFullScreen) return;

    const deltaX = e.clientX - resizeStartPos.x;
    const deltaY = e.clientY - resizeStartPos.y;
    const minWidth = 320;
    const minHeight = 400;
    const maxWidth = window.innerWidth - 100;
    const maxHeight = window.innerHeight - 100;

    let newWidth = resizeStartSize.width;
    let newHeight = resizeStartSize.height;

    switch (resizeHandle) {
      case 'se': newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width + deltaX)); newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height + deltaY)); break;
      case 'sw': newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width - deltaX)); newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height + deltaY)); break;
      case 'ne': newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width + deltaX)); newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height - deltaY)); break;
      case 'nw': newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width - deltaX)); newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height - deltaY)); break;
      case 'e': newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width + deltaX)); break;
      case 'w': newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width - deltaX)); break;
      case 's': newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height + deltaY)); break;
      case 'n': newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height - deltaY)); break;
    }

    setChatSize({ width: newWidth, height: newHeight });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeHandle('');
    document.body.style.userSelect = '';
    document.body.style.cursor = 'auto';
  };

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (chatRef.current) {
      const rect = chatRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      document.body.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && chatRef.current && !isFullScreen) {
      const chatWidth = chatRef.current.offsetWidth;
      const chatHeight = chatRef.current.offsetHeight;

      const newX = window.innerWidth - (e.clientX - dragOffset.x + chatWidth);
      const newY = window.innerHeight - (e.clientY - dragOffset.y + chatHeight);

      const isMobile = window.innerWidth < 768;
      const minDistance = isMobile ? 100 : 8;
      const constrainedX = Math.max(8, Math.min(newX, window.innerWidth - chatWidth - 8));
      const constrainedY = Math.max(minDistance, Math.min(newY, window.innerHeight - chatHeight - 8));

      setPosition({ x: constrainedX, y: constrainedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  // Search Logic
  const performAdvancedSearch = (searchQuery: string, filters: typeof searchFilters) => {
    const query = searchQuery.toLowerCase();
    const textMatches = (text: string) => text.toLowerCase().includes(query);

    const filteredDirectChats = directChats.filter(chat => {
      const participant = chat.participants[0];
      const basicMatch = !query || textMatches(participant.name) || (chat.lastMessage && textMatches(chat.lastMessage.content));
      return basicMatch;
    });

    const filteredGroups = groups.filter(group => {
      const basicMatch = !query || textMatches(group.name) || (group.lastMessage && textMatches(group.lastMessage.content));
      return basicMatch;
    });

    return { filteredDirectChats, filteredGroups };
  };

  const { filteredDirectChats, filteredGroups } = performAdvancedSearch(searchTerm, searchFilters);

  return (
    <div
      ref={chatRef}
      className={`fixed z-50 transition-all duration-200 ${isFullScreen ? 'inset-0' : ''
        }`}
      style={isFullScreen ? {} : {
        right: `${position.x}px`,
        bottom: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'auto'
      }}
    >
      {/* Toggle Button */}
      <div className="relative">
        <button
          onClick={toggleChat}
          className={`relative w-14 h-14 rounded-full bg-[#0095FF] hover:bg-[#0080E6] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${isMinimized ? 'opacity-50 scale-90' : ''
            }`}
          aria-label="Toggle chat"
        >
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.687" />
          </svg>
        </button>

        <button
          onClick={handleMinimize}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center shadow-md transition-all duration-200"
          aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
        >
          {isMinimized ? <Maximize2 className="w-3 h-3 text-white" /> : <Minimize2 className="w-3 h-3 text-white" />}
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`${isFullScreen
          ? 'fixed inset-0 w-full h-full transition-all duration-300 ease-in-out opacity-100 scale-100'
          : `absolute bottom-20 right-0 transition-all duration-300 ease-in-out ${isExpanded && !isMinimized ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`
          }`}
      >
        <div
          className={`bg-white shadow-xl border overflow-hidden relative flex flex-col ${isFullScreen ? 'w-full h-full rounded-none' : 'rounded-lg'
            }`}
          style={!isFullScreen ? {
            width: `${chatSize.width}px`,
            height: `${chatSize.height}px`,
            minWidth: '320px',
            minHeight: '400px',
            maxWidth: '90vw',
            maxHeight: '90vh'
          } : {}}
        >
          {/* Resize Handles */}
          {!isFullScreen && isExpanded && !isMinimized && (
            <>
              <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-10 hover:bg-blue-200 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
              <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-10 hover:bg-blue-200 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
              <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-10 hover:bg-blue-200 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
              <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-10 hover:bg-blue-200 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'se')} />
              <div className="absolute top-0 left-3 right-3 h-1 cursor-n-resize hover:bg-blue-200 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'n')} />
              <div className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize hover:bg-blue-200 transition-colors" onMouseDown={(e) => handleResizeStart(e, 's')} />
              <div className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize hover:bg-blue-200 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'w')} />
              <div className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize hover:bg-blue-200 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'e')} />
            </>
          )}

          <ChatHeader
            currentView={currentView}
            activeChat={activeChat}
            isFullScreen={isFullScreen}
            onBack={() => setCurrentView('chatList')}
            onMinimize={handleMinimize}
            onFullScreen={handleFullScreen}
            onClose={handleClose}
            onShowProfile={() => setCurrentView('profile')}
            onAddMembers={() => setShowNewGroupDialog(true)} // Simplified for now
            onScheduleMeeting={() => { }}
            onLeaveGroup={() => { }}
            onDeleteChat={() => { }}
            onMouseDown={!isFullScreen ? handleMouseDown : undefined}
          />

          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
            {currentView === 'chatList' ? (
              <ChatList
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                showAdvancedSearch={showAdvancedSearch}
                onToggleAdvancedSearch={() => setShowAdvancedSearch(!showAdvancedSearch)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                directChats={filteredDirectChats}
                groups={filteredGroups}
                employees={employees}
                onSelectChat={(chat, type) => {
                  setActiveChat({
                    id: chat.id,
                    type,
                    data: chat,
                    messages: chat.messages || []
                  });
                  setCurrentView('chat');
                }}
                onCreateGroup={() => setShowNewGroupDialog(true)}
                onStartDirectChat={startDirectChat}
              />
            ) : (
              <>
                <ChatWindow
                  messages={activeChat?.messages || []}
                  currentUserId={currentUser?.id}
                />
                <MessageInput
                  onSendMessage={sendMessage}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <CreateGroupDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
        employees={employees}
        onCreateGroup={createGroup}
      />
    </div>
  );
};

export default FloatingChat;
