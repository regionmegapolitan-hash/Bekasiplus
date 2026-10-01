export interface StudentRecord {
  id: string;
  no: number;
  tglDaftar: string;
  caraDaftar: string;
  lb: string; // Kode Cabang
  aktif: number;
  jenjang: string;
  kelas: string;
  createdAt: string;
  ta: string;
  paket: string;
  formulir: string;
  kwitansi: string;
  noNf: string;
  namaSiswa: string;
  noHp: string;
  hpPembayaran: string;
  email: string;
  jenisKelamin: string;
  agama: string;
  tempatLahir: string;
  tglLahir: string;
  namaAyah: string;
  hpAyah: string;
  emailAyah: string;
  pekerjaanAyah: string;
  alumniNf: string;
  namaIbu: string;
  hpIbu: string;
  emailIbu: string;
  pekerjaanIbu: string;
  idNamaKelas: string;
  namaKelas: string;
  npsn: string;
  asalSekolah: string;
  provTinggal: string;
  kabKotaTinggal: string;
  kecTinggal: string;
  kelTinggal: string;
  kodeDiskonKhusus: string;
  besarDiskonKhusus: number;
  biayaFormulir: number;
  biayaPaket: number;
  biayaDiskon: number;
  totalBiaya: number;
  totalBayar: number;
  tagihan: number;
  tunggakan: number;
  statusPembayaran: 'Lunas' | 'Belum Lunas' | 'Belum Bayar';
  noNfic: string;
  catatan: string;
  infoNfDari: string;
  alasanMasukNf: string;
}

export interface DashboardSummary {
  totalSiswa: number;
  totalLunas: number;
  totalBelumLunas: number;
  totalBelumBayar: number;
  totalBiaya: number;
  totalBayar: number;
  totalTunggakan: number;
  persenPelunasan: number;
}
