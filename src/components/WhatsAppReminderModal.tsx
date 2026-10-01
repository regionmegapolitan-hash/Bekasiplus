import React, { useState } from 'react';
import { StudentRecord } from '../types/student';
import { formatRupiah } from '../data/studentsData';
import { X, Send, Copy, Check, MessageSquare, Phone } from 'lucide-react';

interface WhatsAppReminderModalProps {
  student: StudentRecord | null;
  onClose: () => void;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  student,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!student) return null;

  // Clean phone number for wa.me format
  const rawPhone = student.hpPembayaran || student.noHp || student.hpAyah || student.hpIbu || '';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const waNumber = cleanPhone.startsWith('0') 
    ? '62' + cleanPhone.slice(1) 
    : cleanPhone.startsWith('62') 
      ? cleanPhone 
      : cleanPhone ? '62' + cleanPhone : '';

  const parentGreeting = student.namaAyah ? `Bpk. ${student.namaAyah}` : student.namaIbu ? `Ibu ${student.namaIbu}` : `Bpk/Ibu Orang Tua/Wali`;

  const reminderMessage = `Yth. ${parentGreeting} dari ananda *${student.namaSiswa}* (${student.jenjang}),

Semoga Bpk/Ibu senantiasa dalam keadaan sehat dan lancar dalam segala aktivitas.

Kami dari Administrasi Bimbingan Belajar Nurul Fikri (Cabang ${student.lb}) bermaksud menginformasikan status administrasi bimbingan belajar:

📌 *Data Siswa:*
• Nama: ${student.namaSiswa}
• No. NF: ${student.noNf || '-'}
• Paket: ${student.paket || '-'}
• Sekolah: ${student.asalSekolah || '-'}

💳 *Rincian Administrasi:*
• Total Biaya: ${formatRupiah(student.totalBiaya)}
• Telah Dibayar: ${formatRupiah(student.totalBayar)}
• *Sisa Tunggakan: ${formatRupiah(student.tunggakan)}*

Mohon konfirmasi pembayaran dapat diselesaikan melalui transfer atau kasir cabang kami sebelum batas waktu angsuran berikutnya.

Terima kasih atas kerja sama dan kepercayaan Bpk/Ibu.
_Salam hangat, Tim Administrasi Nurul Fikri_`;

  const copyMessage = () => {
    navigator.clipboard.writeText(reminderMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    const encoded = encodeURIComponent(reminderMessage);
    const url = waNumber 
      ? `https://wa.me/${waNumber}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Kirim Pengingat Tagihan WhatsApp</h3>
              <p className="text-[11px] text-emerald-100">{student.namaSiswa} • Sisa: {formatRupiah(student.tunggakan)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Tujuan No WA:
            </span>
            <span className="font-mono font-bold text-slate-800">
              {rawPhone || 'Belum ada nomor'}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <label className="font-semibold text-slate-700">Format Pesan WhatsApp:</label>
              <button
                onClick={copyMessage}
                className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={9}
              value={reminderMessage}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-sans text-slate-800 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Batal
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={copyMessage}
              className="px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Salin Teks</span>
            </button>
            <button
              onClick={openWhatsApp}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Buka di WhatsApp Web / App</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
