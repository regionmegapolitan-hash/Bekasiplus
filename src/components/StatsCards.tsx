import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Wallet, 
  TrendingUp, 
  CreditCard,
  Percent
} from 'lucide-react';
import { DashboardSummary } from '../types/student';
import { formatRupiah } from '../data/studentsData';

interface StatsCardsProps {
  summary: DashboardSummary;
  onFilterStatus?: (status: string) => void;
  activeStatusFilter?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  summary,
  onFilterStatus,
  activeStatusFilter
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Card 1: Total Siswa */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('Semua')}
        className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
          activeStatusFilter === 'Semua' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Siswa</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{summary.totalSiswa.toLocaleString('id-ID')}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Semua Cabang / Unit</span>
          <span className="font-semibold text-blue-600 hover:underline">Lihat Semua &rarr;</span>
        </div>
      </div>

      {/* Card 2: Siswa Sudah Lunas */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('Lunas')}
        className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
          activeStatusFilter === 'Lunas' ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Sudah Bayar Lunas</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{summary.totalLunas.toLocaleString('id-ID')}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {summary.totalSiswa > 0 ? ((summary.totalLunas / summary.totalSiswa) * 100).toFixed(1) : 0}% dari total siswa
          </span>
          <span className="font-semibold text-emerald-600">Lunas 100%</span>
        </div>
      </div>

      {/* Card 3: Siswa Belum Lunas / Menunggak */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('Belum Lunas')}
        className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
          activeStatusFilter === 'Belum Lunas' ? 'ring-2 ring-rose-500 border-rose-500' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">Siswa Menunggak</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{summary.totalBelumLunas.toLocaleString('id-ID')}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {summary.totalSiswa > 0 ? ((summary.totalBelumLunas / summary.totalSiswa) * 100).toFixed(1) : 0}% siswa perlu follow up
          </span>
          <span className="font-semibold text-rose-600">Prioritas Tagihan</span>
        </div>
      </div>

      {/* Card 4: Total Nilai Tunggakan */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('Belum Lunas')}
        className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-100">Total Nilai Tunggakan</p>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">{formatRupiah(summary.totalTunggakan)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-sm">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-rose-100">
          <span>Piutang Biaya Bimbel</span>
          <span className="font-semibold underline">Detail Tagihan &rarr;</span>
        </div>
      </div>

      {/* Secondary Financial Summary Bar */}
      <div className="sm:col-span-2 lg:col-span-4 bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          <div>
            <p className="text-xs text-slate-400">Total Biaya Pendaftaran & Paket</p>
            <p className="text-lg font-bold text-white mt-0.5">{formatRupiah(summary.totalBiaya)}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Total Pembayaran Masuk (Kas)</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{formatRupiah(summary.totalBayar)}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Sisa Piutang / Tunggakan</p>
            <p className="text-lg font-bold text-rose-400 mt-0.5">{formatRupiah(summary.totalTunggakan)}</p>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Tingkat Pelunasan</span>
              <span className="font-bold text-emerald-400">{summary.persenPelunasan.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, summary.persenPelunasan))}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
