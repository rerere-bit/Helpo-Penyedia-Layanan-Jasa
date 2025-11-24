import MainLayout from '@/components/layout/MainLayout';
import { Container } from '@/components/common/Container';

const ServiceListingPage = () => {
  return (
    <MainLayout>
      <Container className="py-20 text-center">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Cari Layanan</h1>
          <p className="text-gray-500 mt-2">
            Halaman pencarian jasa akan kita bangun di tahap selanjutnya.
          </p>
        </div>
      </Container>
    </MainLayout>
  );
};

export default ServiceListingPage;