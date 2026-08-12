/**
 * Follow-up draft templates for the promotor (task 9.14: editable message +
 * wa.me demo link; no WhatsApp automation). No contracts schema exists for
 * templates yet — fixture-local shape, `{nama}` is the contact-name
 * placeholder the follow-up draft UI replaces.
 */

export interface FollowUpTemplate {
  id: string;
  title: string;
  body: string;
}

export const followUpTemplates: FollowUpTemplate[] = [
  {
    id: "tpl_001",
    title: "Follow up asesmen",
    body: "Halo {nama}, terima kasih sudah menyelesaikan kelas {program}. Dari refleksi Ibu/Bapak, saya kira anak Ibu/Bapak akan terbantu dengan asesmen gaya belajar. Mau saya bantu jadwalkan? — Bu Rina",
  },
  {
    id: "tpl_002",
    title: "Pengingat ramah",
    body: "Halo {nama}, kelas {program} masih menunggu Ibu/Bapak di hari berikutnya. Belajar 5-10 menit sehari sudah cukup untuk tetap maju. Ada yang bisa saya bantu? — Bu Rina",
  },
  {
    id: "tpl_003",
    title: "Personal check-in",
    body: "Halo {nama}, saya lihat progres Ibu/Bapak di {program} sudah bagus. Ada bagian yang ingin didiskusikan? Saya siap ngobrol sebentar. — Bu Rina",
  },
];
