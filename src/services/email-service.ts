import emailjs from '@emailjs/browser';

export interface RegistrationEmailPayload {
  userName: string;
  userEmail: string;
  userPhone: string;
  userRole: string;
  companyName: string;
  companyEmail: string;
  legalEntity: string;
  industry: string;
  employeeCount: string;
}

export async function sendRegistrationAutoEmails(
  payload: RegistrationEmailPayload
): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return { sent: false, skipped: true };
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        user_name: payload.userName,
        user_email: payload.userEmail,
        user_phone: payload.userPhone,
        user_role: payload.userRole,
        company_name: payload.companyName,
        company_email: payload.companyEmail,
        legal_entity: payload.legalEntity,
        industry: payload.industry,
        employee_count: payload.employeeCount,
      },
      { publicKey }
    );
    return { sent: true };
  } catch (err: any) {
    console.warn('EmailJS notification skipped:', err?.message || err);
    return { sent: false, error: err?.message || 'Gagal mengirim email notifikasi' };
  }
}
