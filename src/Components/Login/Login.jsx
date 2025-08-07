import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../../assets/google-logo.svg';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function Login() {

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User:', result.user);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  }


  return (
    <>
      <div className="h-screen flex flex-row bg-[#020313]" >

        <DotLottieReact
          src="https://lottie.host/6d1abc75-a7bc-4bb6-9740-a7024d58d4c7/BvQfqWTHHt.lottie"
          loop
          autoplay
        />
        <div className=" w-[50vw] h-[100vh]2">

        </div>


        <div className=" w-[50vw] h-[100vh] flex flex-col justify-center ">
          <div className="bg-[#ffffff25] w-[400px] h-[300px] rounded-[80px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-8 absolute left-[800px] flex flex-col justify-center items-center">
            <div className="btn" >
              <button onClick={handleGoogleLogin} className="bg-white text-[hsl(0,0%,54%)] border-none p-[11.5px] w-[290px] rounded-[9px] flex flex-row gap-4 justify-center items-center font-bold">
                <img src={googleLogo} alt="google-logo" className=' w-5 h-5 ' />
                Continue with Google
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
