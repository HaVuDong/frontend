"use client";

/**
 * AnimatedBackground Component
 * Reusable animated blob background with hydration fix
 */
export default function AnimatedBackground({ 
  colors = ['emerald', 'blue', 'purple'],
  opacity = '20'
}) {
  return (
    <>
      <div 
        className={`absolute top-0 left-0 w-72 h-72 bg-${colors[0]}-300 rounded-full mix-blend-multiply filter blur-3xl opacity-${opacity} animate-blob`}
        suppressHydrationWarning
      />
      <div 
        className={`absolute top-0 right-0 w-72 h-72 bg-${colors[1]}-300 rounded-full mix-blend-multiply filter blur-3xl opacity-${opacity} animate-blob animation-delay-2000`}
        suppressHydrationWarning
      />
      <div 
        className={`absolute -bottom-8 left-20 w-72 h-72 bg-${colors[2]}-300 rounded-full mix-blend-multiply filter blur-3xl opacity-${opacity} animate-blob animation-delay-4000`}
        suppressHydrationWarning
      />
      
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </>
  );
}
