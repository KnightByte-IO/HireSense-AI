import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";

const PublicLayout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-surface-900">
      <PublicNavbar />
      <main className="pt-[72px]">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
