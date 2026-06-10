import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, ArrowLeft, AlertCircle, CheckCircle, Sprout, Loader } from 'lucide-react';
import Button from '../components/common/Button';
import { APP_NAME, ROUTES } from '../constants';
import api from '../services/api';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get('email') || '';
  const [email] = useState(emailFromParams);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const otpRef = useRef('');

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Auto-fill & auto-verify OTP from sessionStorage after 3 seconds
  useEffect(() => {
    const pendingOtp = sessionStorage.getItem('pending_otp');
    if (!pendingOtp || pendingOtp.length !== 6) return;

    const timer = setTimeout(async () => {
      otpRef.current = pendingOtp;
      const digits = pendingOtp.split('');
      digits.forEach((digit, i) => {
        setTimeout(() => {
          setOtp((prev) => {
            const next = [...prev];
            next[i] = digit;
            return next;
          });
        }, i * 100);
      });

      // Auto-verify after all digits are shown
      setTimeout(async () => {
        const uid = sessionStorage.getItem('pending_user_id');
        if (!uid) { setError('Session expired, please login again'); setLoading(false); return; }
        setLoading(true);
        try {
          const res = await api.auth.verifyOtp(uid, pendingOtp);
          if (res.token) localStorage.setItem('token', res.token);
          if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
          setSuccess(true);
          setTimeout(() => navigate(ROUTES.DASHBOARD), 1000);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
          sessionStorage.removeItem('pending_otp');
          sessionStorage.removeItem('pending_user_id');
        }
      }, digits.length * 100 + 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    otpRef.current = newOtp.join('');
    setError('');
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otpRef.current || otp.join('');
    if (code.length !== 6) { setError('Please enter all 6 digits'); return; }
    if (!email.trim()) { setError('Email is required'); return; }

    setLoading(true);
    setError('');
    try {
      const uid = sessionStorage.getItem('pending_user_id');
      if (!uid) { setError('Session expired, please login again'); setLoading(false); return; }
      const res = await api.auth.verifyOtp(uid, code);
      if (res.token) localStorage.setItem('token', res.token);
      if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.DASHBOARD), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      const res = await api.auth.login(email);
      if (res?.otp) sessionStorage.setItem('pending_otp', res.otp);
      setTimer(30);
    } catch {} finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      
        <div className="glass rounded-2xl mt-10 p-6 lg:p-8">
            <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{APP_NAME}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Verify your email address</p>
        </div>

          {success ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Verified successfully!</p>
              <p className="text-xs text-gray-500 mt-1">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center">
                <Shield className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{email || 'your email'}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  OTP Code
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 text-center text-lg font-bold rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-gray-900 dark:text-white transition-all duration-200"
                    />
                  ))}
                </div>
                {error && <p className="flex items-center justify-center gap-1 mt-2 text-xs text-red-500"><AlertCircle size={12} />{error}</p>}
              </div>

              <Button type="submit" disabled={loading} className="w-full justify-center">
                {loading ? <Loader size={16} className="animate-spin" /> : null}
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0 || resending}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
                >
                  {resending ? 'Resending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </button>
              </div>

              <div className="text-center pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={12} /> Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
