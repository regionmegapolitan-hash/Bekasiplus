const fs = require('fs');
const path = require('path');

// Extract all CSV lines from user prompt and produce full students.json
const rawLines = [
  '1,29-09-2026 20:03:35,Offline,225,1,N,Z,29/09/2026,2627,2627NAB6A11,8256836-225-2,48044211-225,225-26-10722,AL IZHA SALWA,0831 3639 3794,0812 8890 0157,salwaalizha995@gmail.com,Perempuan,ISLAM,BOGOR,2009-06-23,,0  ,,,TIDAK,,0  ,,,2627225A225Z020,0,20276388,SMAN 1 KLAPANUNGGAL,JAWA BARAT,KABUPATEN BOGOR,CILEUNGSI,CILEUNGSI,,0,300000,11830000,0,12130000,1990000,-10140000,,Angsuran 1 + Formulir,BROSUR,"Ingin diterima di PTN favorit (UI, ITB, UGM, dll)"',
  '2,29-09-2026 20:00:31,Offline,225,1,M,L,29/09/2026,2627,2627M120411,2855657-225-2,58483744-225,225-26-10724,FELDA ANSELYA SAPNA,0812 1068 1404,0813 8055 9915,feldaanselyasapna@gmail.com,Perempuan,ISLAM,BOGOR,2019-08-06,,0  ,,,TIDAK,,0  ,,,26272251225L030,0,20200677,SMAS MUHAMMADIYAH CILEUNGSI,JAWA BARAT,KABUPATEN BOGOR,CILEUNGSI,CILEUNGSI,,0,300000,6300000,0,6600000,6600000,0,,LUNAS DISKON 25% (MILAD NF),BROSUR,Ingin meningkatkan nilai akademik',
  '3,29-09-2026 19:19:52,Offline,225,1,H,E,29/09/2026,2627,2627H120411,8969008-225-2,56493207-225,225-26-10723,AZKA SHAFA AQILLA,0851 1756 4493,0813 4145 7525,dwina23@yahoo.com,Perempuan,ISLAM,BOGOR,2015-06-24,,0  ,,,TIDAK,,0  ,,,26272251225E010,225E010,20237445,SD MUHAMMADIYAH 1 CILEUNGSI,JAWA BARAT,KABUPATEN BOGOR,CILEUNGSI,CILEUNGSI,,0,300000,4880000,0,5180000,5180000,0,,Lunas Diskon 25% promo Milad NF,SPANDUK,Ingin masuk ke SMA/SMP unggulan',
  '4,29-09-2026 17:27:38,Offline,223,1,L,J,29/09/2026,2627,2627L120A11,6107549-223-2,24591529-223,223-26-10684,MUSA ABDUS SALAM,0895 2937 0970,0859 2418 7783,arujidono68@gmail.com,Laki-laki,ISLAM,BEKASI,2010-10-30,,0  ,,,TIDAK,,0  ,,,26272231223J010,223J010,20257102,SMAS IT THORIQ BIN ZIYAD,JAWA BARAT,KABUPATEN BEKASI,SETU,TAMAN SARI,,0,300000,8400000,0,8700000,1500000,-7200000,,ANGSURAN 1,TEMAN / KERABAT,Mengikuti teman/keluarga yang juga ikut NF',
  '5,29-09-2026 15:51:07,Online,234,1,H,E,29/09/2026,2627,2627H120411,9424025-234-2,26633825-234,234-26-11187,M. ARFAN ZAHIR KHAIRY,0812 8009 5695,0812 1910 6094,arfan.khairy12@gmail.com,Laki-laki,ISLAM,,,,0  ,,,TIDAK,,0  ,,,26272341234E010,234E010,0,SDIT AL IMAM,,,,,,0,300000,4880000,,5180000,5180000,0,,"Paket Semester 1,2 6 SD TA 2026-2027 Promo Diskon 25% Milad NF 41",LAIN LAIN,Belum Isi',
  '6,29-09-2026 15:04:15,Offline,123,1,L,J,29/09/2026,2627,2627L120A11,3134770-123-2,67209809-123,123-26-11196,AQILA ZHAFIRA ADRIAN,0897 9017 902,0896 2561 5707,qiqizha28@gmail.com,Perempuan,,,2010-12-28,,0  ,,,TIDAK,,0  ,,,26271231123J010,123J010,20223052,SMAS HUTAMA,,,,,,0,300000,8400000,0,8700000,1500000,-7200000,,Angsuran ke 1,TEMAN / KERABAT,Ingin meningkatkan nilai akademik',
  '7,29-09-2026 15:02:37,Offline,223,1,L,J,29/09/2026,2627,2627L120411,3863131-223-2,91944966-223,223-26-10683,NAJLA AFEEFA PUTRI WIJAYANTO,0821 1402 6925,0818 0677 2162,najlaapw@gmail.com,Perempuan,ISLAM,BEKASI,2010-12-03,,0  ,,,TIDAK,,0  ,,,26272231223J010,0,20237992,SMAN 1 SETU,JAWA BARAT,KABUPATEN BEKASI,SETU,LUBANGBUAYA,,0,300000,6300000,0,6600000,6600000,0,,LUNAS DISKON TUNAI,TEMAN / KERABAT,Lokasi bimbel yang strategis dan nyaman',
  '8,29-09-2026 13:09:35,Offline,147,1,J,G,29/09/2026,2627,2627J120411,5756713-147-2,39895764-147,147-26-11134,AQILA PUTRI MEILANA,0812 2275 0859,0812 2275 0859,aqilaputrimeilana01@gmail.com,Perempuan,,,2013-01-03,,0  ,,,TIDAK,,0  ,,,26271471147G010,147G010,20223007,SMP YAPIDH,,,,,,0,300000,6300000,0,6600000,6600000,0,,LUNAS - Aqila Putri Meilana,WHATSAPP,Ingin meningkatkan nilai akademik',
  '9,29-09-2026 00:00:48,Online,122,1,N,Z,29/09/2026,2627,2627NAB6411,1346554-122-2,26788119-122,122-26-11715,RADITYA DAFFA ARDIANSYAH,0813 8993 2940,0081 3899 32940,radityadaffaardiansyah@gmail.com,Laki-laki,ISLAM,,,,0  ,,,TIDAK,,0  ,,,2627122A122Z012,122Z012,20223025,SMAS TULUS BHAKTI,,,,,,0,300000,8870000,,9170000,9170000,0,,"Paket PPLS 1,2 dan SuperIntensif 12 SMA TA 2026-2027 Promo Diskon 25% Milad NF 41",LAIN LAIN,Belum Isi',
  '10,28-09-2026 18:57:10,Offline,122,1,H,E,28/09/2026,2627,2627H120411,6531993-122-2,21638445-122,122-26-11714,DIHYAN KIRANA RAMADHANTY,0877 8502 0702,0812 2750 7887,dihyanrana@gmail.com,Perempuan,,,2015-07-03,,0  ,,,TIDAK,,0  ,,,26271221122E010,122E010,20231569,SDIT YAPIDH,,,,,,0,300000,4880000,0,5180000,5180000,0,,LUNAS DISKON 25%,SPANDUK,Ingin masuk ke SMA/SMP unggulan',
  '11,28-09-2026 17:28:17,Offline,122,1,M,L,28/09/2026,2627,2627M120A11,2882576-122-2,42502331-122,122-26-11713,FAVIAN AKHMAD FAUZI,0811 1211 1313,0811 1200 1888,vianfauzi1105@gmail.com,Laki-laki,ISLAM,BEKASI,2010-05-11,IMAM FAOZI,0811 1200 1888,imamfaozi1105@gmail.com,Karyawan Swasta,TIDAK,NURUL HASANAH,0811 1200 2888,nurulvian1105@gmail.com,Ibu Rumah Tangga,26271221122L010,122L010,20270776,SMAN 2 GUNUNG PUTRI,JAWA BARAT,KOTA BEKASI,JATIASIH,JATILUHUR,,0,300000,8400000,0,8700000,1500000,-7200000,,ANGSURAN KE-1,BROSUR,Ingin meningkatkan nilai akademik',
  '17,28-09-2026 11:30:32,Offline,274,1,K,P,28/09/2026,2627,2627K120A11,3458739-274-2,73496540-274,274-26-12139,SHINTA DANESHAYU NUGROHO,0858 8388 3464,0815 1508 0676,shintadaneshayunugroho@gmail.com,Perempuan,ISLAM,,2012-03-07,,0  ,,,TIDAK,,0  ,,,26272741274P030,274P030,20223002,SMP NEGERI 10 BEKASI,,,,,,0,300000,8400000,0,8700000,1500000,-7200000,,Angsuran 1 dan biaya pendaftaran,WHATSAPP,Lokasi bimbel yang strategis dan nyaman',
  '26,23-09-2026 18:49:00,Offline,119,1,N,Z,23/09/2026,2627,2627NAB6A11,6610777-119-2,29794921-119,119-26-11363,ANNISA SYIFA YULIANTI,0812 8554 2356,0822 6019 7310,annisasyifaayul@gmail.com,Perempuan,,,2009-07-11,,0  ,,,TIDAK,,0  ,,,2627119A119Z010,119Z010,20275048,SMAN 16 BEKASI,,,,,,0,300000,11830000,0,12130000,1990000,-10140000,,Angsuran ke-1,WHATSAPP,Mengikuti teman/keluarga yang juga ikut NF',
  '36,16-09-2026 19:46:07,Offline,147,1,K,P,16/09/2026,2627,2627K120A11,5640567-147-2,17359151-147,147-26-11132,SYAKILA NAISYATUZZALFA,0857 1971 6381,0813 2775 4685,syakilanaisyatuzzalfa@gmail.com,Perempuan,,,2011-10-06,,0  ,,,TIDAK,,0  ,,,26271471147P030,147P030,20279635,MTSS AL FALAH,,,,,,0,300000,8400000,0,8700000,1500000,-7200000,,ANGSURAN 1 - SYAKILA,WHATSAPP,Mengikuti teman/keluarga yang juga ikut NF',
  '46,14-09-2026 11:45:20,Offline,151,1,N,Z,14/09/2026,2627,2627NAB6A11,2537347-151-2,22113128-151,151-26-11200,BAYU RAHMA JATI,0813 1993 7873,0812 1567 1811,bayurahmajati255@gmail.com,Laki-laki,ISLAM,JAKARTA,2008-12-03,MARDIYO,0  ,,Pensiunan,TIDAK,SUKIRAH,0  ,,Ibu rumah tangga,2627151A151Z033,151Z033,20103200,SMAS PUSAKA 1 JAKARTA,DKI JAKARTA,KOTA ADMINISTRASI JAKARTA TIMUR,MAKASAR,CIPINANG MELAYU,,0,200000,11830000,100000,12030000,1890000,-10140000,SP28211,Angsuran ke-1,TEMAN / KERABAT,Ingin meningkatkan nilai akademik',
  '52,11-09-2026 19:27:37,Offline,122,1,N,Z,11/09/2026,2627,2627NAB6A11,9349693-122-2,33090812-122,122-26-11708,ZAHRA ZEAN AYUNI,0813 8357 9279,0813 1500 8778,zzahrazean@gmail.com,Perempuan,,,2009-01-07,,0  ,,,TIDAK,,0  ,,,2627122A122Z012,122Z012,20200681,SMAN 1 CILEUNGSI,,,,,,0,200000,11830000,100000,12030000,1890000,-10140000,IM01888,angsuran ke-1,TEMAN / KERABAT,"Ingin diterima di PTN favorit (UI, ITB, UGM, dll)"',
  '53,11-09-2026 18:30:39,Offline,158,1,F,V,11/09/2026,2627,2627F120A11,2538189-158-2,75630343-158,158-26-11331,JEFFIN DYOKEISH RAMADHAN,0811 1797 239,0811 1797 239,jeffindyokesh14@gmail.com,Perempuan,ISLAM,JAKARTA,2016-06-14,PILIH PRAMUDJO,0811 1797 239,,Karyawan swasta,TIDAK,SRI SARI SETIAWATI,0811 1797 239,sariaetia2810@gmail.com,Ibu Rumah Tangga,26271581158V010,158V010,60706310,MIN 16 CIPAYUNG,DKI JAKARTA,KOTA ADMINISTRASI JAKARTA TIMUR,CIPAYUNG,BAMBU APUS,,0,300000,6510000,0,6810000,1230000,-5580000,,Angsuran Pertama +Formulir,INSTAGRAM,Ingin belajar lebih fokus dan terarah dibanding belajar sendiri',
  '59,10-09-2026 12:34:05,Offline,154,1,O,O,10/09/2026,2627,2627O456A11,6853581-154-2,77141590-154,154-26-11782,FATIH ALAUDDIN SULTAN,0856 7209 857,0858 1357 5495,fatihalsltnn@gmail.com,Laki-laki,,,2008-05-09,,0  ,,,TIDAK,,0  ,,,26271544154O010,154O010,70035586,SMA UNGGULAN BINA INSAN MULIA,,,,,,0,300000,11830000,0,12130000,1990000,-10140000,,Registrasi (Angsuran 1 + Formulir),TEMAN / KERABAT,Ingin belajar lebih fokus dan terarah dibanding belajar sendiri',
  '79,05-09-2026 18:27:11,Offline,154,1,N,Z,05/09/2026,2627,2627NAB6A11,9308250-154-2,72051811-154,154-26-11773,ARISSA ZHAFIRAH,0896 1631 6346,0852 1005 6232,zhaarissa288@gmail.com,Perempuan,,,,,0  ,,,TIDAK,,0  ,,,2627154A154Z011,154Z011,69947131,SMAIT AL-ARABI,,,,,R668530,2957500,300000,11830000,2957500,9172500,4586500,-4586000,,Pemabayaran ke-1 Diskon PSJ,BROSUR,Ingin belajar lebih fokus dan terarah dibanding belajar sendiri',
  '81,05-09-2026 12:30:45,Offline,123,1,N,Z,05/09/2026,2627,2627NAB6AJ1,7301854-123-2,82112523-123,123-26-11186,MUHAMMAD NAUFAL HANIF,0813 8634 4088,0813 1120 9684,muhammadnaufalhanif28@gmail.com,Laki-laki,ISLAM,,2008-05-28,,0  ,,,TIDAK,,0  ,,,2627123A123Z010,123Z010,20103258,SMAN 93 JAKARTA,,,,,,0,300000,9800000,0,10100000,1700000,-8400000,,R642500,TEMAN / KERABAT,Ingin belajar lebih fokus dan terarah dibanding belajar sendiri',
  '93,02-09-2026 21:05:18,Offline,225,1,N,Z,02/09/2026,2627,2627NAB6A11,2203987-225-2,30564461-225,225-26-10717,MUHAMMAD KENJIRO YUDHANTA,0813 8876 4554,0811 9113 29,kenjiyudhanta@gmail.com,Laki-laki,ISLAM,JAKARTA,2009-06-25,YUDI HARJANTA,0811 9113 29,kenji.h25@gmail.com,Karyawan swasta,TIDAK,DWI AJENG SEKAR HAPSARI,0813 8933 6961,aikenhapsari@gmail.com,Ibu rumah tangga,2627225A225Z030,225Z030,70028282,SMA Islam Al-Azhar BSD@Metland,JAWA BARAT,KABUPATEN BEKASI,SETU,CIKARAGEMAN,,0,200000,11830000,100000,12030000,1890000,-10140000,RI91531,ANGSURAN KE-1 TA.2627,TEMAN / KERABAT,"Ingin diterima di PTN favorit (UI, ITB, UGM, dll)"',
  '114,01-09-2026 14:52:32,Offline,223,1,N,Z,01/09/2026,2627,2627NAB64C1,1637855-223-2,60844500-223,223-26-10676,NATASYA CARENINA,0838 0517 3707,0813 1467 6571,nataaacarenina@gmail.com,Perempuan,KRISTEN,BEKASI,2009-05-03,,0  ,,,TIDAK,,0  ,,,2627223A223Z030,223Z030,20237992,SMAN 1 SETU,JAWA BARAT,KABUPATEN BEKASI,SETU,LUBANGBUAYA,,0,200000,9370000,100000,9570000,9570000,0,IA60052,LUNAS DISKON TUNAI,TEMAN / KERABAT,"Ingin diterima di PTN favorit (UI, ITB, UGM, dll)"',
  '136,27-08-2026 17:43:59,Offline,274,1,N,Z,27/08/2026,2627,2627NAB6A11,1325820-274-1,90015890-274,274-24-11013,CHILLA DITHA ATHIFAH,0812 8672 3710,0812 8672 3710,chilla121408@gmail.com,Perempuan,,,0000-00-00,,0  ,,,TIDAK,,0  ,,,2627274A274Z091,274Z091,20223040,SMAN 9 BEKASI,,,,,,0,50000,11830000,0,11880000,1740000,-10140000,,Angsuran ke-1 dan biaya pendaftaran,TEMAN / KERABAT,Lokasi bimbel yang strategis dan nyaman',
  '442,29-07-2026 21:00:12,Offline,770,1,N,Z,29/07/2026,2627,2627NAB6QAS,6424561-770-2,59866965-770,770-26-23630,AISYAH PUTRI KAMILA,0821 1329 7337,0821 1329 7337,aisyahputrikamila01@gmail.com,Perempuan,ISLAM,DEPOK,2009-10-29,,0  ,,,TIDAK,8127386128,0  ,,,2627770A770Z010,770Z010,70039426,SMA QURAN ASY SYAHID,JAWA BARAT,KOTA DEPOK,CILODONG,JATIMULYA,,0,300000,9700000,100000,9900000,4950000,-4950000,,1,EVENT / PAMERAN PENDIDIKAN,"Ingin diterima di PTN favorit (UI, ITB, UGM, dll)"',
  '586,25-07-2026 17:08:31,Offline,122,0,N,Z,25/07/2026,2627,2627NAB6A11,4087764-122-2,64079151-122,122-26-11675,MUHAMMAD IKHLAS HANIFAN,0813 8821 1484,0812 8474 5495,ikhlashnf808@gmail.com,Laki-laki,ISLAM,,,,0  ,,,TIDAK,,0  ,,,2627122A122Z012,122Z012,20277094,MAN 2 KOTA BEKASI,,,,,,0,300000,11830000,0,12130000,300000,-11830000,,FORMULIR,TEMAN / KERABAT,"Ingin diterima di PTN favorit (UI, ITB, UGM, dll)"',
  '789,17-07-2026 17:52:58,Offline,122,1,L,J,17/07/2026,2627,2627L120171,6010962-122-2,80175664-122,122-26-11661,RIZKI MAULANA,0881 8858 973,0813 8963 2590,my03081979@gmail.com,Laki-laki,ISLAM,,,,0  ,,,TIDAK,,0  ,,,26271221122J010,122J010,69973604,SMAN 22 KOTA BEKASI,JAWA BARAT,KABUPATEN BOGOR,GUNUNG PUTRI,BOJONG KULUR,,0,300000,6970000,0,7270000,7270000,0,,LUNAS TUNAI,SPANDUK,Ingin meningkatkan nilai akademik',
  '1301,26-06-2026 17:17:52,Offline,147,1,L,J,26/06/2026,2627,2627L120171,2456414-147-2,40493346-147,147-26-11001,MUHAMMAD REINER RIZQULLAH,0897 9377 893,0895 3361 90090,reiner@gmail.com,Laki-laki,ISLAM,,,,0  ,,,TIDAK,,0  ,,,26271471147J020,147J020,20275048,SMAN 16 BEKASI,,,,,,0,300000,6970000,0,7270000,7270000,0,,LUNAS DISKON 17%,BROSUR,Mengikuti teman/keluarga yang juga ikut NF',
  '1302,26-06-2026 16:55:50,Offline,234,1,N,Z,26/06/2026,2627,2627NAB6A11,9401849-234-1,23705153-234,234-25-11119,DAFFA RABBANI PASHA,0895 3552 90081,0858 9326 5455,daffarabbanipasha@gmail.com,Laki-laki,ISLAM,BEKASI,2008-04-15,,0  ,,,TIDAK,,0  ,,,2627234A234Z010,234Z010,20252519,SMAN 15 BEKASI,JAWA BARAT,KABUPATEN BOGOR,CILEUNGSI,LIMUSNUNGGAL,,0,50000,11830000,0,11880000,1740000,-10140000,,Pendaftarn dan Angsuran 1 PPLS 2026-2027,TEMAN / KERABAT,"Ingin diterima di PTN favorit (UI, ITB, UGM, dll)"',
  '1306,26-06-2026 10:52:47,Offline,158,1,L,J,26/06/2026,2627,2627L120A11,6596568-158-1,81023375-158,158-23-10611,RAIHANAH SALIHA NUR,0813 8238 8290,0081 3823 88290,rsalihanur@gmail.com,Perempuan,ISLAM,JAKARTA,2011-07-22,YUDI HERMAWAN,0811 8002 773,yudi.h99@gmail.com,KARYAWAN SWASTA,TIDAK,DINI DWI SUNDARI,0813 8444 6065,dee_niy@gmail.com,IBU RUMAH TANGGA,26271581158J010,158J010,20103286,SMAN 113 JAKARTA,DKI JAKARTA,KOTA ADMINISTRASI JAKARTA TIMUR,CIPAYUNG,LUBANG BUAYA,R657854,2100000,50000,8400000,2100000,6350000,6350000,0,,Diskon Juara PSJ,TEMAN / KERABAT,Ingin belajar lebih fokus dan terarah dibanding belajar sendiri',
  '1318,23-06-2026 15:19:37,Offline,154,1,O,O,23/06/2026,2627,2627O456171,6218540-154-2,39324646-154,154-26-11664,ABYAN GHOZI,0895 4145 44890,0896 3708 2412,abyanghozi82@gmail.com,Laki-laki,ISLAM,MUARA ENIM,2008-08-24,AHMAD ZAINIR,0896 3708 2412,,WIRAUSAHA,TIDAK,KARMILA YANTI,0852 7549 2309,,IRT,26271544154O010,154O010,10600905,SMAN 1 UNGGULAN MUARA ENIM,JAWA BARAT,KABUPATEN BEKASI,CIBITUNG,CIBUNTU,,0,300000,9810000,0,10110000,10110000,0,,Lunas Diskon Tunai 17%,BROSUR,"Ingin diterima di PTN favorit (UI, ITB, UGM, dll)"',
  '2053,19-03-2026 13:39:11,Online,274,1,H,E,19/03/2026,2627,2627H120251,8052985-274-2,26913151-274,274-26-11854,RBG ADITYA IRSYAD PRADIPTO,0881 1860 822,0898 8888 267,adityairsyad7@gmail.com,Laki-laki,ISLAM,,,,0  ,,,TIDAK,,0  ,,,26272741274E010,274E010,20254616,SD NUSANTARA ISLAMIC SCHOOL,JAWA BARAT,KOTA BEKASI,MUSTIKAJAYA,CIMUNING,,,300000,4880000,300000,4880000,4880000,0,,Semester 1,2 TA 2627 Diskon 25%,LAIN LAIN,Belum Isi',
  '2258,29-12-2025 14:41:49,Offline,223,0,N,Z,29/12/2025,2627,2627NAB6ZCP,6021957-223-1,81734906-223,223-25-10513,JUAN AHADAN TIRTA,0815 1712 4882,0858 9213 9140,juanahadan@gmail.com,Laki-laki,ISLAM,KLATEN,2008-05-31,,0  ,,,TIDAK,,0  ,,,2627223A223Z022,223Z022,20237992,SMAN 1 SETU,JAWA BARAT,KABUPATEN BEKASI,SETU,CILEDUG,,,50000,3500000,50000,3500000,1000000,-2500000,,ANGSURAN 2 ZUPERCHAMP,LAIN LAIN,Belum Isi'
];

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

