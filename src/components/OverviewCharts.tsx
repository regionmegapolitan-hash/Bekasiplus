import React, { useMemo } from 'react';
import { StudentRecord } from '../types/student';
import { formatRupiah } from '../data/studentsData';
import { 
  Building2, 
  GraduationCap, 
  AlertTriangle, 
  Send, 
  PhoneCall, 
  CheckCircle,
  TrendingDown
} from 'lucide-react';

interface OverviewChartsProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onSendWhatsApp: (student: StudentRecord) => void;
  onFilterBranch: (branch: string) => void;
  onFilterJenjang: (jenjang: string) => void;
}

export const OverviewCharts: React.FC<OverviewChartsProps> = ({
  students,
  onSelectStudent,
  onSendWhatsApp,
  onFilterBranch,
  onFilterJenjang
}) => {
  // 1. Cabang breakdown
  const branchData = useMemo(() => {
    const map: Record<string, { total: number; tunggakan: number; count: number; lunasCount: number }> = {};
    students.forEach((s) => {
      const b = s.lb || 'Lainnya';
      if (!map[b]) {
        map[b] = { total: 0, tunggakan: 0, count: 0, lunasCount: 0 };
      }
      map[b].total += s.totalBiaya;
      map[b].tunggakan += s.tunggakan;
      map[b].count += 1;
      if (s.statusPembayaran === 'Lunas') {
        map[b].lunasCount += 1;
      }
    });

    return Object.entries(map)
      .map(([branch, val]) => ({ branch, ...val }))
      .sort((a, b) => b.tunggakan - a.tunggakan);
  }, [students]);

  // 2. Jenjang breakdown
  const jenjangData = useMemo(() => {
    const map: Record<string, { total: number; tunggakan: number; count: number; lunasCount: number }> = {};
    students.forEach((s) => {
      const j = s.jenjang || 'Lainnya';
      if (!map[j]) {
        map[j] = { total: 0, tunggakan: 0, count: 0, lunasCount: 0 };
      }
      map[j].total += s.totalBiaya;
      map[j].tunggakan += s.tunggakan;
      map[j].count += 1;
      if (s.statusPembayaran === 'Lunas') {
        map[j].lunasCount += 1;
      }
    });

    return Object.entries(map)
      .map(([jenjang, val]) => ({ jenjang, ...val }))
      .sort((a, b) => b.tunggakan - a.tunggakan);
  }, [students]);

  // 3. Top 10 biggest tunggakan
  const topTunggakan = useMemo(() => {
    return [...students]
      .filter((s) => s.tunggakan > 0)
      .sort((a, b) => b.tunggakan - a.tunggakan)
      .slice(0, 10);
  }, [students]);

  const maxBranchTunggakan = useMemo(() => {
    return Math.max(...branchData.map((b) => b.tunggakan), 1);
  }, [branchData]);

  const maxJenjangTunggakan = useMemo(() => {
    return Math.max(...jenjangData.map((j) => j.tunggakan), 1);
  }, [jenjangData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Kolom 1: Tunggakan per Cabang / Unit (LB) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Tunggakan per Cabang (LB)</h4>
                <p className="text-xs text-slate-500">Urutan nominal piutang tertinggi</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {branchData.slice(0, 7).map((item) => {
              const pct = (item.tunggakan / maxBranchTunggakan) * 100;
              return (
                <div 
                  key={item.branch}
                  onClick={() => onFilterBranch(item.branch)}
                  className="group cursor-pointer hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition"
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-700 group-hover:text-indigo-600 flex items-center gap-1.5">
                      <span>Cabang {item.branch}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        {item.count} siswa ({item.lunasCount} lunas)
                      </span>
                    </span>
                    <span className="font-bold text-rose-600">{formatRupiah(item.tunggakan)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-500 group-hover:bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 text-center">
          Klik cabang untuk memfilter tabel siswa di bawah
        </div>
      </div>

      {/* Kolom 2: Analisis per Jenjang Sekolah */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Tunggakan per Jenjang</h4>
                <p className="text-xs text-slate-500">Tingkat kelas / program</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {jenjangData.slice(0, 7).map((item) => {
              const pct = (item.tunggakan / maxJenjangTunggakan) * 100;
              return (
                <div 
                  key={item.jenjang}
                  onClick={() => onFilterJenjang(item.jenjang)}
                  className="group cursor-pointer hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition"
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-700 group-hover:text-teal-600 flex items-center gap-1.5">
                      <span>{item.jenjang}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        {item.count} siswa
                      </span>
                    </span>
                    <span className="font-bold text-rose-600">{formatRupiah(item.tunggakan)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-teal-500 group-hover:bg-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 text-center">
          Klik jenjang untuk memfilter data spesifik
        </div>
      </div>

      {/* Kolom 3: Top 10 Tunggakan Siswa Terbesar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Prioritas Tunggakan Terbesar</h4>
                <p className="text-xs text-slate-500">Siswa dengan sisa tagihan tertinggi</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {topTunggakan.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                Semua siswa telah lunas!
              </div>
            ) : (
              topTunggakan.map((s, idx) => (
                <div 
                  key={s.id} 
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onSelectStudent(s)}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400">#{idx + 1}</span>
                      <p className="text-xs font-bold text-slate-800 truncate hover:text-blue-600">
                        {s.namaSiswa}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {s.jenjang} • Cabang {s.lb} • {s.asalSekolah || 'Sekolah'}
                    </p>
                    <p className="text-xs font-bold text-rose-600 mt-0.5">
                      {formatRupiah(s.tunggakan)}
                    </p>
                  </div>

                  <button
                    onClick={() => onSendWhatsApp(s)}
                    title="Kirim pengingat WhatsApp"
                    className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs flex items-center justify-center transition shrink-0 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Top {topTunggakan.length} Siswa</span>
          <span className="text-rose-600 font-medium">Follow-Up Tertarget</span>
        </div>
      </div>

    </div>
  );
};
