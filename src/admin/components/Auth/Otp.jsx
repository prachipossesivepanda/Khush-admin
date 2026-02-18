// OTP.jsx
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { verifyOtp } from '../../apis/Authapi';
import {
  setLoading,
  setError,
  clearError,
  setToken
} from '../../../redux/GlobalSlice';
import { selectLoading, selectError } from '../../../redux/GlobalSelector';

export default function OTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const phone = location.state?.phone || 'XXXXXXXXXX';
  const userId = location.state?.userId || null;

  useEffect(() => {
    console.log("OTP component mounted");
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    console.log(`Input ${index} changed to:`, value);

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setIsValid(true);
    dispatch(clearError());

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    console.log("Pasted OTP:", pasted);

    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length && i < 6; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      setIsValid(true);
      dispatch(clearError());

      const nextFocus = Math.min(pasted.length, 5);
      inputs.current[nextFocus]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    console.log("Submitting OTP:", otpValue, "for user:", userId);

    if (otpValue.length !== 6) {
      setIsValid(false);
      console.log("OTP invalid length:", otpValue.length);
      return;
    }

    dispatch(clearError());
    dispatch(setLoading(true));
    setIsValid(true);
    setIsSubmitting(true);

    try {
      const res = await verifyOtp({ userId, otp: otpValue });
      console.log("OTP verification response:", res);

      if (res.success) {
        console.log("OTP verified successfully!");

        // Save tokens in Redux
        dispatch(setToken({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refereshToken
        }));
        console.log("Tokens stored in Redux:", res.data.accessToken, res.data.refereshToken);

        // Optional: also save in localStorage
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refereshToken);
        console.log("Tokens stored in localStorage");

        navigate('/admin/dashboard');
      } else {
        console.log("OTP verification failed:", res.message);
        setIsValid(false);
        dispatch(setError(res.message));
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setIsValid(false);
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setIsValid(true);
    inputs.current[0]?.focus();
    console.log("Resend OTP triggered");

    // Call resend OTP API if available
    alert('Resend OTP API not integrated (demo)');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          <div className="p-8 sm:p-10">
            <div className="text-center mb-9">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Verify Phone</h1>
              <p className="mt-3 text-gray-600">Enter the 6-digit code sent to</p>
              <p className="mt-1 font-medium text-gray-900">+91 {phone}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-center gap-3 sm:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputs.current[index] = el)}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`
                      w-12 h-14 sm:w-14 sm:h-16
                      text-center text-2xl font-bold
                      bg-white border ${isValid ? 'border-gray-300 focus:border-black' : 'border-red-500 focus:border-red-600'}
                      rounded-lg
                      focus:ring-2 focus:ring-black/20 focus:outline-none
                      transition-all duration-200
                    `}
                    disabled={loading}
                  />
                ))}
              </div>

              {!isValid && <p className="text-center text-sm text-red-600">{error || 'Please enter a valid 6-digit code'}</p>}

              <button
                type="submit"
                disabled={isSubmitting || otp.join('').length !== 6 || loading}
                className={`
                  w-full py-4 px-6
                  bg-black text-white
                  hover:bg-gray-800
                  font-semibold tracking-wide
                  rounded-xl
                  transition-all duration-300
                  hover:scale-[1.02]
                  focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 focus:ring-offset-white
                  disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed
                `}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-black font-medium hover:text-gray-700 transition-colors"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </p>
              <p className="mt-2 text-xs text-gray-500">Code expires in 5 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
