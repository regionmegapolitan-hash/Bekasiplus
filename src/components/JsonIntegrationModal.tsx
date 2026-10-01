import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Link2, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  RefreshCw, 
  FileText, 
  Globe, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { StudentRecord } from '../types/student';

interface JsonIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onUpdateUrl: (url: string) => Promise<boolean>;
  onUploadJson: (data: any) => void;
  students: StudentRecord[];
}

export const JsonIntegrationModal: React.FC<JsonIntegrationModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onUpdateUrl,
  onUploadJson,
  students
}) => {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'url' | 'schema' | 'upload'>('html');

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const ok = await onUpdateUrl(inputUrl);
      if (ok) {
        setTestResult({ success: true, message: 'Berhasil memuat data dari tautan JSON!' });
      } else {
        setTestResult({ success: false, message: 'Gagal memuat data. Pastikan link dapat diakses dan format JSON valid.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: `Error: ${err?.message || 'Gagal memuat URL'}` });
    } finally {
      setTesting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onUploadJson(json);
        setTestResult({ success: true, message: `Berhasil mengimpor file ${file.name}` });
      } catch (err) {
        setTestResult({ success: false, message: 'Format file bukan JSON yang valid!' });
      }
    };
    reader.readAsText(file);
  };

  // Generate pure HTML + JS responsive dashboard snippet for the user
  const targetFetchUrl = inputUrl.startsWith('/') 
    ? `${window.location.origin}${inputUrl}` 
    : inputUrl;

  const htmlIntegrationSnippet = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard Siswa & Tunggakan Dinamis</title>
  <!-- Tailwind CSS via CDN untuk styling modern dan responsif -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans p-4 sm:p-8">

  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Dashboard Siswa & Tunggakan</h1>
        <p class="text-xs text-slate-500 mt-1">Integrasi data dinamis via REST API / JSON Link</p>
      </div>
      <button onclick="fetchStudentData()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow transition flex items-center gap-1.5 w-fit">
        <span>🔄 Segarkan Data</span>
      </button>
    </div>

    <!-- KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs font-semibold text-slate-500 uppercase">Total Siswa</p>
        <h2 id="total-siswa" class="text-2xl font-black text-slate-800 mt-1">0</h2>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs font-semibold text-emerald-600 uppercase">Sudah Lunas</p>
        <h2 id="total-lunas" class="text-2xl font-black text-emerald-600 mt-1">0</h2>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs font-semibold text-rose-600 uppercase">Menunggak</p>
        <h2 id="total-menunggak" class="text-2xl font-black text-rose-600 mt-1">0</h2>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs font-semibold text-rose-600 uppercase">Total Tunggakan</p>
        <h2 id="total-nilai-tunggakan" class="text-xl font-black text-rose-600 mt-1">Rp 0</h2>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-col sm:flex-row gap-3">
      <input 
        id="search-input" 
        type="text" 
        placeholder="Cari siswa atau sekolah..." 
        oninput="renderTable()"
        class="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <select id="filter-status" onchange="renderTable()" class="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
        <option value="Semua">Semua Status</option>
        <option value="Lunas">Sudah Lunas</option>
        <option value="Belum Lunas">Belum Lunas / Tunggakan</option>
      </select>
    </div>

    <!-- Responsive Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase">
            <tr>
              <th class="p-3">No</th>
              <th class="p-3">Nama Siswa</th>
              <th class="p-3">No HP / Kontak</th>
              <th class="p-3">Sekolah & Cabang</th>
              <th class="p-3 text-right">Total Biaya</th>
              <th class="p-3 text-right">Total Bayar</th>
              <th class="p-3 text-right">Sisa Tunggakan</th>
              <th class="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody id="student-tbody" class="divide-y divide-slate-100">
            <tr><td colspan="8" class="text-center py-8 text-slate-400">Memuat data...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    // URL Link Sumber Data JSON
    const JSON_URL = "${targetFetchUrl}";
    let allStudents = [];

    // Helper Rupiah
    function formatRupiah(num) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
    }

    // Fetch Data dari Link JSON
    async function fetchStudentData() {
      try {
        const res = await fetch(JSON_URL);
        const data = await res.json();
        allStudents = Array.isArray(data) ? data : (data.students || data.data || []);
        updateKPIs();
        renderTable();
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        document.getElementById('student-tbody').innerHTML = '<tr><td colspan="8" class="text-center py-6 text-red-500">Gagal memuat link JSON. Periksa URL atau CORS.</td></tr>';
      }
    }

    function updateKPIs() {
      const total = allStudents.length;
      const lunas = allStudents.filter(s => s.statusPembayaran === 'Lunas' || (s.totalBayar >= s.totalBiaya && s.totalBiaya > 0)).length;
      const menunggak = allStudents.filter(s => s.tunggakan > 0 || (s.totalBiaya - s.totalBayar > 0)).length;
      const totalTunggakan = allStudents.reduce((acc, s) => acc + (s.tunggakan || Math.max(0, s.totalBiaya - s.totalBayar)), 0);

      document.getElementById('total-siswa').innerText = total.toLocaleString('id-ID');
      document.getElementById('total-lunas').innerText = lunas.toLocaleString('id-ID');
      document.getElementById('total-menunggak').innerText = menunggak.toLocaleString('id-ID');
      document.getElementById('total-nilai-tunggakan').innerText = formatRupiah(totalTunggakan);
    }

    function renderTable() {
      const q = (document.getElementById('search-input').value || '').toLowerCase();
      const statusFilter = document.getElementById('filter-status').value;

      const filtered = allStudents.filter(s => {
        const name = (s.namaSiswa || s.nama || '').toLowerCase();
        const school = (s.asalSekolah || s.sekolah || '').toLowerCase();
        const matchesSearch = name.includes(q) || school.includes(q);

        const tunggakan = s.tunggakan || Math.max(0, s.totalBiaya - s.totalBayar);
        const isLunas = s.statusPembayaran === 'Lunas' || tunggakan === 0;

        if (statusFilter === 'Lunas' && !isLunas) return false;
        if (statusFilter === 'Belum Lunas' && tunggakan <= 0) return false;

        return matchesSearch;
      });

      const tbody = document.getElementById('student-tbody');
      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-6 text-slate-400">Tidak ada data ditemukan</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map((s, idx) => {
        const tunggakan = s.tunggakan !== undefined ? s.tunggakan : Math.max(0, s.totalBiaya - s.totalBayar);
        const isLunas = s.statusPembayaran === 'Lunas' || tunggakan === 0;

        return \`
          <tr class="hover:bg-slate-50 transition">
            <td class="p-3 text-slate-400">\${idx + 1}</td>
            <td class="p-3 font-semibold text-slate-900">\${s.namaSiswa || s.nama || '-'}</td>
            <td class="p-3 font-mono text-slate-600">\${s.noHp || s.hpPembayaran || '-'}</td>
            <td class="p-3 text-slate-600">\${s.asalSekolah || '-'} (Cabang \${s.lb || '-'})</td>
            <td class="p-3 text-right font-medium">\${formatRupiah(s.totalBiaya)}</td>
            <td class="p-3 text-right text-emerald-600 font-semibold">\${formatRupiah(s.totalBayar)}</td>
            <td class="p-3 text-right font-bold \${tunggakan > 0 ? 'text-rose-600' : 'text-slate-400'}">
              \${tunggakan > 0 ? formatRupiah(tunggakan) : 'Rp 0'}
            </td>
            <td class="p-3 text-center">
              \${isLunas 
                ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Lunas</span>'
                : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Tunggakan</span>'
              }
            </td>
          </tr>
        \`;
      }).join('');
    }

    // Auto-fetch on page load
    window.addEventListener('DOMContentLoaded', fetchStudentData);
  </script>
</body>
</html>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlIntegrationSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Integrasi Sumber Data & Kode HTML</h3>
              <p className="text-xs text-slate-400">
                Hubungkan link JSON dinamis & gunakan kode HTML responsif
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('html')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'html'
                ? 'border-emerald-600 text-emerald-600 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kode HTML Mandiri</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-emerald-600 text-emerald-600 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Konfigurasi Link JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-emerald-600 text-emerald-600 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Format / Skema JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-emerald-600 text-emerald-600 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File JSON</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: Kode HTML */}
          {activeTab === 'html' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Kode HTML Siap Pakai</p>
                  <p className="mt-0.5 text-emerald-800">
                    Di bawah ini adalah kode HTML lengkap mandiri yang dapat langsung disimpan sebagai file <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">dashboard.html</code> dan dibuka di browser atau dipasang di website apa pun. Data diambil secara dinamis dari link JSON Anda.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2 rounded-t-xl text-xs">
                  <span className="font-mono">dashboard_integrasi.html</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold transition"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Tersalin!' : 'Salin Semua Kode HTML'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-b-xl overflow-x-auto max-h-[380px] leading-relaxed border border-slate-800">
                  {htmlIntegrationSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: Konfigurasi Link JSON */}
          {activeTab === 'url' && (
            <div className="space-y-5 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-slate-700 font-bold mb-1.5">
                  Tautan / Link Endpoint JSON Sumber Data:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://domain.anda/api/siswa.json atau /data/students.json"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleTestAndSave}
                    disabled={testing}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>{testing ? 'Menguji...' : 'Uji & Muat Data'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Default internal endpoint: <code className="text-slate-600 font-bold">/data/students.json</code>. Anda bisa mengganti ke Google Apps Script Web App URL, MockAPI, Firebase, Supabase, dll.
                </p>
              </div>

              {testResult && (
                <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                  testResult.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {testResult.success ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Preset Link Options */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-bold text-slate-800 mb-2">Preset Tautan Data Cepat:</h4>
                <div className="space-y-2">
                  <div 
                    onClick={() => setInputUrl('/data/students.json')}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Endpoint Internal JSON (Default)</p>
                      <p className="text-[11px] font-mono text-slate-400">/data/students.json (Menyajikan seluruh 260+ data siswa)</p>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold">Pilih Preset &rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Skema JSON */}
          {activeTab === 'schema' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Format Data JSON yang Diharapkan:</h4>
                <p className="text-slate-600 mb-3">
                  Aplikasi dapat menerima Array of Objects secara langsung <code className="font-mono bg-white px-1 py-0.5 rounded border">[ ... ]</code> atau Object dengan key <code className="font-mono bg-white px-1 py-0.5 rounded border">data: [ ... ]</code> / <code className="font-mono bg-white px-1 py-0.5 rounded border">students: [ ... ]</code>.
                </p>

                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
{`[
  {
    "no": 1,
    "namaSiswa": "AL IZHA SALWA",
    "noNf": "225-26-10722",
    "noHp": "0831 3639 3794",
    "asalSekolah": "SMAN 1 KLAPANUNGGAL",
    "lb": "225",
    "jenjang": "12 SMA",
    "totalBiaya": 12130000,
    "totalBayar": 1990000,
    "tunggakan": 10140000,
    "statusPembayaran": "Belum Lunas",
    "catatan": "Angsuran 1 + Formulir"
  }
]`}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Upload JSON */}
          {activeTab === 'upload' && (
            <div className="space-y-4 text-xs text-center py-6">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-emerald-500 transition">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-sm mb-1">Unggah Berkas JSON Anda</h4>
                <p className="text-slate-500 mb-4 max-w-sm mx-auto">
                  Pilih file .json dari komputer Anda untuk langsung dimuat ke dashboard.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>Pilih File .JSON</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total Data Aktif: <strong className="text-slate-800">{students.length} siswa</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
