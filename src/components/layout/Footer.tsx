import { Container } from '@/components/common/Container';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold">Helpo</span>
            <p className="text-slate-400 text-sm mt-1">© 2025 Helpo. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;