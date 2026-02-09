// src/components/auth/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, verifyOTP } from '../../api'; // adjust path

const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [pendingId, setPendingId] = useState(null); // renamed from userId
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_id: '',
    phone_number: '',
    password: ''
  });

  // OTP
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await register(formData);
      setPendingId(data.pending_id); // ← changed from user_id
      setSuccess('Registration successful! Check your email for OTP.');
      setStep(2);
    } catch (err) {
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        'Registration failed. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await verifyOTP({ pending_id: pendingId, otp });

      // Store tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      setSuccess('Account verified! Redirecting...');

      setTimeout(() => {
        navigate('/profile'); // or '/' or login page
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

const handleResend = async () => {
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const { data } = await register(formData); // re-register to get new OTP
    setPendingId(data.pending_id);
    setSuccess('New OTP sent! Check your email.');
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to resend OTP. Try registering again.');
    setStep(1);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {step === 1 ? 'Create Account' : 'Verify Your Email'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {step === 1
              ? 'Sign up with your CSEKU email'
              : 'Enter the 6-digit OTP sent to your email'}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {/* Step 1: Registration */}
        {step === 1 && (
          <form onSubmit={handleRegister} className="mt-8 space-y-6">
            <div className="space-y-4">
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (must end with @cseku.ac.bd)"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="student_id"
                type="text"
                value={formData.student_id}
                onChange={handleChange}
                placeholder="Student ID"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 font-medium rounded-lg text-white transition-colors ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Submitting...' : 'Sign Up'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setOtp(val.slice(0, 6));
                }}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className={`w-full py-3 px-4 font-medium rounded-lg text-white transition-colors ${
                loading || otp.length !== 6 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Didn't receive OTP?
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                Didn't receive OTP?
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="ml-1 text-blue-600 hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;