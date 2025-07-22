import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <body className="bg-white">{children}</body>
      <Footer />
    </>
  );
}
