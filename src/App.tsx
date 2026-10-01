import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StudentRecord, DashboardSummary } from './types/student';
import { INITIAL_STUDENTS, normalizeStudentData, formatRupiah } from './data/studentsData';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { OverviewCharts } from './components/OverviewCharts';
import { StudentTable } from './components/StudentTable';
import { StudentDetailModal } from './components/StudentDetailModal';
import { JsonIntegrationModal } from './components/JsonIntegrationModal';
import { WhatsAppReminderModal } from './components/WhatsAppReminderModal';
import { 
  BarChart3, 
  Table as TableIcon, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  FileCode,
  ShieldCheck,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [jsonUrl, setJsonUrl] = useState<string>('/data/students.json');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'all' | 'tunggakan' | 'lunas'>('overview');
  
  // Modals
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [waStudent, setWaStudent] = useState<StudentRecord | null>(null);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState<boolean>(false);

  // Quick table filter states passed from chart clicks
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('Semua');
  const [selectedJenjangFilter, setSelectedJenjangFilter] = useState<string>('Semua');

  // Fetch data from active JSON link
  const loadDataFromUrl = useCallback(async (url: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const rawList = Array.isArray(data) 
        ? data 
        : (data.students || data.data || data.records || []);

      if (!Array.isArray(rawList) || rawList.length === 0) {
        throw new Error("Format JSON harus berupa Array data siswa atau objek dengan key 'data'/'students'.");
      }

      const normalized = rawList.map((item: any, idx: number) => normalizeStudentData(item, idx));
      setStudents(normalized);
      setJsonUrl(url);
      setLastUpdated(new Date());
      return true;
    } catch (err: any) {
      console.warn("Gagal memuat link JSON eksternal, menggunakan data aktif saat ini:", err);
      setError(`Gagal memuat dari ${url}: ${err.message || 'Koneksi gagal atau CORS'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Try to load /data/students.json if available, or stay on INITIAL_STUDENTS
    loadDataFromUrl('/data/students.json').catch(() => {
      // Fallback already in place
    });
  }, [loadDataFromUrl]);

  // Handle uploaded JSON data
  const handleUploadJson = (data: any) => {
    try {
      const rawList = Array.isArray(data) 
        ? data 
        : (data.students || data.data || data.records || []);

      if (!Array.isArray(rawList) || rawList.length === 0) {
        alert("File JSON harus berisi array data siswa.");
        return;
      }

      const normalized = rawList.map((item: any, idx: number) => normalizeStudentData(item, idx));
      setStudents(normalized);
      setJsonUrl('File Upload Lokal (In-Memory)');
      setLastUpdated(new Date());
      setIsIntegrationModalOpen(false);
    } catch (err: any) {
      alert("Format JSON tidak valid: " + err.message);
    }
  };

  // Calculate Dashboard Summary
  const summary: DashboardSummary = useMemo(() => {
    const totalSiswa = students.length;
    let totalLunas = 0;
    let totalBelumLunas = 0;
    let totalBelumBayar = 0;
    let totalBiaya = 0;
    let totalBayar = 0;
    let totalTunggakan = 0;

    students.forEach((s) => {
      totalBiaya += s.totalBiaya || 0;
      totalBayar += s.totalBayar || 0;
      totalTunggakan += s.tunggakan || 0;

      if (s.statusPembayaran === 'Lunas') {
        totalLunas++;
      } else if (s.totalBayar === 0) {
        totalBelumBayar++;
        totalBelumLunas++;
      } else {
        totalBelumLunas++;
      }
    });

    const persenPelunasan = totalBiaya > 0 ? (totalBayar / totalBiaya) * 100 : 0;

    return {
      totalSiswa,
      totalLunas,
      totalBelumLunas,
      totalBelumBayar,
      totalBiaya,
      totalBayar,
      totalTunggakan,
      persenPelunasan
    };
  }, [students]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'No', 'Nama Siswa', 'No NF', 'No HP', 'HP Pembayaran', 'Email', 
      'Cabang (LB)', 'Jenjang', 'Kelas', 'Asal Sekolah', 'Paket', 
      'Biaya Formulir', 'Biaya Paket', 'Biaya Diskon', 'Total Biaya', 
      'Total Bayar', 'Sisa Tunggakan', 'Status Pembayaran', 'Catatan'
    ];

    const rows = students.map((s, idx) => [
      idx + 1,
      `"${(s.namaSiswa || '').replace(/"/g, '""')}"`,
      `"${s.noNf || ''}"`,
      `"${s.noHp || ''}"`,
      `"${s.hpPembayaran || ''}"`,
      `"${s.email || ''}"`,
      `"${s.lb || ''}"`,
      `"${s.jenjang || ''}"`,
      `"${s.kelas || ''}"`,
      `"${(s.asalSekolah || '').replace(/"/g, '""')}"`,
      `"${s.paket || ''}"`,
      s.biayaFormulir,
      s.biayaPaket,
      s.biayaDiskon,
      s.totalBiaya,
      s.totalBayar,
      s.tunggakan,
      s.statusPembayaran,
      `"${(s.catatan || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data_siswa_tunggakan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(students, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `data_siswa_tunggakan_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Handlers for chart clicks to filter table
  const handleBranchChartFilter = (branch: string) => {
    setSelectedBranchFilter(branch);
    setActiveTab('all');
  };

  const handleJenjangChartFilter = (jenjang: string) => {
    setSelectedJenjangFilter(jenjang);
    setActiveTab('all');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Main Header */}
      <Header
        jsonUrl={jsonUrl}
        isLoading={isLoading}
        onRefresh={() => loadDataFromUrl(jsonUrl)}
        onOpenIntegrationModal={() => setIsIntegrationModalOpen(true)}
        onExportCSV={exportToCSV}
        onExportJSON={exportToJSON}
        lastUpdated={lastUpdated}
        studentCount={students.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Connection Notice / Error Bar if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="font-bold text-amber-900 hover:underline ml-4"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Executive Stats Cards */}
        <StatsCards
          summary={summary}
          activeStatusFilter={activeTab === 'tunggakan' ? 'Belum Lunas' : activeTab === 'lunas' ? 'Lunas' : 'Semua'}
          onFilterStatus={(status) => {
            if (status === 'Belum Lunas') setActiveTab('tunggakan');
            else if (status === 'Lunas') setActiveTab('lunas');
            else setActiveTab('all');
          }}
        />

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 mb-6 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Ringkasan & Visualisasi</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'all'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Semua Siswa ({students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tunggakan')}
              className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'tunggakan'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Daftar Siswa Menunggak ({summary.totalBelumLunas})</span>
            </button>

            <button
              onClick={() => setActiveTab('lunas')}
              className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'lunas'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Siswa Sudah Lunas ({summary.totalLunas})</span>
            </button>
          </div>

          <button
            onClick={() => setIsIntegrationModalOpen(true)}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5 py-1 px-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Kode HTML Integrasi</span>
          </button>
        </div>

        {/* Tab 1: Overview and Analytics */}
        {activeTab === 'overview' && (
          <div>
            <OverviewCharts
              students={students}
              onSelectStudent={setSelectedStudent}
              onSendWhatsApp={setWaStudent}
              onFilterBranch={handleBranchChartFilter}
              onFilterJenjang={handleJenjangChartFilter}
            />

            {/* Quick preview of student table below charts */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-800">
                  Data Siswa Terbaru & Sisa Tagihan
                </h3>
                <button
                  onClick={() => setActiveTab('all')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Buka Tampilan Tabel Lengkap &rarr;
                </button>
              </div>

              <StudentTable
                students={students}
                onSelectStudent={setSelectedStudent}
                onSendWhatsApp={setWaStudent}
                initialStatusFilter="Semua"
              />
            </div>
          </div>
        )}

        {/* Tab 2: All Students */}
        {activeTab === 'all' && (
          <StudentTable
            students={students}
            onSelectStudent={setSelectedStudent}
            onSendWhatsApp={setWaStudent}
            initialStatusFilter="Semua"
            initialBranchFilter={selectedBranchFilter}
            initialJenjangFilter={selectedJenjangFilter}
          />
        )}

        {/* Tab 3: Students with Tunggakan */}
        {activeTab === 'tunggakan' && (
          <StudentTable
            students={students}
            onSelectStudent={setSelectedStudent}
            onSendWhatsApp={setWaStudent}
            initialStatusFilter="Belum Lunas"
            initialBranchFilter={selectedBranchFilter}
            initialJenjangFilter={selectedJenjangFilter}
          />
        )}

        {/* Tab 4: Students with Lunas */}
        {activeTab === 'lunas' && (
          <StudentTable
            students={students}
            onSelectStudent={setSelectedStudent}
            onSendWhatsApp={setWaStudent}
            initialStatusFilter="Lunas"
            initialBranchFilter={selectedBranchFilter}
            initialJenjangFilter={selectedJenjangFilter}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Dashboard Siswa & Tunggakan Pembayaran • Integrasi JSON Dinamis</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsIntegrationModalOpen(true)}
              className="text-slate-500 hover:text-slate-800 transition"
            >
              Dokumentasi API & Integrasi HTML
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onSendWhatsApp={setWaStudent}
      />

      <WhatsAppReminderModal
        student={waStudent}
        onClose={() => setWaStudent(null)}
      />

      <JsonIntegrationModal
        isOpen={isIntegrationModalOpen}
        onClose={() => setIsIntegrationModalOpen(false)}
        currentUrl={jsonUrl}
        onUpdateUrl={loadDataFromUrl}
        onUploadJson={handleUploadJson}
        students={students}
      />

    </div>
  );
}
