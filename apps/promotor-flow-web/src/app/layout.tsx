import "@/styles/globals.css";

export const metadata = {
  title: "PromotorFlow",
  description: "Calm, efficient CRM for promotors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="pf-page-frame">
          <main className="pf-app-main">
            <div className="page-container">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
