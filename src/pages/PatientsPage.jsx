import React, { useState, useEffect } from 'react';
import { savePatient, getAllPatients, deletePatient } from '../services/db';
import { Users, UserPlus, Search, QrCode, MapPin, Phone, Calendar } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PatientsPage({ onSelectPatient }) {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientForQR, setSelectedPatientForQR] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Female',
    isPregnant: false,
    village: '',
    phone: '',
    notes: '',
  });

  const loadPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients from IndexedDB:', err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await savePatient(formData);
      setFormData({
        name: '',
        age: '',
        gender: 'Female',
        isPregnant: false,
        village: '',
        phone: '',
        notes: '',
      });
      setShowAddModal(false);
      loadPatients();
    } catch (err) {
      console.error('Error saving patient:', err);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Patient Registry & Health Passports</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {patients.length} Patient Record{patients.length !== 1 ? 's' : ''} Enrolled
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-md transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by patient name or village..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111111] border border-[#242424] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#404040]"
        />
      </div>

      {/* Patient List Grid */}
      {filteredPatients.length === 0 ? (
        <div className="carbon-card p-10 text-center space-y-3 border border-[#242424]">
          <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-zinc-400 mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">No Patient Records</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? 'No patient matches your search filter.'
                : 'Click "Register Patient" to add a new patient profile.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPatient && onSelectPatient(p)}
              className="carbon-card p-4 cursor-pointer group space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {p.name}
                    </h3>
                    {p.isPregnant && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1F1C12] text-amber-400 border border-amber-900/40">
                        Pregnant
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {p.gender}, {p.age} yrs
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatientForQR(p);
                  }}
                  className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-zinc-400 hover:text-white border border-[#2E2E2E] transition-colors"
                  title="View Health Passport QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-[#222222]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {p.village || 'N/A'}
                </span>
                {p.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    {p.phone}
                  </span>
                )}
                <span className="flex items-center gap-1 ml-auto text-[11px] text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                Register New Patient
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunita Devi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="26"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Child">Child</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#181818] p-3 rounded-xl border border-[#262626]">
                <input
                  type="checkbox"
                  id="isPregnant"
                  checked={formData.isPregnant}
                  onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                  className="w-4 h-4 rounded border-[#333333] text-emerald-500 focus:ring-0"
                />
                <label htmlFor="isPregnant" className="text-xs text-zinc-300 cursor-pointer">
                  Patient is currently pregnant
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Village / District</label>
                  <input
                    type="text"
                    placeholder="e.g. Nashik Rural"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-medium text-xs hover:bg-emerald-600"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Health Passport QR Modal */}
      {selectedPatientForQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-[#242424] pb-2">
              <h3 className="font-heading font-bold text-xs text-zinc-400 uppercase tracking-wider">
                Health Passport QR Card
              </h3>
              <button
                onClick={() => setSelectedPatientForQR(null)}
                className="text-zinc-500 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl inline-block shadow-md">
              <QRCodeSVG
                value={JSON.stringify({
                  id: selectedPatientForQR.id,
                  name: selectedPatientForQR.name,
                  age: selectedPatientForQR.age,
                  village: selectedPatientForQR.village,
                  isPregnant: selectedPatientForQR.isPregnant,
                  platform: 'ArogyaSetu Edge',
                })}
                size={170}
              />
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-white">{selectedPatientForQR.name}</h4>
              <p className="text-xs text-zinc-500">ID: {selectedPatientForQR.id}</p>
              <p className="text-xs text-emerald-400 font-medium mt-1">
                Scan at Primary Health Centre for instant clinical history
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
