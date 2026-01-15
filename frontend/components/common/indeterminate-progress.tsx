import React from 'react';

export default function IndeterminateProgress() {
  return (
    <div className="relative w-full h-0.5 overflow-hidden bg-foreground/20 rounded">
      <div className={`bg-foreground absolute left-[-40%] top-0 h-full w-2/5 animate-slide`} style={{ animationDuration: '1.5s' }} />
      <style jsx>{`
        @keyframes slide {
          0% {
            left: -40%;
            width: 40%;
          }
          50% {
            left: 20%;
            width: 60%;
          }
          100% {
            left: 100%;
            width: 40%;
          }
        }
        .animate-slide {
          animation-name: slide;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
