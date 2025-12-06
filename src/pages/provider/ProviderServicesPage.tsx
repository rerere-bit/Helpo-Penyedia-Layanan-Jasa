import { useState, useEffect } from 'react';
import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Plus, Edit2, Trash2, Star, Eye, MoreVertical, X, Loader2 } from 'lucide-react';
import { MarketService } from '@/services/market.service';
import { type Service, type Category } from '@/types/market';

// ID Provider Sementara (Simulasi Login)
const CURRENT_PROVIDER_ID = "prov_001"; // Pastikan sama dengan yang dipakai saat seed data

const ProviderServicesPage = () => {
  // State Data
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: 0,
    description: '',
    thumbnailUrl: '',
    location: 'Jakarta Selatan' 
  });

  // 1. Load Data dari Firebase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, myServices] = await Promise.all([
        MarketService.getCategories(),
        MarketService.getProviderServices(CURRENT_PROVIDER_ID)
      ]);
      setCategories(cats.length ? cats : [{id: 'Umum', label: 'Umum', icon: 'box'}]);
      setServices(myServices);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Logic: Submit Data Baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await MarketService.createService({
        ...formData,
        providerId: CURRENT_PROVIDER_ID,
        isActive: true
      });
      setIsModalOpen(false);
      resetForm();
      loadData(); // Refresh list
      alert("Layanan berhasil ditambahkan!");
    } catch (error) {
      alert("Gagal menyimpan layanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', price: 0, description: '', thumbnailUrl: '', location: 'Jakarta Selatan' });
  };

  // 3. Logic: Toggle Status (Aktif/Mati)
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic Update (Ubah UI duluan biar cepat)
    const oldServices = [...services];
    setServices(services.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));

    try {
      await MarketService.toggleServiceStatus(id, !currentStatus);
    } catch (error) {
      setServices(oldServices); // Revert jika gagal
      alert("Gagal mengubah status.");
    }
  };

  // 4. Logic: Delete Service
  const handleDelete = async (id: string) => {
    if(!confirm("Yakin ingin menghapus layanan ini?")) return;
    try {
      await MarketService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      alert("Gagal menghapus layanan.");
    }
  };

  const formatRupiah = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Layanan Saya</h1>
            <p className="text-gray-500">Kelola daftar layanan Anda.</p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            Tambah Layanan Baru
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          /* Grid Layanan */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Render List Services */}
            {services.map((service) => (
              <Card key={service.id} className="group flex flex-col overflow-hidden border border-gray-200 hover:border-blue-200 transition-colors bg-white">
                
                {/* Image & Status Badge */}
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
                  <button className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">{service.category}</p>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {service.title}
                    </h3>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900">{service.rating || 0}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-1.5">
                      <Eye size={14} />
                      {/* Backend belum ada views, kita mock sementara */}
                      <span>{Math.floor(Math.random() * 500)} views</span>
                    </div>
                  </div>

                  {/* Footer: Price & Actions */}
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">{formatRupiah(service.price)}</span>
                    
                    <div className="flex gap-2">
                      {/* Toggle Button */}
                      <button 
                        onClick={() => handleToggleStatus(service.id!, service.isActive)}
                        title={service.isActive ? "Matikan Layanan" : "Aktifkan Layanan"}
                        className={`p-2 rounded-lg border transition-colors ${
                          service.isActive 
                            ? 'border-green-200 text-green-600 hover:bg-green-50' 
                            : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </button>
                      
                      {/* Edit Button (Placeholder) */}
                      <button title="Edit" className="p-2 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit2 size={18} />
                      </button>

                      {/* Delete Button */}
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

            {/* Empty State Card / Add New Placeholder */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-blue-50/30 transition-all group h-full min-h-[350px] bg-white"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 group-hover:bg-blue-100 group-hover:text-primary transition-colors">
                <Plus size={32} />
              </div>
              <h3 className="font-bold text-gray-600 group-hover:text-primary">Tambah Layanan Baru</h3>
              <p className="text-sm text-gray-400 mt-2 text-center px-4">Tawarkan jasa keahlian Anda lainnya kepada pelanggan.</p>
            </button>

          </div>
        )}

        {/* --- MODAL TAMBAH DATA --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-gray-800">Tambah Layanan Baru</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Layanan</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Contoh: Cuci AC Split 1 PK"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Pilih...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      <option value="Cleaning">Cleaning</option>
                      <option value="Electronic">Elektronik</option>
                      <option value="Automotive">Otomotif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      value={formData.price || ''}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Jelaskan detail layanan..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (Thumbnail)</label>
                  <input 
                    required
                    type="url" 
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    value={formData.thumbnailUrl}
                    onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 mt-1">Gunakan link gambar dari Unsplash atau Google untuk demo.</p>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Layanan'}
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