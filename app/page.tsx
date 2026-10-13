'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import StartupLoader from '@/components/StartupLoader';
import TopHeader from '@/components/TopHeader';
import JobFeed from '@/components/JobFeed';
import AllWorksSection from '@/components/AllWorksSection';
import SavedJobsSection from '@/components/SavedJobsSection';
import ProfileDrawer from '@/components/ProfileDrawer';
import SettingsDrawer from '@/components/SettingsDrawer';
import DealerFloatingButton from '@/components/DealerFloatingButton';
import Toast from '@/components/Toast';

// Modals
import ShiftDetailsModal from '@/components/modals/ShiftDetailsModal';
import PostWorkModal from '@/components/modals/PostWorkModal';
import ManageApplicantsModal from '@/components/modals/ManageApplicantsModal';
import FilterModal from '@/components/modals/FilterModal';
import ProfileSetupModal from '@/components/modals/ProfileSetupModal';
import SupportModal from '@/components/modals/SupportModal';
import PaymentModal from '@/components/modals/PaymentModal';
import CameraModal from '@/components/modals/CameraModal';
import LoginModal from '@/components/modals/LoginModal';
import LocationTrackerModal from '@/components/modals/LocationTrackerModal';
import LegalModal from '@/components/modals/LegalModal';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import PickersModals from '@/components/modals/PickersModals';
import NotificationPreferencesModal from '@/components/modals/NotificationPreferencesModal';
import ChatModal from '@/components/modals/ChatModal';

export default function Home() {
  const { activeSection } = useApp();

  return (
    <>
      <StartupLoader />
      <TopHeader />

      <div className="app-container">
        <main className="main-content">
          {activeSection === 'home' && <JobFeed />}
          {activeSection === 'other' && <AllWorksSection />}
          {activeSection === 'saved' && <SavedJobsSection />}
        </main>
      </div>

      <ProfileDrawer />
      <SettingsDrawer />
      <DealerFloatingButton />
      <Toast />

      {/* Application Modals */}
      <ShiftDetailsModal />
      <PostWorkModal />
      <ManageApplicantsModal />
      <FilterModal />
      <ProfileSetupModal />
      <SupportModal />
      <PaymentModal />
      <CameraModal />
      <LoginModal />
      <LocationTrackerModal />
      <LegalModal />
      <DeleteAccountModal />
      <PickersModals />
      <NotificationPreferencesModal />
      <ChatModal />
    </>
  );
}
