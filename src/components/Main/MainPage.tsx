import Navbar from './Navbar';
import Main from './Main';
import Footer from './Footer';
import LivePriceTicker from './LivePriceTicker';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-background dot-grid">
      <Navbar />
      <LivePriceTicker />
      <Main />
      <Footer />
    </div>
  );
}