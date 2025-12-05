import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Bell, Lock, Shield } from 'lucide-react';

const SettingsPage = () => {
  const [tab, setTab] = useState<'notification'|'security'|'privacy'>('notification');

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-3xl mx-auto pb-20">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
            <p className="text-gray-500 text-sm mt-1">Atur preferensi akun, keamanan, dan notifikasi Anda.</p>
          </div>

          <Card className="p-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setTab('notification')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === 'notification' ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                <div className="flex items-center gap-2"><Bell size={16} />Notifikasi</div>
              </button>
              <button
                onClick={() => setTab('security')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === 'security' ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                <div className="flex items-center gap-2"><Lock size={16} />Keamanan</div>
              </button>
              <button
                onClick={() => setTab('privacy')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === 'privacy' ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                <div className="flex items-center gap-2"><Shield size={16} />Privasi</div>
              </button>
            </div>
          </Card>

          {tab === 'notification' && (
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Preferensi Notifikasi</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-medium">Notifikasi Push</div>
                    <div className="text-sm text-gray-500">Aktifkan untuk menerima notifikasi di perangkat Anda.</div>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>

                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-500">Terima ringkasan aktivitas via email.</div>
                  </div>
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline">Simpan Preferensi</Button>
                </div>
              </div>
            </Card>
          )}

          {tab === 'security' && (
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Keamanan Akun</h2>
              <div className="space-y-4">
                <Input label="Password Lama" type="password" />
                <Input label="Password Baru" type="password" />
                <Input label="Konfirmasi Password Baru" type="password" />
                <div className="flex justify-end">
                  <Button>Ubah Password</Button>
                </div>
              </div>
            </Card>
          )}

          {tab === 'privacy' && (
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Privasi & Keamanan</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="font-medium">Akun Privat</div>
                  <div className="text-sm text-gray-500">Saat diaktifkan, hanya pengguna terverifikasi yang dapat melihat profil Anda.</div>
                  <div className="mt-3">
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline">Simpan Pengaturan</Button>
                </div>
              </div>
            </Card>
          )}

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default SettingsPage;
