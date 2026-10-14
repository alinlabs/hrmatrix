import React, { useState } from 'react';
import { Lottie } from 'lottie-react';

// Import Lottie JSON animations yang paling relevan dengan konteks tiap slide wizard
import logoAnim from '../../../assets/animations/logo-hrmatrix.json';
import employeesAnim from '../../../assets/animations/empty-employees.json';
import attendanceAnim from '../../../assets/animations/empty-attendance.json';
import kpiAnim from '../../../assets/animations/empty-kpi.json';
import payrollAnim from '../../../assets/animations/empty-payroll.json';
import recapAnim from '../../../assets/animations/empty-recap.json';
import databaseAnim from '../../../assets/animations/empty-database.json';
import dashboardAnim from '../../../assets/animations/empty-dashboard.json';

interface WizardLottieCardProps {
  animationData: object;
  glowColor?: string;
}

export const WizardLottieCard: React.FC<WizardLottieCardProps> = ({
  animationData,
  glowColor = 'from-blue-200/40 via-indigo-100/30 to-blue-50/10',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[190px] sm:h-[230px] flex items-center justify-center select-none mx-auto">
      {/* Soft Ambient Radial Lighting */}
      <div
        className={`absolute inset-0 m-auto w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr ${glowColor} blur-2xl pointer-events-none opacity-80`}
      />

      {/* Lottie Animation Display */}
      <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
        {!hasError ? (
          <Lottie
            src={animationData as any}
            loop={true}
            autoplay={true}
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-xs"
            subscriptions={{
              error: () => setHasError(true),
            }}
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs">
            HRMatrix
          </div>
        )}
      </div>
    </div>
  );
};

/* 1. Selamat Datang di HRMatrix (Logo Brand Animation) */
export function WelcomeVisualizer() {
  return <WizardLottieCard animationData={logoAnim} glowColor="from-blue-200/50 via-indigo-100/40 to-blue-50/20" />;
}

/* 2. Database Karyawan (Employees & Team Animation) */
export function EmployeesVisualizer() {
  return <WizardLottieCard animationData={employeesAnim} glowColor="from-sky-200/50 via-blue-100/40 to-indigo-50/20" />;
}

/* 3. Presensi & Manajemen Shift (Attendance & Time Tracking Animation) */
export function AttendanceVisualizer() {
  return <WizardLottieCard animationData={attendanceAnim} glowColor="from-emerald-200/50 via-teal-100/40 to-blue-50/20" />;
}

/* 4. Penilaian Kinerja / KPI (KPI & Performance Targets Animation) */
export function KpiVisualizer() {
  return <WizardLottieCard animationData={kpiAnim} glowColor="from-purple-200/50 via-indigo-100/40 to-rose-50/20" />;
}

/* 5. Penggajian Lengkap / Payroll (Payroll & Financial Calculation Animation) */
export function PayrollVisualizer() {
  return <WizardLottieCard animationData={payrollAnim} glowColor="from-amber-200/50 via-yellow-100/40 to-emerald-50/20" />;
}

/* 6. Regulasi & Hukum Terintegrasi (Recap & Compliance Document Animation) */
export function RegulationsVisualizer() {
  return <WizardLottieCard animationData={recapAnim} glowColor="from-indigo-200/50 via-blue-100/40 to-purple-50/20" />;
}

/* 7. Sistem Database Lokal & Ekspor-Impor (IndexedDB & Local Storage Vault Animation) */
export function DatabaseVisualizer() {
  return <WizardLottieCard animationData={databaseAnim} glowColor="from-violet-200/50 via-purple-100/40 to-blue-50/20" />;
}

/* 8. Siap Kelola HR Perusahaan? (Interactive Cockpit Dashboard Animation) */
export function ReadyVisualizer() {
  return <WizardLottieCard animationData={dashboardAnim} glowColor="from-blue-200/50 via-emerald-100/40 to-indigo-50/20" />;
}
