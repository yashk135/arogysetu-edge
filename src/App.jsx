import React, { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import OfflineSyncBanner from './components/OfflineSyncBanner';
import Dashboard from './pages/Dashboard';
import PatientsPage from './pages/PatientsPage';
import CameraAIPage from './pages/CameraAIPage';
import VoiceTriagePage from './pages/VoiceTriagePage';
import ReportOCRPage from './pages/ReportOCRPage';
import EmergencyPage from './pages/EmergencyPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Global Offline Sync Banner */}
      <OfflineSyncBanner />

      {/* Top Header */}
      <Header setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'camera' && <CameraAIPage />}
        {activeTab === 'voice' && <VoiceTriagePage />}
        {activeTab === 'ocr' && <ReportOCRPage />}
        {activeTab === 'emergency' && <EmergencyPage setActiveTab={setActiveTab} />}
        {activeTab === 'patients' && (
          <PatientsPage
            onSelectPatient={(p) => {
              setSelectedPatient(p);
              // Can switch tab or view details
            }}
          />
        )}
      </main>

      {/* Bottom Floating Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
