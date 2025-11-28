export interface Review {
  id: string;
  orderId: string;
  serviceName: string;
  serviceImage: string;
  rating: number;
  comment: string;
  date: string;
  providerName: string;
  reply?: {
    comment: string;
    date: string;
  };
}

export interface WaitingReview {
  orderId: string;
  serviceName: string;
  serviceImage: string;
  orderDate: string;
  providerName: string;
  price: number;
}

// DATA: Menunggu Diulas (Client View)
export const MOCK_WAITING_REVIEWS: WaitingReview[] = [
  {
    orderId: "ORD-2023-001",
    serviceName: "Cuci AC Split 1PK",
    serviceImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
    orderDate: "25 Nov 2023",
    providerName: "Teknisi Handal Jakarta",
    price: 75000
  },
  {
    orderId: "ORD-2023-002",
    serviceName: "Deep Cleaning Sofa 2 Seater",
    serviceImage: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=300&q=80",
    orderDate: "20 Nov 2023",
    providerName: "CleanPro Home Services",
    price: 150000
  }
];

// DATA: Riwayat Ulasan Saya (Client View)
export const MOCK_USER_REVIEWS: Review[] = [
  {
    id: "REV-001",
    orderId: "ORD-2023-003",
    serviceName: "Pijat Refleksi Full Body",
    serviceImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    comment: "Terapisnya sangat profesional dan ramah. Datang tepat waktu. Badan jadi segar kembali. Recommended!",
    date: "15 Nov 2023",
    providerName: "Sehat Bugar Massage",
    reply: {
      comment: "Terima kasih banyak kak atas ulasannya! Ditunggu pesanan selanjutnya ya.",
      date: "15 Nov 2023"
    }
  },
  {
    id: "REV-002",
    orderId: "ORD-2023-004",
    serviceName: "Service Laptop Ganti LCD",
    serviceImage: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=300&q=80",
    rating: 4,
    comment: "Pengerjaan cepat, cuma 2 jam selesai. Layar jernih original. Minusnya cuma agak mahal dikit hehe.",
    date: "10 Nov 2023",
    providerName: "Dokter Laptop Bandung"
  }
];

// DATA: Ulasan Masuk (Provider View)
export const MOCK_PROVIDER_REVIEWS = [
  {
    id: "REV-101",
    userName: "Andi Pratama",
    userAvatar: "https://i.pravatar.cc/150?u=andi",
    serviceName: "Cuci Mobil Premium",
    rating: 5,
    comment: "Mobil jadi kinclong banget seperti baru! Pelayanan ramah.",
    date: "28 Nov 2023",
    hasReplied: false
  },
  {
    id: "REV-102",
    userName: "Siti Aminah",
    userAvatar: "https://i.pravatar.cc/150?u=siti",
    serviceName: "Cuci Mobil Premium",
    rating: 3,
    comment: "Bersih sih, tapi datangnya telat 30 menit dari jadwal.",
    date: "27 Nov 2023",
    hasReplied: true,
    reply: "Mohon maaf atas keterlambatannya kak Siti. Kemarin tim kami terkendala macet parah di jalan. Kami akan perbaiki ketepatan waktu kami kedepannya."
  },
  {
    id: "REV-103",
    userName: "Budi Santoso",
    userAvatar: "https://i.pravatar.cc/150?u=budi",
    serviceName: "Coating Body Mobil",
    rating: 5,
    comment: "Mantap hasilnya!",
    date: "26 Nov 2023",
    hasReplied: false
  }
];