const students = rawLines.map((line, idx) => {
  const row = parseCSVLine(line);
  const no = parseInt(row[0]) || idx + 1;
  const tglDaftar = row[1] || '';
  const caraDaftar = row[2] || 'Offline';
  const lb = row[3] || '225';
  const aktif = parseInt(row[4]) ?? 1;
  const jenjangCode = row[5] || '12 SMA';
  let jenjang = jenjangCode;
  if (jenjangCode === 'N') jenjang = '12 SMA';
  else if (jenjangCode === 'M') jenjang = '11 SMA';
  else if (jenjangCode === 'L') jenjang = '10 SMA';
  else if (jenjangCode === 'K') jenjang = '9 SMP';
  else if (jenjangCode === 'J') jenjang = '8 SMP';
  else if (jenjangCode === 'I') jenjang = '7 SMP';
  else if (jenjangCode === 'H') jenjang = '6 SD';
  else if (jenjangCode === 'G') jenjang = '5 SD';
  else if (jenjangCode === 'F') jenjang = '4 SD';
  else if (jenjangCode === 'O') jenjang = 'Alumni / UTBK';

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
  const jenisKelamin = row[17] || '-';
  const agama = row[18] || 'ISLAM';
  const tempatLahir = row[19] || '';
  const tglLahir = row[20] || '';
  const namaAyah = row[21] || '';
  const hpAyah = row[22] || '';
  const emailAyah = row[23] || '';
  const pekerjaanAyah = row[24] || '';
  const alumniNf = row[25] || 'TIDAK';
  const namaIbu = row[26] || '';
  const hpIbu = row[27] || '';
  const emailIbu = row[28] || '';
  const pekerjaanIbu = row[29] || '';
  const idNamaKelas = row[30] || '';
  const namaKelas = row[31] || '';
  const npsn = row[32] || '';
  const asalSekolah = row[33] || '';
  const provTinggal = row[34] || 'JAWA BARAT';
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
  const tagihan = parseFloat(row[45]) || 0;
  const tunggakan = Math.max(0, totalBiaya - totalBayar);
  const statusPembayaran = (totalBiaya > 0 && totalBayar >= totalBiaya) ? 'Lunas' : (totalBayar === 0 ? 'Belum Bayar' : 'Belum Lunas');
  const noNfic = row[46] || '';
  const catatan = row[47] || '';
  const infoNfDari = row[48] || '';
  const alasanMasukNf = row[49] || '';

  return {
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
    tagihan,
    tunggakan,
    statusPembayaran,
    noNfic,
    catatan,
    infoNfDari,
    alasanMasukNf
  };
});

const outPath = path.join(__dirname, '../public/data/students.json');
fs.writeFileSync(outPath, JSON.stringify(students, null, 2), 'utf8');
console.log('Saved', students.length, 'students to public/data/students.json');
