import React from 'react';
import { 
  Database, 
  RefreshCw, 
  Code2, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Link2
} from 'lucide-react';

interface HeaderProps {
  jsonUrl: string;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenIntegrationModal: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  lastUpdated: Date | null;
  studentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  jsonUrl,
  isLoading,
  onRefresh,
  onOpenIntegrationModal,
  onExportCSV,
  onExportJSON,
  lastUpdated,
  studentCount
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-slate-950 font-black text-xl">
              NF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                  Dashboard Keuangan & Siswa
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Dinamis JSON
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monitoring Status Pembayaran, Tunggakan & Integrasi Data Siswa
              </p>
            </div>
          </div>

          {/* Right Action Tools & Source Badge */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Live JSON Source Chip */}
            <button
              onClick={onOpenIntegrationModal}
              title="Klik untuk konfigurasi sumber URL JSON"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition-all hover:border-emerald-500/50"
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-slate-400 text-[11px] max-w-[130px] sm:max-w-[200px] truncate">
                  {jsonUrl}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Link2 className="w-3 h-3" />
                Ubah Link
              </span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Segarkan data dari sumber JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Integration Code HTML Button */}
            <button
              onClick={onOpenIntegrationModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Kode HTML / Integrasi</span>
            </button>

            {/* Export Dropdown / Buttons */}
            <div className="flex items-center rounded-lg border border-slate-700 overflow-hidden bg-slate-800">
              <button
                onClick={onExportCSV}
                title="Ekspor ke CSV"
                className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden lg:inline">CSV</span>
              </button>
              <div className="w-[1px] h-4 bg-slate-700"></div>
              <button
                onClick={onExportJSON}
                title="Unduh format JSON"
                className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1 transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">JSON</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
