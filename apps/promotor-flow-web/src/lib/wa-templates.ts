/**
 * Template pesan WhatsApp sesuai PRD PromotorFlow §26.
 * Variabel mengikuti PRD: {{first_name}}, {{service_name}}, {{booking_date}},
 * {{booking_time}}, {{promoter_name}}. Pesan selalu bisa diedit user
 * sebelum dikirim (human-in-the-loop, PRD §4.2).
 */

export type WaTemplateType =
  | "FIRST_CONTACT"
  | "FOLLOW_UP"
  | "PAYMENT_REMINDER"
  | "BOOKING_REMINDER"
  | "AFTERCARE";

export interface WaTemplateVars {
  firstName: string;
  serviceName?: string;
  bookingDate?: string;
  bookingTime?: string;
  promoterName?: string;
}

function fill(template: string, vars: WaTemplateVars): string {
  return template
    .replaceAll("{firstName}", vars.firstName)
    .replaceAll("{serviceName}", vars.serviceName ?? "tes STIFIn")
    .replaceAll("{bookingDate}", vars.bookingDate ?? "yang sudah dijadwalkan")
    .replaceAll("{bookingTime}", vars.bookingTime ? ` pukul ${vars.bookingTime}` : "")
    .replaceAll("{promoterName}", vars.promoterName ?? "Rina");
}

const TEMPLATES: Record<WaTemplateType, string> = {
  FIRST_CONTACT:
    "Halo {firstName}, terima kasih sudah tertarik dengan tes STIFIn. Saya {promoterName}, promotor sertifikat. Kalau berkenan, saya mau bantu jelaskan proses tesnya dan cari waktu yang cocok untuk sesi Anda. Ada yang mau ditanyakan dulu?",
  FOLLOW_UP:
    "Halo {firstName}, semoga sehat terus. Saya {promoterName}. Masih terbuka nih kalau Anda mau lanjut atur jadwal sesi tes STIFIn — kapan waktu yang nyaman untuk Anda?",
  PAYMENT_REMINDER:
    "Halo {firstName}, mengingatkan soal pembayaran DP sesi {serviceName} Anda {bookingDate}. Bila sudah ditransfer, boleh dikirim buktinya di sini ya. Terima kasih!",
  BOOKING_REMINDER:
    "Halo {firstName}, mengonfirmasi jadwal sesi {serviceName} Anda {bookingDate}{bookingTime}. Mohon konfirmasi bila jadwal ini sudah pas ya. Sampai jumpa!",
  AFTERCARE:
    "Halo {firstName}, sudah sekitar satu minggu sejak sesi kemarin. Saya ingin cek apakah ada bagian dari hasil yang masih membingungkan atau ingin didiskusikan lagi?",
};

export function buildWaMessage(type: WaTemplateType, vars: WaTemplateVars): string {
  return fill(TEMPLATES[type], vars);
}

export type TodayStatusType = "overdue" | "paid" | "pending_payment" | "aftercare" | "regular";

/**
 * Pemetaan baris halaman "Hari ini" → template, sesuai NextAction type di PRD.
 */
export function templateForTodayStatus(statusType: TodayStatusType): WaTemplateType {
  switch (statusType) {
    case "pending_payment":
    case "overdue":
      return "PAYMENT_REMINDER";
    case "aftercare":
      return "AFTERCARE";
    case "paid":
      return "BOOKING_REMINDER";
    default:
      return "FOLLOW_UP";
  }
}
