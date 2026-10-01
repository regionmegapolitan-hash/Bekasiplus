const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'raw.csv');
const rawText = fs.readFileSync(csvPath, 'utf8');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

const lines = rawText.split('\n').filter(l => l.trim().length > 0);
if (lines.length < 2) {
  console.error("No data found");
  process.exit(1);
}

const headers = parseCSVLine(lines[0]);

const students = [];

for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  if (row.length < 10) continue;

  const no = parseInt(row[0]) || i;
  const tglDaftar = row[1] || '';
  const caraDaftar = row[2] || 'Offline';
  const lb = row[3] || '';
  const aktif = parseInt(row[4]) ?? 1;
  const jenjang = row[5] || '';
  const kelas = row[6] || '';
  const createdAt = row[7] || '';
  const ta = row[8] || '2627';
  const paket = row[9] || '';
  const formulir = row[10] || '';
  const kwitansi = row[11] || '';
  const noNf = row[12] || '';
  const namaSiswa = row[13] || '';
  const noHp = row[14] || '';
  const hpPembayaran = row[15] || '';
  const email = row[16] || '';
  const jenisKelamin = row[17] || '';
  const agama = row[18] || '';
  const tempatLahir = row[19] || '';
  const tglLahir = row[20] || '';
  const namaAyah = row[21] || '';
  const hpAyah = row[22] || '';
  const emailAyah = row[23] || '';
  const pekerjaanAyah = row[24] || '';
  const alumniNf = row[25] || '';
  const namaIbu = row[26] || '';
  const hpIbu = row[27] || '';
  const emailIbu = row[28] || '';
  const pekerjaanIbu = row[29] || '';
  const idNamaKelas = row[30] || '';
  const namaKelas = row[31] || '';
  const npsn = row[32] || '';
  const asalSekolah = row[33] || '';
  const provTinggal = row[34] || '';
  const kabKotaTinggal = row[35] || '';
  const kecTinggal = row[36] || '';
  const kelTinggal = row[37] || '';
  const kodeDiskonKhusus = row[38] || '';
  const besarDiskonKhusus = parseFloat(row[39]) || 0;
  const biayaFormulir = parseFloat(row[40]) || 0;
  const biayaPaket = parseFloat(row[41]) || 0;
  const biayaDiskon = parseFloat(row[42]) || 0;
  const totalBiaya = parseFloat(row[43]) || 0;
  const totalBayar = parseFloat(row[44]) || 0;
  const tagihanRaw = parseFloat(row[45]) || 0;

  // tagihan is usually negative in this CSV indicating unpaid balance, e.g. -10140000.
  // Tunggakan = totalBiaya - totalBayar (if > 0)
  const tunggakan = Math.max(0, totalBiaya - totalBayar);
  const statusPembayaran = totalBiaya > 0 && totalBayar >= totalBiaya ? 'Lunas' : (totalBayar === 0 ? 'Belum Bayar' : 'Belum Lunas');

  const noNfic = row[46] || '';
  const catatan = row[47] || '';
  const infoNfDari = row[48] || '';
  const alasanMasukNf = row[49] || '';

  students.push({
    id: `STU-${no.toString().padStart(4, '0')}`,
    no,
    tglDaftar,
    caraDaftar,
    lb,
    aktif,
    jenjang,
    kelas,
    createdAt,
    ta,
    paket,
    formulir,
    kwitansi,
    noNf,
    namaSiswa,
    noHp,
    hpPembayaran,
    email,
    jenisKelamin,
    agama,
    tempatLahir,
    tglLahir,
    namaAyah,
    hpAyah,
    emailAyah,
    pekerjaanAyah,
    alumniNf,
    namaIbu,
    hpIbu,
    emailIbu,
    pekerjaanIbu,
    idNamaKelas,
    namaKelas,
    npsn,
    asalSekolah,
    provTinggal,
    kabKotaTinggal,
    kecTinggal,
    kelTinggal,
    kodeDiskonKhusus,
    besarDiskonKhusus,
    biayaFormulir,
    biayaPaket,
    biayaDiskon,
    totalBiaya,
    totalBayar,
    tagihan: tagihanRaw,
    tunggakan,
    statusPembayaran,
    noNfic,
    catatan,
    infoNfDari,
    alasanMasukNf,
  });
}

const outDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'students.json'), JSON.stringify(students, null, 2), 'utf8');

const srcDataDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(srcDataDir)) {
  fs.mkdirSync(srcDataDir, { recursive: true });
}

const tsContent = `// Auto-generated student dataset
export interface StudentRecord {
  id: string;
  no: number;
  tglDaftar: string;
  caraDaftar: string;
  lb: string;
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

export const DEFAULT_STUDENTS: StudentRecord[] = ${JSON.stringify(students, null, 2)};
`;

fs.writeFileSync(path.join(srcDataDir, 'defaultStudents.ts'), tsContent, 'utf8');
console.log('Successfully generated JSON and TS for', students.length, 'students');
