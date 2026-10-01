import React, { useState, useMemo } from 'react';
import { StudentRecord } from '../types/student';
import { formatRupiah } from '../data/studentsData';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  Send, 
  Eye,
  Building,
  School,
  FileSpreadsheet
} from 'lucide-react';

interface StudentTableProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onSendWhatsApp: (student: StudentRecord) => void;
  initialStatusFilter?: string;
  initialBranchFilter?: string;
  initialJenjangFilter?: string;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onSelectStudent,
  onSendWhatsApp,
  initialStatusFilter = 'Semua',
  initialBranchFilter = 'Semua',
  initialJenjangFilter = 'Semua'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [branchFilter, setBranchFilter] = useState(initialBranchFilter);
  const [jenjangFilter, setJenjangFilter] = useState(initialJenjangFilter);
  const [caraDaftarFilter, setCaraDaftarFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState<'no' | 'namaSiswa' | 'tglDaftar' | 'totalBiaya' | 'totalBayar' | 'tunggakan'>('no');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Sync if initial props change
  React.useEffect(() => {
    if (initialStatusFilter) setStatusFilter(initialStatusFilter);
  }, [initialStatusFilter]);

  React.useEffect(() => {
    if (initialBranchFilter && initialBranchFilter !== 'Semua') setBranchFilter(initialBranchFilter);
  }, [initialBranchFilter]);

  React.useEffect(() => {
    if (initialJenjangFilter && initialJenjangFilter !== 'Semua') setJenjangFilter(initialJenjangFilter);
  }, [initialJenjangFilter]);

  // Extract unique branches and jenjangs
  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => { if (s.lb) set.add(s.lb); });
    return Array.from(set).sort();
  }, [students]);

  const availableJenjang = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => { if (s.jenjang) set.add(s.jenjang); });
    return Array.from(set).sort();
  }, [students]);

  // Filter & Search
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 1. Status Filter
      if (statusFilter === 'Lunas' && s.statusPembayaran !== 'Lunas') return false;
      if (statusFilter === 'Belum Lunas' && s.tunggakan <= 0) return false;
      if (statusFilter === 'Belum Bayar' && s.totalBayar > 0) return false;

      // 2. Branch Filter
      if (branchFilter !== 'Semua' && s.lb !== branchFilter) return false;

      // 3. Jenjang Filter
      if (jenjangFilter !== 'Semua' && s.jenjang !== jenjangFilter) return false;

      // 4. Cara Daftar
      if (caraDaftarFilter !== 'Semua' && s.caraDaftar !== caraDaftarFilter) return false;

      // 5. Search
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchesName = s.namaSiswa.toLowerCase().includes(q);
        const matchesNf = s.noNf.toLowerCase().includes(q);
        const matchesHp = s.noHp.includes(q) || s.hpPembayaran.includes(q);
        const matchesSchool = s.asalSekolah.toLowerCase().includes(q);
        const matchesKwitansi = s.kwitansi.toLowerCase().includes(q);
        return matchesName || matchesNf || matchesHp || matchesSchool || matchesKwitansi;
      }

      return true;
    });
  }, [students, statusFilter, branchFilter, jenjangFilter, caraDaftarFilter, searchTerm]);

  // Sort
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (sortBy === 'tglDaftar') {
        valA = a.tglDaftar || '';
        valB = b.tglDaftar || '';
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
    });
  }, [filteredStudents, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage, pageSize]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Semua');
    setBranchFilter('Semua');
    setJenjangFilter('Semua');
    setCaraDaftarFilter('Semua');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      
      {/* Top Filter and Navigation Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 space-y-4">
        
        {/* Main Status Segment Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
            {[
              { id: 'Semua', label: 'Semua Siswa', count: students.length },
              { id: 'Belum Lunas', label: 'Tunggakan / Belum Lunas', count: students.filter((s) => s.tunggakan > 0).length },
              { id: 'Lunas', label: 'Sudah Lunas', count: students.filter((s) => s.statusPembayaran === 'Lunas').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  tab.id === 'Belum Lunas' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Result Counter */}
          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-800">{filteredStudents.length}</span> dari {students.length} data siswa
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama, No NF, No HP, sekolah..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Cabang / LB Select */}
          <div>
            <select
              value={branchFilter}
              onChange={(e) => {
                setBranchFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua Cabang (LB)</option>
              {availableBranches.map((b) => (
                <option key={b} value={b}>Cabang {b}</option>
              ))}
            </select>
          </div>

          {/* Jenjang Select */}
          <div>
            <select
              value={jenjangFilter}
              onChange={(e) => {
                setJenjangFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua Jenjang</option>
              {availableJenjang.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* Metode Daftar */}
          <div>
            <select
              value={caraDaftarFilter}
              onChange={(e) => {
                setCaraDaftarFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Metode Daftar</option>
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
            </select>
          </div>

        </div>

        {/* Active Filters Display */}
        {(statusFilter !== 'Semua' || branchFilter !== 'Semua' || jenjangFilter !== 'Semua' || caraDaftarFilter !== 'Semua' || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400">Filter aktif:</span>
            {statusFilter !== 'Semua' && (
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Status: {statusFilter}
              </span>
            )}
            {branchFilter !== 'Semua' && (
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Cabang: {branchFilter}
              </span>
            )}
            {jenjangFilter !== 'Semua' && (
              <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                Jenjang: {jenjangFilter}
              </span>
            )}
            {caraDaftarFilter !== 'Semua' && (
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Metode: {caraDaftarFilter}
              </span>
            )}
            {searchTerm && (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Keyword: "{searchTerm}"
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium ml-auto underline"
            >
              Reset Semua Filter
            </button>
          </div>
        )}

      </div>

      {/* Main Table Responsive Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3 w-12 text-center">No</th>
              <th 
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition"
                onClick={() => handleSort('namaSiswa')}
              >
                <div className="flex items-center gap-1">
                  <span>Nama Siswa</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">Kontak & No NF</th>
              <th className="py-3 px-3">Cabang & Asal Sekolah</th>
              <th className="py-3 px-3">Jenjang / Kelas</th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/60 transition"
                onClick={() => handleSort('totalBiaya')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Biaya</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/60 transition"
                onClick={() => handleSort('totalBayar')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Bayar</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/60 transition"
                onClick={() => handleSort('tunggakan')}
              >
                <div className="flex items-center justify-end gap-1 text-rose-700 font-bold">
                  <span>Sisa Tunggakan</span>
                  <ArrowUpDown className="w-3 h-3 text-rose-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada data siswa yang cocok</p>
                    <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau reset filter</p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition"
                    >
                      Reset Filter
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedStudents.map((s, idx) => {
                const isLunas = s.statusPembayaran === 'Lunas';
                const hasTunggakan = s.tunggakan > 0;

                return (
                  <tr 
                    key={s.id || idx} 
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* No */}
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>

                    {/* Nama Siswa */}
                    <td className="py-3 px-3">
                      <div 
                        onClick={() => onSelectStudent(s)}
                        className="cursor-pointer group"
                      >
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
                          <span>{s.namaSiswa}</span>
                          {s.aktif === 1 ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Aktif"></span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" title="Non-aktif"></span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Daftar: {s.tglDaftar?.split(' ')[0] || s.createdAt || '-'} • {s.caraDaftar}
                        </div>
                      </div>
                    </td>

                    {/* Kontak & No NF */}
                    <td className="py-3 px-3">
                      <div className="font-mono text-slate-700">{s.noNf || '-'}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-2.5 h-2.5 text-slate-400" />
                        <span>{s.noHp || s.hpPembayaran || '-'}</span>
                      </div>
                    </td>

                    {/* Cabang & Sekolah */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>Cabang {s.lb || '-'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]" title={s.asalSekolah}>
                        {s.asalSekolah || '-'}
                      </div>
                    </td>

                    {/* Jenjang / Kelas */}
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {s.jenjang || 'Jenjang'} {s.kelas ? `(${s.kelas})` : ''}
                      </span>
                    </td>

                    {/* Total Biaya */}
                    <td className="py-3 px-3 text-right font-medium text-slate-700">
                      {formatRupiah(s.totalBiaya)}
                    </td>

                    {/* Total Bayar */}
                    <td className="py-3 px-3 text-right font-medium text-emerald-600">
                      {formatRupiah(s.totalBayar)}
                    </td>

                    {/* Sisa Tunggakan */}
                    <td className="py-3 px-3 text-right">
                      {hasTunggakan ? (
                        <div className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded inline-block">
                          {formatRupiah(s.tunggakan)}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">Rp 0</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      {isLunas ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Lunas
                        </span>
                      ) : s.totalBayar === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          Belum Bayar
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Mengangsur
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectStudent(s)}
                          title="Lihat Detail Siswa"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {hasTunggakan && (
                          <button
                            onClick={() => onSendWhatsApp(s)}
                            title="Kirim Pengingat Tagihan via WhatsApp"
                            className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-lg transition border border-emerald-200 hover:border-emerald-600"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span>Baris per halaman:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-slate-300 rounded bg-white font-medium focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-400">
            Halaman {currentPage} dari {totalPages}
          </span>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
          >
            &laquo;
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white flex items-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-3 py-1 font-semibold text-slate-800">
            {currentPage}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white flex items-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="px-2 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
          >
            &raquo;
          </button>
        </div>

      </div>

    </div>
  );
};
