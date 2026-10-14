import { JobTemplate, IndexJobTemplate } from '../../pages/job-desk/types';
import { enrichJobTemplateWithStructuredFields } from '../../pages/job-desk/qualification-options';

import perkantoranData from './perkantoran';
import teknologiData from './teknologi';
import telekomunikasiData from './telekomunikasi';
import kreatifData from './kreatif';
import mediaData from './media';
import pengembanganData from './pengembangan';
import penjualanData from './penjualan';
import perbankanData from './perbankan';
import asuransiData from './asuransi';
import investasiData from './investasi';
import hukumData from './hukum';
import sdmData from './sdm';
import konsultasiData from './konsultasi';
import manufakturData from './manufaktur';
import otomotifData from './otomotif';
import elektronikData from './elektronik';
import konstruksiData from './konstruksi';
import propertiData from './properti';
import arsitekturData from './arsitektur';
import pertambanganData from './pertambangan';
import energiData from './energi';
import utilitasData from './utilitas';
import pertanianData from './pertanian';
import perkebunanData from './perkebunan';
import peternakanData from './peternakan';
import perikananData from './perikanan';
import kehutananData from './kehutanan';
import panganData from './pangan';
import fnbData from './fnb';
import perhotelanData from './perhotelan';
import hiburanData from './hiburan';
import ritelData from './ritel';
import eCommerceData from './e-commerce';
import konsumsiData from './konsumsi';
import fesyenData from './fesyen';
import kecantikanData from './kecantikan';
import kesehatanData from './kesehatan';
import farmasiData from './farmasi';
import alatKesehatanData from './alat-kesehatan';
import pendidikanData from './pendidikan';
import risetData from './riset';
import transportasiData from './transportasi';
import logistikData from './logistik';
import rantaiPasokData from './rantai-pasok';
import penerbanganData from './penerbangan';
import maritimPelayaranData from './maritim-pelayaran';
import pemerintahanData from './pemerintahan';
import nirlabaData from './nirlaba';
import keamananData from './keamanan';
import jasaProfesionalData from './jasa-profesional';

const rawTemplates: JobTemplate[] = [
  ...perkantoranData,
  ...teknologiData,
  ...telekomunikasiData,
  ...kreatifData,
  ...mediaData,
  ...pengembanganData,
  ...penjualanData,
  ...perbankanData,
  ...asuransiData,
  ...investasiData,
  ...hukumData,
  ...sdmData,
  ...konsultasiData,
  ...manufakturData,
  ...otomotifData,
  ...elektronikData,
  ...konstruksiData,
  ...propertiData,
  ...arsitekturData,
  ...pertambanganData,
  ...energiData,
  ...utilitasData,
  ...pertanianData,
  ...perkebunanData,
  ...peternakanData,
  ...perikananData,
  ...kehutananData,
  ...panganData,
  ...fnbData,
  ...perhotelanData,
  ...hiburanData,
  ...ritelData,
  ...eCommerceData,
  ...konsumsiData,
  ...fesyenData,
  ...kecantikanData,
  ...kesehatanData,
  ...farmasiData,
  ...alatKesehatanData,
  ...pendidikanData,
  ...risetData,
  ...transportasiData,
  ...logistikData,
  ...rantaiPasokData,
  ...penerbanganData,
  ...maritimPelayaranData,
  ...pemerintahanData,
  ...nirlabaData,
  ...keamananData,
  ...jasaProfesionalData,
];

export const allTemplates: JobTemplate[] = rawTemplates.map(t => enrichJobTemplateWithStructuredFields(t));

export const baseIndexList: IndexJobTemplate[] = allTemplates.map(t => ({
  id: t.id,
  nama: t.nama,
  kategori: t.kategori,
  departemen: t.departemen,
  divisi: t.divisi,
  level: t.level,
  atasanLangsung: t.atasanLangsung,
  tujuanJabatan: t.tujuanJabatan,
  sourceFile: t.kategori.toLowerCase().replace(/\s+/g, '-') + '.ts',
  jumlahTugas: t.tanggungJawab ? t.tanggungJawab.length : 0,
  jumlahKpi: t.kpi ? t.kpi.length : 0
}));

export default baseIndexList;
