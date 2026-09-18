function Login() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        <div className="bg-slate-900/90 border border-slate-700/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-2xl font-bold text-white">
                AI
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              AI Attendance
            </h1>

            <p className="text-slate-400 mt-2 text-sm">
              Smart & Secure Attendance Management
            </p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>

              <button className="text-sm text-blue-400 hover:text-blue-300 transition">
                Forgot Password?
              </button>
            </div>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Login Button */}
          <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
            Sign In
          </button>

          {/* Roles */}
          <div className="mt-7 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              Secure access for
            </p>

            <p className="text-sm text-slate-300 mt-1">
              Admin • Teacher • Student
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          © 2026 AI Attendance System
        </p>

      </div>
    </div>
  );
}

export default Login;