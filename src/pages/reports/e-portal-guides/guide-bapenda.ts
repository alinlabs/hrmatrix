import { PortalGuideData } from './guide-data-types';

export const guideBapendaData: PortalGuideData = {
  portalId: 'bapenda',
  section1: {
    title: '1. Dasar Hukum Pajak Daerah & Retribusi (UU HKPD No. 1/2022)',
    icon: 'coins',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan Undang-Undang No. 1 Tahun 2022 tentang Hubungan Keuangan antara Pemerintah Pusat dan Pemerintahan Daerah (UU HKPD) dan Peraturan Daerah setempat, di mana Badan Pendapatan Daerah (Bapenda / Dispenda) mengelola pemungutan pajak daerah yang berhubungan langsung dengan operasional fasilitas General Affairs (GA) perusahaan.',
      'Objek pajak daerah yang wajib dikelola dan dilaporkan secara berkala oleh tim GA meliputi: Pajak Reklame atas papan nama kantor / neon box merek, Pajak Air Tanah (PAT / ABT) atas penggunaan sumur bor kantor, Pajak Kendaraan Bermotor (PKB) atas armada dinas perusahaan, dan PBB-P2 gedung kantor.'
    ]
  },
  section2: {
    title: '2. Tiga Kategori Utama Pajak Daerah Operasional GA',
    icon: 'file',
    columns: 3,
    cards: [
      {
        title: 'Pajak Reklame Papan Nama Kantor',
        desc: 'Pemasangan papan nama perusahaan, neon box, billboard di fasad gedung atau pinggir jalan. Tarif pajak maksimal 25% dari Nilai Sewa Reklame (NSR) yang dihitung dari luasan area x kelas jalan x sudut pandang. Wajib diperpanjang setiap 1 tahun.',
        variant: 'purple'
      },
      {
        title: 'Pajak Air Tanah (PAT / ABT)',
        desc: 'Pengambilan air tanah melalui sumur bor kantor untuk sanitasi dan operasional fasilitas. Tarif maksimal 20% dari Nilai Perolehan Air (NPA) berdasarkan meteran air (water meter) yang dicatat petugas setiap bulan.',
        variant: 'cyan'
      },
      {
        title: 'Pajak Kendaraan Dinas (PKB & Uji KIR)',
        desc: 'Pajak tahunan dan 5-tahunan STNK armada mobil dinas Direksi, operasional sales, van logistik, serta kewajiban Uji Berkala Kendaraan Bermotor (KIR) setiap 6 bulan untuk kendaraan niaga/pickup.',
        variant: 'emerald'
      }
    ]
  },
  section3: {
    title: '3. Alur Pelaporan & Pembayaran di Portal Pajak Daerah',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Akses Portal Pajak Daerah Bapenda Setempat',
        desc: 'Akses portal pajak online daerah setempat (misal: pajakonline.jakarta.go.id, bapenda.jabarprov.go.id, bapenda.jatimprov.go.id) menggunakan akun Wajib Pajak Badan.'
      },
      {
        step: '02',
        title: 'Pendaftaran Objek Pajak Reklame / Air Tanah Baru',
        desc: 'Input data spesifikasi teknis reklame (ukuran panjang x lebar x tinggi), foto visual naskah iklan, titik koordinat, dan surat izin pemilik lahan.'
      },
      {
        step: '03',
        title: 'Penetapan Nilai Pajak & Surat Ketetapan Pajak Daerah (SKPD)',
        desc: 'Petugas Bapenda melakukan verifikasi pengukuran dan menerbitkan Surat Ketetapan Pajak Daerah (SKPD) resmi yang memuat nominal pajak terutang dan kode bayar Virtual Account.'
      },
      {
        step: '04',
        title: 'Penyetoran Melalui Bank Pembangunan Daerah (BPD) / ATM',
        desc: 'Lakukan pembayaran melalui Bank DKI, Bank BJB, Bank Jatim, Bank Jateng, atau kanal bank umum lainnya sebelum tanggal jatuh tempo SKPD.'
      },
      {
        step: '05',
        title: 'Penerbitan Surat Izin Penyelenggaraan Reklame (SIPR)',
        desc: 'Unduh Tanda Bukti Pembayaran dan Stiker Peneng Pajak Reklame resmi ber-QR Code untuk ditempelkan pada fisik papan nama kantor.'
      }
    ]
  },
  section4: {
    title: '4. FAQ Pajak Daerah Fasilitas Kantor',
    icon: 'help',
    faqs: [
      {
        q: 'Apakah papan nama kantor berukuran kecil tetap dikenakan pajak reklame?',
        a: 'Sebagian besar pemerintah daerah memberikan pembebasan pajak reklame untuk papan nama kantor berukuran di bawah batas tertentu (misal: luas tidak melebihi 0.5 - 1 m2) yang dipasang di halaman bangunan kantor sendiri dan hanya memuat nama usaha tanpa slogan promosi. Periksa Perda setempat untuk kepastian batasan ukuran.'
      },
      {
        q: 'Apa sanksi jika memasang papan nama neon box tanpa izin pajak reklame?',
        a: 'Satpol PP dan Bapenda berwenang menyegel papan nama dengan stiker merah "BELUM MEMBAYAR PAJAK", pemutusan sambungan listrik neon box, hingga pembongkaran paksa rangka besi reklame.'
      }
    ]
  }
};
