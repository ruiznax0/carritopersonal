import { Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { loginConGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <Home size={32} className="text-zinc-900" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Lista Hogar</h1>
        <p className="text-sm text-zinc-500 mb-10">
          Organiza las compras del hogar junto a tu pareja, en tiempo real.
        </p>

        {/* Google button */}
        <button
          onClick={loginConGoogle}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl font-semibold text-sm transition-colors active:scale-95"
        >
          {/* Google SVG icon */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continuar con Google
        </button>

        <p className="mt-6 text-[11px] text-zinc-600">
          Solo tú y quienes invites pueden ver tu lista.
        </p>
      </div>
    </div>
  );
}