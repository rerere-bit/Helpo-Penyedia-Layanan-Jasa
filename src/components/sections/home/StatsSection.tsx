import { Container } from '@/components/common/Container';

const stats = [
  { 
    number: "10,000+", 
    label: "Pengguna Aktif" 
  },
  { 
    number: "1,500+", 
    label: "Penyedia Jasa" 
  },
  { 
    number: "50,000+", 
    label: "Layanan Selesai" 
  },
  { 
    number: "4.8/5", 
    label: "Rating Rata-rata" 
  },
];

const StatsSection = () => {
  return (
    <section className="bg-blue-600 py-12 text-white">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-white/20 md:divide-x">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2 px-2">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                {stat.number}
              </h3>
              <p className="text-blue-100 font-medium text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StatsSection;