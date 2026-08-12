"use client";

import { useState } from "react";
import { normalizePhone } from "@promotor/platform-core";
import { matchOrCreateContact } from "@/modules/contacts/commands";
import { enrollContact } from "@/modules/enrollments/commands";
import { Container, Button, Input, TextLink, Stack, Divider } from "@/components/foundation";

interface RegistrationFormClientProps {
  organizationId: string;
  programId: string;
  programTitle: string;
}

export default function RegistrationFormClient({
  organizationId,
  programId,
  programTitle,
}: RegistrationFormClientProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Normalize phone to E.164
      let normalizedPhone: string;
      try {
        normalizedPhone = normalizePhone(phone).toString();
      } catch (err) {
        setError(
          "Nomor telepon tidak valid. Gunakan format Indonesia (contoh: 0812-3456-7890 atau +6281234567890)."
        );
        setLoading(false);
        return;
      }

      // Match or create contact (T11 FIX: now type-safe with PUBLIC_LANDING source)
      const contactResult = matchOrCreateContact({
        organizationId,
        name: name.trim(),
        phone: normalizedPhone,
        email: email.trim() || undefined,
        source: "PUBLIC_LANDING",
      });

      // Enroll contact in program (M0: cast required because EnrollContactInput requires branded IDs per contracts; 
      // MockStateStore uses plain string IDs — T11 finding: type safety compromise accepted for M0 demo path)
      const enrollmentRef = enrollContact({
        organizationId,
        contactId: contactResult.contact.id,
        programId,
        source: "PROMOTORFLOW_MANUAL",
        idempotencyKey: `public-${contactResult.contact.id}-${programId}-${Date.now()}`,
      } as any);

      // Redirect to learner home
      window.location.href = `/learn/programs/${enrollmentRef.enrollmentId}`;
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Terjadi kesalahan saat mendaftarkan Anda. Silakan coba lagi.");
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <Stack gap="6">
        <div className="pc-public-success-state">
          <h3 className="pc-public-success-title">Pendaftaran berhasil!</h3>
          <p className="pc-public-success-desc">
            Anda sekarang terdaftar di kelas{" "}
            <strong>{programTitle}</strong>.
          </p>
          <p className="pc-public-success-note">
            Anda akan langsung diarahkan ke halaman belajar.
          </p>
        </div>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="pc-field-error">{error}</p>}
      
      <Stack gap="6">
        <div className="pc-field">
          <label htmlFor="reg-name" className="pc-field-label">
            Nama lengkap *
          </label>
          <Input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Ayu Rahma"
            required
          />
        </div>

        <div className="pc-field">
          <label htmlFor="reg-phone" className="pc-field-label">
            Nomor telepon WhatsApp *
          </label>
          <Input
            id="reg-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d\s\-().]/g, ""))}
            placeholder="0812-3456-7890"
            maxLength={20}
            autoComplete="tel"
            required
          />
          <p className="pc-field-hint">
            Format: 0812-3456-7890 atau +6281234567890
          </p>
        </div>

        <div className="pc-field">
          <label htmlFor="reg-email" className="pc-field-label">
            Email (opsional)
          </label>
          <Input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="anda@email.com"
            autoComplete="email"
          />
        </div>

        <Divider />

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Mendaftar..." : "Daftar dan Mulai Belajar"}
        </Button>

        <p className="pc-public-submit-hint">
          Dengan mendaftar, Anda setuju untuk mengikuti program ini.
        </p>
      </Stack>
    </form>
  );
}
