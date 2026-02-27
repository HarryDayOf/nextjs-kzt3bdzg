/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { mkC } from '../../lib/types';
import type { CommunityUser, ForumCategory, ForumTopic, ForumReply, ForumNotification, ForumReaction } from '../../lib/types';
import { MOCK_COMMUNITY_USERS, MOCK_FORUM_CATEGORIES, MOCK_FORUM_TOPICS, MOCK_FORUM_REPLIES, MOCK_FORUM_NOTIFICATIONS } from '../../lib/mockData';

interface CommunityCtx {
  currentUser: CommunityUser;
  setCurrentUser: (u: CommunityUser) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  C: ReturnType<typeof mkC>;
  categories: ForumCategory[];
  topics: ForumTopic[];
  setTopics: (fn: (prev: ForumTopic[]) => ForumTopic[]) => void;
  replies: ForumReply[];
  setReplies: (fn: (prev: ForumReply[]) => ForumReply[]) => void;
  notifications: ForumNotification[];
  setNotifications: (fn: (prev: ForumNotification[]) => ForumNotification[]) => void;
  unreadCount: number;
  allUsers: CommunityUser[];
}

const CommunityContext = createContext<CommunityCtx>(null!);
export const useCommunity = () => useContext(CommunityContext);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CommunityUser>(MOCK_COMMUNITY_USERS[0]);
  const [darkMode, setDarkMode] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('dayof-dark') !== '0' : true);
  const [topics, _setTopics] = useState<ForumTopic[]>(MOCK_FORUM_TOPICS);
  const [replies, _setReplies] = useState<ForumReply[]>(MOCK_FORUM_REPLIES);
  const [notifications, _setNotifications] = useState<ForumNotification[]>(MOCK_FORUM_NOTIFICATIONS);

  useEffect(() => { localStorage.setItem('dayof-dark', darkMode ? '1' : '0'); }, [darkMode]);

  const C = mkC(darkMode);
  const unreadCount = useMemo(() => notifications.filter(n => !n.read && n.userId === currentUser.id).length, [notifications, currentUser.id]);

  const setTopics = (fn: (prev: ForumTopic[]) => ForumTopic[]) => _setTopics(fn);
  const setReplies = (fn: (prev: ForumReply[]) => ForumReply[]) => _setReplies(fn);
  const setNotifications = (fn: (prev: ForumNotification[]) => ForumNotification[]) => _setNotifications(fn);

  return (
    <CommunityContext.Provider value={{
      currentUser, setCurrentUser, darkMode, setDarkMode, C,
      categories: MOCK_FORUM_CATEGORIES, topics, setTopics, replies, setReplies,
      notifications, setNotifications, unreadCount, allUsers: MOCK_COMMUNITY_USERS,
    }}>
      {children}
    </CommunityContext.Provider>
  );
}
