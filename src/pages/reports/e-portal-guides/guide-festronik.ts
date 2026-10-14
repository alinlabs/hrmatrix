import { PortalGuideData } from './guide-data-types';

export const guideFestronikData: PortalGuideData = {
  portalId: 'festronik',
  section1: {
    title: '1. Dasar Hukum & Ketentuan Manifest Elektronik (FESTRONIK)',
    icon: 'trash',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan PP No. 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup dan Permen LHK No. 6 Tahun 2021 tentang Tata Cara dan Persyaratan Pengelolaan Limbah Bahan Berbahaya dan Beracun (B3), di mana setiap pengangkutan dan penyerahan limbah B3 wajib disertai manifest elektronik melalui sistem FESTRONIK (festronik.menlhk.go.id).',
      'Manifest Elektronik adalah dokumen pengawasan rantai pasok perpindahan limbah B3 dari pihak Penghasil Limbah (Perusahaan), kepada Pengangkut / Transporter berizin KLHK, hingga ke pihak Pemanfaat / Pengolah / Penimbun akhir yang memiliki izin resmi dari Menteri Lingkungan Hidup dan Kehutanan.'
    ],
    alert: {
      title: 'Larangan Pembuangan Ilegal Limbah B3:',
      text: 'Membuang limbah B3 ke media lingkungan hidup tanpa izin atau menyerahkannya kepada vendor tidak berizin merupakan tindak pidana lingkungan hidup berdasarkan Pasal 104 UU No. 32/2009 dengan ancaman pidana penjara paling lama 3 tahun dan denda paling banyak Rp 3.000.000.000,- (tiga miliar rupiah).',
      variant: 'amber'
    }
  },
  section2: {
    title: '2. Inventaris Limbah B3 Umum di Area Fasilitas Kantor',
    icon: 'file',
    cards: [
      {
        title: 'Lampu TL / Neon Bekas (Kode: B107d):',
        desc: 'Lampu penerangan kantor yang mengandung uap merkuri berbahaya. Wajib disimpan utuh di Tempat Penyimpanan Sementara (TPS) Limbah B3 tanpa dipecahkan.'
      },
      {
        title: 'Sisa Toner Cartridge Printer (Kode: B353-1):',
        desc: 'Cartridge sisa bubuk tinta mesin fotokopi dan printer kantor yang mengandung bahan kimia sintetik dan polimer hidrokarbon karsinogenik.'
      },
      {
        title: 'Baterai & Aki Bekas UPS (Kode: A102d):',
        desc: 'Aki kering/basah bekas unit Uninterruptible Power Supply (UPS) server IT dan genset darurat yang mengandung timbal (Pb) dan cairan asam sulfat pekat.'
      },
      {
        title: 'Oli Pelumas Bekas Genset (Kode: B105d):',
        desc: 'Sisa oli pelumas dan filter oli dari servis rutin mesin genset kantor GA yang mudah terbakar dan mencemari air tanah.'
      }
    ]
  },
  section3: {
    title: '3. Alur Serah Terima & Validasi Festronik',
    icon: 'truck',
    steps: [
      {
        step: '01',
        title: 'Pembuatan Akun Penghasil Limbah di Festronik',
        desc: 'Akses festronik.menlhk.go.id, buat akun perusahaan penghasil limbah B3 dengan melampirkan izin TPS B3 atau Rincian Teknis Penyimpanan Limbah B3.'
      },
      {
        step: '02',
        title: 'Verifikasi Legalitas Vendor Transporter & Pengolah',
        desc: 'Pastikan vendor pengangkut (transporter) memiliki SK Rekomendasi Pengangkutan Limbah B3 KLHK dan Kartu Pengawasan Ditjen Hubdat Kemenhub yang masih aktif.'
      },
      {
        step: '03',
        title: 'Pembuatan Draf Manifest Elektronik',
        desc: 'Penghasil limbah atau transporter menginput jenis limbah B3, kode limbah, jumlah tonase/kilogram, karakteristik kemasan, dan nomor polisi armada truk pengangkut.'
      },
      {
        step: '04',
        title: 'Pemberian Persetujuan (Approval) Serah Terima',
        desc: 'Saat serah terima fisik limbah B3 di lokasi TPS kantor, petugas GA menyetujui (approve) transaksi di sistem Festronik secara real-time.'
      },
      {
        step: '05',
        title: 'Validasi Akhir oleh Pihak Pengolah/Pemanfaat',
        desc: 'Ketika limbah tiba di fasilitas pengolah akhir, pihak pengolah melakukan verifikasi penerimaan di sistem Festronik. Manifest berubah status menjadi "Completed" dan siap diunduh sebagai arsip audit PROPER / ISO 14001.'
      }
    ]
  },
  section4: {
    title: '4. FAQ Seputar Pengelolaan Limbah B3 Perkantoran',
    icon: 'help',
    faqs: [
      {
        q: 'Berapa lama batas waktu penyimpanan limbah B3 di TPS kantor?',
        a: 'Sesuai PP No. 22/2021, jika jumlah timbulan limbah B3 kurang dari 50 kg/hari, batas maksimal penyimpanan di TPS adalah paling lama 180 hari (untuk limbah kategori 1) atau 365 hari (untuk limbah kategori 2) sejak limbah dihasilkan.'
      },
      {
        q: 'Apakah masih diperbolehkan menggunakan manifest kertas 7 rangkap manual?',
        a: 'Tidak diperbolehkan lagi. Seluruh rantai pengangkutan limbah B3 di Indonesia sejak tahun 2020 wajib 100% menggunakan sistem elektronik FESTRONIK KLHK.'
      }
    ]
  }
};
