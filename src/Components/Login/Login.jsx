import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../../assets/google-logo.svg';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SplitText from "../AnimatedComponents/SplitText";
import TextType from '../AnimatedComponents/TextType';
import Background from '../Main/Background';
import LogoLoop from '../AnimatedComponents/LogoLoop';
import BitcoinLogo from '../../assets/BitcoinLogo.svg'
import EthereumLogo from '../../assets/EthereumLogo.svg'
import SolanaLogo from '../../assets/SolanaLogo.svg'
import DogecoinLogo from '../../assets/DogecoinLogo.svg'
import CardanoLogo from '../../assets/CardanoLogo.svg'
import BinanceLogo from '../../assets/BinanceLogo.svg'
import Polygon from '../../assets/Polygon.svg'
import RippleLogo from '../../assets/RippleLogo.svg'
import Aurora from '../AnimatedComponents/Aurora';



export default function Login() {
  const navigate = useNavigate();

  const handleAnimationComplete = () => {

  };

  const imageLogos = [
    { src: BitcoinLogo, alt: "Bitcoin", href: "https://bitcoin.org" },
    { src: EthereumLogo, alt: "Ethereum", href: "https://ethereum.org" },
    { src: SolanaLogo, alt: "Solana", href: "https://solana.com" },
    { src: DogecoinLogo, alt: "Dogecoin", href: "https://dogecoin.com" },
    { src: CardanoLogo, alt: "Cardano", href: "https://cardano.org" },
    { src: BinanceLogo, alt: "Binance Coin", href: "https://www.bnbchain.org" },
    { src: Polygon, alt: "Polygon", href: "https://polygon.technology" },
    { src: RippleLogo, alt: "Ripple (XRP)", href: "https://ripple.com/xrp" },


  ];

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          displayName: user.displayName,
          email: user.email,
          coins: 1000,
        });
      }
      navigate('/');
    } catch (error) {

    }
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-transparent relative overflow-hidden">
        <div className="flex flex-col md:flex-row flex-1">
          <div className="w-full md:w-[50vw] h-[50vh] md:h-[100vh] flex flex-col items-center relative top-[50px] md:top-[150px] left-0 md:left-[100px] px-4 md:px-0">
            <div className="flex flex-col items-center justify-center space-y-6 md:space-y-18">
              <SplitText
                text="Welcome to OPTO!"
                className="text-5xl md:text-[100px] font-semibold text-center text-white"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
              />

              <div className="mt-8">
                <TextType
                  text={["Join the crypto prediction revolution", "Start with 1000 free coins", "Earn rewards for accurate insights"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="▊"
                  className="text-xl md:text-3xl text-white text-center font-light px-4 md:px-0"
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-[50vw] h-[50vh] md:h-[100vh] flex flex-col top-[0px] md:top-[200px] items-center relative px-4 md:px-0 bottom-[200px] sm:bottom-0  ">



            <div className="relative w-[350px] md:w-[400px] h-[250px] md:h-[300px]  rounded-[60px] md:rounded-[80px] shadow-[0_0px_40px_rgba(255,121,198,0.6)] hover:shadow-[0_10px_100px_rgba(255,121,198,0.8)]
            transition-shadow duration-500
            overflow-hidden z-10 "
            >
              <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.3}
                amplitude={1.5}
                speed={0.5}

              />

              <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none">
                <button
                  onClick={handleGoogleLogin}
                  className="bg-white text-gray-600 p-3 w-[260px] md:w-[290px] rounded-[9px] flex items-center justify-center gap-4 font-bold text-sm md:text-base pointer-events-auto hover:scale-105 transition-transform"
                >
                  <img src={googleLogo} alt="google-logo" className="w-5 h-5" />
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[150px] md:h-[200px] overflow-hidden bg-gradient-to-t from-black/50 to-transparent flex items-center z-0">
          <LogoLoop
            logos={imageLogos}
            speed={120}
            direction="left"
            logoHeight={50}
            gap={200}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="black"
            ariaLabel="Technology partners"
          />
        </div>
      </div>
    </>
  );
}