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


export default function Login() {
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const imageLogos = [
    { src: BitcoinLogo, alt: "Company 1", href: "https://company1.com" },
    { src: EthereumLogo, alt: "Company 2", href: "https://company2.com" },
    { src: SolanaLogo, alt: "Company 3", href: "https://company3.com" },
    { src: DogecoinLogo, alt: "Company 3", href: "https://company3.com" },
    { src: CardanoLogo, alt: "Company 3", href: "https://company3.com" },
    { src: BinanceLogo, alt: "Company 3", href: "https://company3.com" },
    { src: Polygon, alt: "Company 3", href: "https://company3.com" },
    { src: RippleLogo, alt: "Company 3", href: "https://company3.com" },

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
      navigate('/MainPage');
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-transparent relative overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-row flex-1">
          {/* Left Side - Text Content */}
          <div className="w-[50vw] h-[100vh] flex flex-col items-center relative top-[200px] left-[100px]">
            <div className="flex flex-col items-center justify-center space-y-18">
              {/* Main "Hello you!" text */}
              <SplitText
                text="Hello you!"
                className="text-[120px] font-semibold text-center text-white"
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

              {/* TextType component below */}
              <div className="mt-8">
                <TextType
                  text={["Join the crypto prediction revolution", "Start with 1000 free coins", "Earn rewards for accurate insights"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="▊"
                  className="text-3xl text-white text-center font-light"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="w-[50vw] h-[100vh] flex flex-col justify-center">
            <div className="bg-gray-900/50 backdrop-blur-   w-[400px] h-[300px] rounded-[80px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-8 absolute right-[200px] flex flex-col justify-center items-center">
              <div className="btn">
                <button onClick={handleGoogleLogin} className="bg-white text-[hsl(0,0%,54%)] border-none p-[11.5px] w-[290px] rounded-[9px] flex flex-row gap-4 justify-center items-center font-bold">
                  <img src={googleLogo} alt="google-logo" className='w-5 h-5' />
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with LogoLoop */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px] overflow-hidden bg-gradient-to-t from-black/50 to-transparent flex items-center">
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