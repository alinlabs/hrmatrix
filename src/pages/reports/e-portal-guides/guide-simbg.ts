import { PortalGuideData } from './guide-data-types';

export const guideSIMBGData: PortalGuideData = {
  portalId: 'simbg',
  section1: {
    title: '1. Dasar Hukum Persetujuan Bangunan Gedung (PBG) & Sertifikat Laik Fungsi (SLF)',
    icon: 'building',
    paragraphs: [
      'HR MATRIX telah melakukan penyesuaian berdasarkan Undang-Undang No. 28 Tahun 2002 tentang Bangunan Gedung jo. UU Cipta Kerja No. 6/2023 dan PP No. 16 Tahun 2021 tentang Peraturan Pelaksanaan UU Bangunan Gedung, di mana Izin Mendirikan Bangunan (IMB) telah bertransformasi menjadi Persetujuan Bangunan Gedung (PBG) dan kewajiban kepemilikan Sertifikat Laik Fungsi (SLF) yang diurus secara terpusat melalui portal SIMBG (simbg.pu.go.id) Kementerian PUPR.',
      'Setiap bangunan gedung yang digunakan untuk aktivitas usaha, perkantoran, perbankan, pergudangan, maupun sarana publik wajib mengantongi SLF sebelum gedung dapat dimanfaatkan secara legal dan beroperasi melayani karyawan dan pelanggan.'
    ],
    subCards: [
      {
        title: 'Fungsi PBG (Persetujuan Bangunan Gedung):',
        desc: 'Dokumen izin sebelum memulai proses konstruksi, perombakan besar, renovasi fasad/arsitektur, atau penambahan luasan lantai gedung kantor operasional.',
        variant: 'blue'
      },
      {
        title: 'Fungsi SLF (Sertifikat Laik Fungsi):',
        desc: 'Sertifikat bukti bahwa gedung kantor telah memenuhi standar keandalan keselamatan struktur, proteksi kebakaran, kesehatan ventilasi, dan kemudahan evakuasi. Berlaku 5 tahun untuk gedung umum.',
        variant: 'emerald'
      }
    ]
  },
  section2: {
    title: '2. Empat Aspek Kelaikan Teknis Bangunan Kantor',
    icon: 'shield',
    cards: [
      {
        title: '1. Keselamatan Struktur & Kebakaran:',
        desc: 'Kekuatan fondasi beton bertulang menahan beban gempa bumi, sistem proteksi kebakaran aktif (hydrant, sprinkler, APAR, alarm smoke detector), dan instalasi penangkal petir.'
      },
      {
        title: '2. Kesehatan & Kenyamanan Lingkungan:',
        desc: 'Sistem ventilasi sirkulasi udara bersih (HVAC/AC central), pencahayaan alami dan buatan yang cukup, sistem sanitasi air bersih, serta pembuangan air kotor kelaikan STP.'
      },
      {
        title: '3. Kemudahan Aksesibilitas:',
        desc: 'Ketersediaan tangga darurat yang bebas hambatan (fire exit), pintu darurat anti-api dengan panic bar, koridor evakuasi, dan fasilitas akses ramah disabilitas (ramp, toilet difabel).'
      },
      {
        title: '4. Instalasi Mekanikal & Elektrikal (MEP):',
        desc: 'Keandalan panel distribusi daya listrik PLN, pengaman genset backup otomatis (ATS), kelaikan operasional lift penumpang dan gondola perawatan gedung.'
      }
    ]
  },
  section3: {
    title: '3. Langkah-Langkah Pengurusan PBG & SLF di SIMBG',
    icon: 'clock',
    steps: [
      {
        step: '01',
        title: 'Registrasi Akun Pemohon di simbg.pu.go.id',
        desc: 'Buat akun pemohon atas nama badan usaha pengelola gedung atau pemilik aset kantor.'
      },
      {
        step: '02',
        title: 'Pilih Layanan (PBG Baru, Renovasi, atau SLF Perpanjangan)',
        desc: 'Pilih permohonan Persetujuan Bangunan Gedung (PBG) atau Sertifikat Laik Fungsi (SLF) Bangunan Eksisting.'
      },
      {
        step: '03',
        title: 'Unggah Dokumen As-Built Drawing & Kajian Teknis',
        desc: 'Unggah berkas kepemilikan tanah, gambar arsitektur As-Built Drawing yang disahkan arsitek berlisensi (STRA), gambar struktur, dan laporan kajian teknis pengkaji teknis bersertifikat.'
      },
      {
        step: '04',
        title: 'Sidang Penilaian Teknis Bersama Tim Ahli (TPA / TPT)',
        desc: 'Tim Profesi Ahli (TPA) Dinas Cipta Karya / PUPR Pemerintah Daerah setempat mengadakan sidang pleno dan inspeksi lapangan ke lokasi gedung kantor.'
      },
      {
        step: '05',
        title: 'Penerbitan Surat Keputusan PBG / Sertifikat SLF',
        desc: 'Setelah dinyatakan memenuhi standar teknis, terbit Surat PBG / Sertifikat SLF resmi bertanda tangan digital QR Code Kepala Dinas Penanaman Modal (DPMPTSP) setempat.'
      }
    ]
  },
  section4: {
    title: '4. FAQ Bangunan Gedung & SLF',
    icon: 'help',
    faqs: [
      {
        q: 'Jika gedung sudah memiliki IMB lama apakah otomatis memiliki PBG?',
        a: 'Sesuai Pasal 347 PP No. 16/2021, IMB yang telah diterbitkan sebelum aturan ini berlaku dinyatakan tetap berlaku. Namun untuk operasional gedung komersial, gedung tersebut tetap diwajibkan memiliki Sertifikat Laik Fungsi (SLF) yang diperpanjang setiap 5 tahun.'
      },
      {
        q: 'Apa risiko jika kantor beroperasi tanpa SLF?',
        a: 'Gedung dapat dikenai sanksi administratif berupa penghentian sementara kegiatan operasional, penyegelan oleh Satpol PP, klaim asuransi kebakaran ditolak pihak asuransi jika terjadi kebakaran, serta hambatan saat audit ISO 45001 / SMK3.'
      }
    ]
  }
};
