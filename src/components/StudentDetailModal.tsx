import React from 'react';
import { StudentRecord } from '../types/student';
import { formatRupiah } from '../data/studentsData';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  GraduationCap, 
  Calendar, 
  Receipt, 
  Tag, 
  Send,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

interface StudentDetailModalProps {
  student: StudentRecord | null;
  onClose: () => void;
  onSendWhatsApp: (student: StudentRecord) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onSendWhatsApp
}) => {
  if (!student) return null;

  const isLunas = student.statusPembayaran === 'Lunas';
  const hasTunggakan = student.tunggakan > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{student.namaSiswa}</h3>
              <p className="text-xs text-slate-400">
                No NF: <span className="font-mono text-emerald-400">{student.noNf || '-'}</span> • Cabang {student.lb}
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

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isLunas 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-3">
              {isLunas ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Status: {student.statusPembayaran}
                </p>
                <p className="text-sm font-bold mt-0.5">
                  {isLunas 
                    ? 'Pembayaran telah lunas 100%' 
                    : `Sisa Tunggakan: ${formatRupiah(student.tunggakan)}`
                  }
                </p>
              </div>
            </div>

            {hasTunggakan && (
              <button
                onClick={() => onSendWhatsApp(student)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim WA</span>
              </button>
            )}
          </div>

          {/* Section: Ringkasan Biaya & Pembayaran */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-slate-500" />
              Rincian Keuangan & Tagihan
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Biaya Paket</span>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">{formatRupiah(student.biayaPaket)}</p>
              </div>
              <div>
                <span className="text-slate-500">Biaya Formulir</span>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">{formatRupiah(student.biayaFormulir)}</p>
              </div>
              <div>
                <span className="text-slate-500">Potongan Diskon</span>
                <p className="font-semibold text-amber-600 text-sm mt-0.5">
                  {student.biayaDiskon > 0 ? `-${formatRupiah(student.biayaDiskon)}` : 'Rp 0'}
                </p>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <span className="text-slate-500">Total Biaya Final</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{formatRupiah(student.totalBiaya)}</p>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <span className="text-slate-500">Total Telah Dibayar</span>
                <p className="font-bold text-emerald-600 text-sm mt-0.5">{formatRupiah(student.totalBayar)}</p>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-bold text-rose-600">Sisa Tunggakan</span>
                <p className="font-black text-rose-600 text-sm mt-0.5">{formatRupiah(student.tunggakan)}</p>
              </div>
            </div>
          </div>

          {/* Section: Data Akademik & Sekolah */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              Informasi Bimbingan & Sekolah
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">Jenjang & Kelas:</span>
                <span className="font-semibold text-slate-800">{student.jenjang} (Kelas {student.kelas})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">Paket Bimbel:</span>
                <span className="font-mono font-semibold text-slate-800">{student.paket || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">Asal Sekolah:</span>
                <span className="font-semibold text-slate-800">{student.asalSekolah || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">NPSN:</span>
                <span className="font-mono text-slate-800">{student.npsn || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">No Kwitansi:</span>
                <span className="font-mono text-slate-800">{student.kwitansi || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">No Formulir:</span>
                <span className="font-mono text-slate-800">{student.formulir || '-'}</span>
              </div>
            </div>
          </div>

          {/* Section: Kontak & Data Pribadi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-500" />
              Kontak Siswa & Orang Tua
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">No. HP Siswa:</span>
                <span className="font-mono font-semibold text-slate-800">{student.noHp || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">No. HP Pembayaran:</span>
                <span className="font-mono font-semibold text-slate-800">{student.hpPembayaran || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">Email Siswa:</span>
                <span className="text-slate-800">{student.email || '-'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">Jenis Kelamin / Agama:</span>
                <span className="text-slate-800">{student.jenisKelamin} • {student.agama}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">Nama Ayah / HP:</span>
                <span className="font-semibold text-slate-800">
                  {student.namaAyah || '-'} {student.hpAyah ? `(${student.hpAyah})` : ''}
                </span>
                {student.pekerjaanAyah && (
                  <span className="text-[11px] text-slate-500 block">Pekerjaan: {student.pekerjaanAyah}</span>
                )}
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block">Nama Ibu / HP:</span>
                <span className="font-semibold text-slate-800">
                  {student.namaIbu || '-'} {student.hpIbu ? `(${student.hpIbu})` : ''}
                </span>
                {student.pekerjaanIbu && (
                  <span className="text-[11px] text-slate-500 block">Pekerjaan: {student.pekerjaanIbu}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section: Catatan & Keterangan Tambahan */}
          {(student.catatan || student.alasanMasukNf || student.infoNfDari) && (
            <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60 text-xs">
              <h5 className="font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-700" />
                Catatan & Informasi Pendaftaran
              </h5>
              {student.catatan && (
                <p className="text-amber-800 mb-1">
                  <span className="font-semibold">Catatan:</span> {student.catatan}
                </p>
              )}
              {student.alasanMasukNf && (
                <p className="text-amber-800 mb-1">
                  <span className="font-semibold">Alasan Masuk NF:</span> {student.alasanMasukNf}
                </p>
              )}
              {student.infoNfDari && (
                <p className="text-amber-800">
                  <span className="font-semibold">Sumber Info:</span> {student.infoNfDari}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">ID: {student.id}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              Tutup
            </button>
            {hasTunggakan && (
              <button
                onClick={() => {
                  onClose();
                  onSendWhatsApp(student);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Follow-Up WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
