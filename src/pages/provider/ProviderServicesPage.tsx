import { useState, useEffect } from 'react';
import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Plus, Trash2, MoreVertical, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getProviderServices, addService, deleteService, toggleServiceStatus } from '@/services/service.service';
import type { Service } from '@/types';

const ProviderServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '', category: 'Pembersihan', description: '', price: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 1. Fetch Data saat halaman dimuat
  useEffect(() => {
    fetchServices();
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;
    try {
      const data = await getProviderServices(user.uid);
      setServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !imageFile) return;

    setIsSubmitting(true);
    try {
      await addService(user.uid, {
        ...formData,
        price: Number(formData.price),
        imageFile
      });
      setIsModalOpen(false);
      setFormData({ title: '', category: 'Pembersihan', description: '', price: '' });
      setImageFile(null);
      fetchServices(); // Refresh list
    } catch (error) {
      alert('Gagal menambah jasa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus jasa ini?')) {
      await deleteService(id);
      fetchServices();
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleServiceStatus(id, currentStatus);
    fetchServices();
  };

  const formatRupiah = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Layanan Saya</h1>
            <p className="text-gray-500">Kelola daftar layanan Anda.</p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            Tambah Layanan
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="group flex flex-col overflow-hidden border hover:border-blue-200">
                <div className="relative h-48 bg-gray-100">
                  <img src={service.thumbnailUrl} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${service.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {service.isActive ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">{service.category}</p>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug">{service.title}</h3>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">{formatRupiah(service.price)}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggle(service.id, service.isActive)}
                        className={`p-2 rounded-lg border ${service.isActive ? 'border-green-200 text-green-600' : 'border-gray-200 text-gray-400'}`}
                      >
                        <div className={`w-3 h-3 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="p-2 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Tambah Jasa */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Tambah Layanan Baru</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>
              
              <form onSubmit={handleAddService} className="space-y-4">
                <Input label="Nama Layanan" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Pembersihan</option>
                    <option>Perbaikan</option>
                    <option>Listrik</option>
                    <option>Cat</option>
                  </select>
                </div>

                <Input label="Harga (Rp)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto Layanan</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} required className="w-full" />
                </div>

                <Button fullWidth disabled={isSubmitting} type="submit">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Layanan'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderServicesPage;