import { useState, useEffect } from 'react';
import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Plus, Edit2, Trash2, X, Loader2, Star, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Import Backend Logic
import { 
  getProviderServices, 
  addService, 
  updateService, // <-- Import fungsi baru
  deleteService, 
  toggleServiceStatus 
} from '@/services/service.service';
import { getCategories } from '@/services/category.service';
import type { Service, Category } from '@/types';

const ProviderServicesPage = () => {
  const { user } = useAuth();
  
  // State Data
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // [BARU] State untuk menyimpan ID layanan yang sedang diedit (null artinya mode Tambah)
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', 
    category: '', 
    description: '', 
    price: '',
    thumbnailUrl: ''
  });

  // 1. Fetch Data
  useEffect(() => {
    const initData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [fetchedServices, fetchedCategories] = await Promise.all([
          getProviderServices(user.uid),
          getCategories()
        ]);
        setServices(fetchedServices);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [user]);

  // Helper Reset Form
  const resetForm = () => {
    setFormData({ 
      title: '', 
      category: categories[0]?.label || '', 
      description: '', 
      price: '',
      thumbnailUrl: ''
    });
    setEditingId(null); // Reset mode edit
  };

  // 2. Handle Klik Tombol "Tambah Baru"
  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // 3. Handle Klik Tombol "Edit" (Pensil)
  const openEditModal = (service: Service) => {
    setEditingId(service.id); // Set ID yang mau diedit
    setFormData({
      title: service.title,
      category: service.category,
      description: service.description,
      price: String(service.price),
      thumbnailUrl: service.thumbnailUrl
    });
    setIsModalOpen(true);
  };

  // 4. Handle Submit (Bisa Create atau Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        // --- MODE EDIT ---
        await updateService(editingId, {
          ...formData,
          price: Number(formData.price),
        });
        alert('Layanan berhasil diperbarui!');
      } else {
        // --- MODE TAMBAH ---
        await addService(user.uid, {
          ...formData,
          price: Number(formData.price),
        });
        alert('Layanan berhasil ditambahkan!');
      }
      
      setIsModalOpen(false);
      resetForm();
      
      // Refresh Data
      const updatedServices = await getProviderServices(user.uid);
      setServices(updatedServices);
      
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Handle Hapus
  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus layanan ini secara permanen?')) {
      try {
        await deleteService(id);
        // Optimistic Update: Hapus dari layar tanpa fetch ulang
        setServices(prev => prev.filter(s => s.id !== id));
      } catch (error) {
        alert("Gagal menghapus layanan");
      }
    }
  };

  // 6. Handle Toggle Status
  const handleToggle = async (id: string, currentStatus: boolean) => {
    // Optimistic update UI
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
    try {
      await toggleServiceStatus(id, currentStatus);
    } catch (error) {
      setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: currentStatus } : s));
    }
  };

  const formatRupiah = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Layanan Saya</h1>
            <p className="text-gray-500">Kelola daftar layanan Anda.</p>
          </div>
          {/* Tombol Tambah */}
          <Button icon={<Plus size={18} />} onClick={openAddModal}>
            Tambah Layanan
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {services.map((service) => (
              <Card key={service.id} className="group flex flex-col overflow-hidden border border-gray-200 hover:border-blue-200 transition-colors bg-white">
                
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={service.thumbnailUrl || "https://placehold.co/400x300?text=No+Image"} 
                    alt={service.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${service.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {service.isActive ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">{service.category}</p>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900">{service.rating || 0}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-1.5">
                      <Eye size={14} />
                      <span>{(service.reviewCount || 0) * 10 + 5} views</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">{formatRupiah(service.price)}</span>
                    
                    <div className="flex gap-2">
                      {/* Toggle */}
                      <button 
                        onClick={() => handleToggle(service.id!, service.isActive ?? false)}
                        title={service.isActive ? "Matikan" : "Aktifkan"}
                        className={`p-2 rounded-lg border transition-colors ${
                          service.isActive 
                            ? 'border-green-200 text-green-600 hover:bg-green-50' 
                            : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </button>
                      
                      {/* Tombol Edit */}
                      <button 
                        onClick={() => openEditModal(service)} 
                        title="Edit" 
                        className="p-2 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>

                      {/* Tombol Delete */}
                      <button 
                        onClick={() => handleDelete(service.id!)}
                        title="Hapus" 
                        className="p-2 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Empty State / Add Button Card */}
            <button 
              onClick={openAddModal}
              className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-blue-50/30 transition-all group h-full min-h-[350px] bg-white"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 group-hover:bg-blue-100 group-hover:text-primary transition-colors">
                <Plus size={32} />
              </div>
              <h3 className="font-bold text-gray-600 group-hover:text-primary">Tambah Layanan Baru</h3>
            </button>

          </div>
        )}

        {/* --- MODAL FORM (REUSABLE UNTUK ADD & EDIT) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
              
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-gray-800">
                  {editingId ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input 
                  label="Nama Layanan" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      <option value="">Pilih Kategori...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.label}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100"
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                {/* Input Link Gambar Manual (Pengganti Upload) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Gambar (URL)</label>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    value={formData.thumbnailUrl}
                    onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Masukkan link gambar langsung. Jika kosong, akan menggunakan gambar default.
                  </p>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    {isSubmitting ? 'Simpan' : (editingId ? 'Update Layanan' : 'Simpan Layanan')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </ProviderLayout>
  );
};

export default ProviderServicesPage;