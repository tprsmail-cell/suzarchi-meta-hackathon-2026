'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRoleId, UserRoleProfile, USER_ROLES } from '@/data/roleData';

export * from '@/data/roleData';

interface RoleContextType {
  activeRole: UserRoleId;
  roleProfile: UserRoleProfile;
  setRole: (roleId: UserRoleId) => void;
  isRoleModalOpen: boolean;
  openRoleModal: () => void;
  closeRoleModal: () => void;
  hasSeenRoleWelcome: boolean;
  completeOnboarding: (roleId?: UserRoleId) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  // In-memory state only (no localStorage, no external storage)
  const [activeRole, setActiveRole] = useState<UserRoleId>('textile_manufacturer');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [hasSeenRoleWelcome, setHasSeenRoleWelcome] = useState<boolean>(false);

  const setRole = (roleId: UserRoleId) => {
    setActiveRole(roleId);
  };

  const completeOnboarding = (roleId?: UserRoleId) => {
    if (roleId) {
      setActiveRole(roleId);
    }
    setHasSeenRoleWelcome(true);
    setIsRoleModalOpen(false);
  };

  const openRoleModal = () => setIsRoleModalOpen(true);
  const closeRoleModal = () => setIsRoleModalOpen(false);

  return (
    <RoleContext.Provider
      value={{
        activeRole,
        roleProfile: USER_ROLES[activeRole],
        setRole,
        isRoleModalOpen,
        openRoleModal,
        closeRoleModal,
        hasSeenRoleWelcome,
        completeOnboarding,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
