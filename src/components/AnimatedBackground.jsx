import React, { useEffect, useState } from 'react';

export default function AnimatedBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            setMousePosition({
                x: (e.clientX / innerWidth) - 0.5,
                y: (e.clientY / innerHeight) - 0.5,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Generate random particles for a more natural feel
    const particles = [
        // Circles - Set 1
        { type: 'circle', top: '10%', left: '15%', size: 'w-2 h-2', delay: '0s', duration: '4s', depth: 2 },
        { type: 'circle', top: '20%', right: '20%', size: 'w-3 h-3', delay: '1s', duration: '6s', depth: 1 },
        { type: 'circle', top: '40%', left: '10%', size: 'w-1.5 h-1.5', delay: '2s', duration: '5s', depth: 3 },
        { type: 'circle', top: '60%', right: '15%', size: 'w-2.5 h-2.5', delay: '0.5s', duration: '7s', depth: 1 },
        { type: 'circle', top: '80%', left: '25%', size: 'w-2 h-2', delay: '1.5s', duration: '5.5s', depth: 2 },
        { type: 'circle', top: '15%', right: '40%', size: 'w-1 h-1', delay: '3s', duration: '4.5s', depth: 4 },
        { type: 'circle', top: '35%', right: '10%', size: 'w-2 h-2', delay: '0.8s', duration: '6.5s', depth: 2 },
        { type: 'circle', top: '55%', left: '40%', size: 'w-1.5 h-1.5', delay: '2.5s', duration: '5s', depth: 3 },

        // Circles - Set 2
        { type: 'circle', top: '12%', left: '70%', size: 'w-2 h-2', delay: '0.5s', duration: '5s', depth: 2 },
        { type: 'circle', top: '30%', right: '45%', size: 'w-1.5 h-1.5', delay: '1.2s', duration: '6.5s', depth: 3 },
        { type: 'circle', top: '50%', left: '20%', size: 'w-2.5 h-2.5', delay: '2.3s', duration: '4.8s', depth: 1 },
        { type: 'circle', top: '70%', right: '30%', size: 'w-1 h-1', delay: '0.7s', duration: '7.2s', depth: 4 },
        { type: 'circle', top: '90%', left: '60%', size: 'w-2 h-2', delay: '1.8s', duration: '5.3s', depth: 2 },
        { type: 'circle', top: '25%', right: '60%', size: 'w-1.5 h-1.5', delay: '3.2s', duration: '4.2s', depth: 3 },
        { type: 'circle', top: '45%', right: '5%', size: 'w-2 h-2', delay: '0.9s', duration: '6.8s', depth: 1 },
        { type: 'circle', top: '65%', left: '50%', size: 'w-1 h-1', delay: '2.7s', duration: '5.5s', depth: 4 },

        // More Circles (Dust)
        { type: 'circle', top: '5%', left: '45%', size: 'w-1 h-1', delay: '1.2s', duration: '8s', depth: 5 },
        { type: 'circle', top: '95%', right: '35%', size: 'w-1.5 h-1.5', delay: '0.3s', duration: '7.5s', depth: 4 },
        { type: 'circle', top: '25%', left: '85%', size: 'w-1 h-1', delay: '2.8s', duration: '6s', depth: 5 },
        { type: 'circle', top: '75%', right: '55%', size: 'w-2 h-2', delay: '1.7s', duration: '5.2s', depth: 3 },
        { type: 'circle', top: '45%', left: '5%', size: 'w-1 h-1', delay: '3.5s', duration: '9s', depth: 5 },
        { type: 'circle', top: '85%', right: '5%', size: 'w-1.5 h-1.5', delay: '0.9s', duration: '6.8s', depth: 4 },

        // Additional Dust Particles
        { type: 'circle', top: '3%', left: '32%', size: 'w-1 h-1', delay: '0.4s', duration: '7.8s', depth: 5 },
        { type: 'circle', top: '17%', right: '8%', size: 'w-1 h-1', delay: '1.9s', duration: '8.2s', depth: 5 },
        { type: 'circle', top: '22%', left: '63%', size: 'w-1.5 h-1.5', delay: '2.1s', duration: '6.5s', depth: 4 },
        { type: 'circle', top: '38%', right: '72%', size: 'w-1 h-1', delay: '0.6s', duration: '7.3s', depth: 5 },
        { type: 'circle', top: '42%', left: '28%', size: 'w-1 h-1', delay: '3.2s', duration: '8.7s', depth: 5 },
        { type: 'circle', top: '56%', right: '48%', size: 'w-1.5 h-1.5', delay: '1.4s', duration: '6.9s', depth: 4 },
        { type: 'circle', top: '62%', left: '78%', size: 'w-1 h-1', delay: '2.6s', duration: '7.6s', depth: 5 },
        { type: 'circle', top: '72%', right: '17%', size: 'w-1 h-1', delay: '0.8s', duration: '8.4s', depth: 5 },
        { type: 'circle', top: '77%', left: '43%', size: 'w-1.5 h-1.5', delay: '3.8s', duration: '6.2s', depth: 4 },
        { type: 'circle', top: '88%', right: '67%', size: 'w-1 h-1', delay: '1.1s', duration: '7.9s', depth: 5 },
        { type: 'circle', top: '93%', left: '12%', size: 'w-1 h-1', delay: '2.4s', duration: '8.1s', depth: 5 },
        { type: 'circle', top: '97%', right: '82%', size: 'w-1.5 h-1.5', delay: '0.5s', duration: '6.7s', depth: 4 },
        { type: 'circle', top: '7%', left: '57%', size: 'w-1 h-1', delay: '3.7s', duration: '7.4s', depth: 5 },
        { type: 'circle', top: '13%', right: '27%', size: 'w-1 h-1', delay: '1.6s', duration: '8.6s', depth: 5 },
        { type: 'circle', top: '27%', left: '8%', size: 'w-1.5 h-1.5', delay: '2.9s', duration: '6.4s', depth: 4 },
        { type: 'circle', top: '33%', right: '53%', size: 'w-1 h-1', delay: '0.7s', duration: '7.7s', depth: 5 },
        { type: 'circle', top: '48%', left: '73%', size: 'w-1 h-1', delay: '3.3s', duration: '8.9s', depth: 5 },
        { type: 'circle', top: '53%', right: '23%', size: 'w-1.5 h-1.5', delay: '1.5s', duration: '6.1s', depth: 4 },
        { type: 'circle', top: '63%', left: '37%', size: 'w-1 h-1', delay: '2.7s', duration: '7.5s', depth: 5 },
        { type: 'circle', top: '68%', right: '63%', size: 'w-1 h-1', delay: '0.9s', duration: '8.3s', depth: 5 },
        { type: 'circle', top: '82%', left: '92%', size: 'w-1.5 h-1.5', delay: '3.9s', duration: '6.6s', depth: 4 },
        { type: 'circle', top: '87%', right: '33%', size: 'w-1 h-1', delay: '1.2s', duration: '7.1s', depth: 5 },


        // Christmas Snowflakes ❄️
        { type: 'text', content: '❄️', top: '8%', left: '22%', size: 'text-lg', delay: '0.2s', duration: '7s', depth: 2 },
        { type: 'text', content: '❄️', top: '18%', right: '12%', size: 'text-base', delay: '1.3s', duration: '8s', depth: 3 },
        { type: 'text', content: '❄️', top: '35%', left: '60%', size: 'text-xl', delay: '2.1s', duration: '6.5s', depth: 1 },
        { type: 'text', content: '❄️', top: '52%', right: '28%', size: 'text-sm', delay: '0.7s', duration: '9s', depth: 4 },
        { type: 'text', content: '❄️', top: '67%', left: '18%', size: 'text-base', delay: '1.9s', duration: '7.2s', depth: 2 },
        { type: 'text', content: '❄️', top: '82%', right: '42%', size: 'text-lg', delay: '3.1s', duration: '8.5s', depth: 3 },
        { type: 'text', content: '❄️', top: '14%', left: '75%', size: 'text-sm', delay: '0.5s', duration: '6.8s', depth: 4 },
        { type: 'text', content: '❄️', top: '92%', left: '35%', size: 'text-base', delay: '2.6s', duration: '7.8s', depth: 2 },
        { type: 'text', content: '❄️', top: '43%', right: '8%', size: 'text-lg', delay: '1.1s', duration: '8.2s', depth: 1 },
        { type: 'text', content: '❄️', top: '61%', left: '88%', size: 'text-xl', delay: '3.4s', duration: '6.3s', depth: 3 },

        // Christmas Trees 🎄
        { type: 'text', content: '🎄', top: '12%', left: '38%', size: 'text-base', delay: '0.8s', duration: '8s', depth: 2 },
        { type: 'text', content: '🎄', top: '32%', right: '22%', size: 'text-lg', delay: '2.3s', duration: '7.5s', depth: 3 },
        { type: 'text', content: '🎄', top: '58%', left: '12%', size: 'text-sm', delay: '1.4s', duration: '9s', depth: 1 },
        { type: 'text', content: '🎄', top: '78%', right: '68%', size: 'text-base', delay: '3.7s', duration: '6.8s', depth: 4 },
        { type: 'text', content: '🎄', top: '24%', left: '92%', size: 'text-lg', delay: '0.9s', duration: '8.3s', depth: 2 },

        // Christmas Ornaments & Gifts 🎁
        { type: 'text', content: '🎁', top: '19%', left: '48%', size: 'text-base', delay: '1.6s', duration: '7.8s', depth: 3 },
        { type: 'text', content: '🎁', top: '47%', right: '18%', size: 'text-sm', delay: '0.4s', duration: '8.7s', depth: 2 },
        { type: 'text', content: '🎁', top: '71%', left: '68%', size: 'text-base', delay: '2.9s', duration: '6.9s', depth: 1 },
        { type: 'text', content: '🎁', top: '86%', right: '52%', size: 'text-lg', delay: '1.7s', duration: '7.4s', depth: 4 },

        // Christmas Candy Canes & Bells 🔔
        { type: 'text', content: '🔔', top: '28%', left: '28%', size: 'text-sm', delay: '0.6s', duration: '8.1s', depth: 2 },
        { type: 'text', content: '🔔', top: '54%', right: '38%', size: 'text-base', delay: '2.4s', duration: '7.3s', depth: 3 },
        { type: 'text', content: '🔔', top: '73%', left: '42%', size: 'text-sm', delay: '1.2s', duration: '8.6s', depth: 1 },

        // Hearts
        { type: 'text', content: '♥', top: '18%', left: '25%', size: 'text-sm', delay: '0.3s', duration: '5s', depth: 2 },
        { type: 'text', content: '♥', top: '42%', right: '25%', size: 'text-base', delay: '1.5s', duration: '6s', depth: 1 },
        { type: 'text', content: '♥', top: '68%', left: '45%', size: 'text-sm', delay: '2.5s', duration: '5.5s', depth: 3 },
        { type: 'text', content: '♥', top: '88%', right: '35%', size: 'text-base', delay: '0.8s', duration: '7s', depth: 1 },

        // Stars
        { type: 'text', content: '★', top: '8%', right: '15%', size: 'text-base', delay: '0.6s', duration: '6.5s', depth: 2 },
        { type: 'text', content: '★', top: '28%', left: '20%', size: 'text-sm', delay: '1.8s', duration: '5.8s', depth: 3 },
        { type: 'text', content: '★', top: '48%', right: '35%', size: 'text-base', delay: '3.2s', duration: '7.2s', depth: 1 },
        { type: 'text', content: '★', top: '72%', left: '30%', size: 'text-sm', delay: '0.9s', duration: '6.2s', depth: 4 },

        // Sparkles
        { type: 'text', content: '✨', top: '14%', left: '55%', size: 'text-sm', delay: '0.4s', duration: '4.8s', depth: 2 },
        { type: 'text', content: '✨', top: '52%', right: '40%', size: 'text-base', delay: '2.2s', duration: '6.8s', depth: 1 },
        { type: 'text', content: '✨', top: '78%', left: '50%', size: 'text-sm', delay: '1.1s', duration: '5.5s', depth: 3 },

        // Extra Particles to reach 100+ count
        { type: 'text', content: '❄️', top: '5%', right: '45%', size: 'text-sm', delay: '0.8s', duration: '7.5s', depth: 5 },
        { type: 'text', content: '❄️', top: '95%', left: '55%', size: 'text-xs', delay: '2.2s', duration: '8.5s', depth: 4 },
        { type: 'text', content: '★', top: '15%', right: '85%', size: 'text-xs', delay: '1.4s', duration: '6.2s', depth: 5 },
        { type: 'text', content: '★', top: '85%', left: '15%', size: 'text-sm', delay: '3.6s', duration: '7.8s', depth: 3 },
        { type: 'circle', top: '40%', left: '95%', size: 'w-1 h-1', delay: '0.5s', duration: '9.2s', depth: 5 },
        { type: 'circle', top: '60%', right: '95%', size: 'w-1.5 h-1.5', delay: '1.9s', duration: '8.1s', depth: 4 },
        { type: 'text', content: '✨', top: '30%', left: '5%', size: 'text-xs', delay: '2.5s', duration: '5.9s', depth: 2 },
        { type: 'text', content: '✨', top: '70%', right: '5%', size: 'text-sm', delay: '1.2s', duration: '6.4s', depth: 3 },
        { type: 'text', content: '❄️', top: '10%', left: '50%', size: 'text-xs', delay: '3.1s', duration: '7.1s', depth: 5 },
        { type: 'text', content: '❄️', top: '90%', right: '50%', size: 'text-sm', delay: '0.9s', duration: '8.3s', depth: 4 },
        { type: 'circle', top: '50%', left: '50%', size: 'w-0.5 h-0.5', delay: '2.8s', duration: '9.5s', depth: 1 },
        { type: 'circle', top: '20%', right: '30%', size: 'w-1 h-1', delay: '1.5s', duration: '7.6s', depth: 2 },
        { type: 'text', content: '★', top: '65%', left: '10%', size: 'text-xs', delay: '3.3s', duration: '6.9s', depth: 5 },
        { type: 'text', content: '★', top: '35%', right: '90%', size: 'text-sm', delay: '0.7s', duration: '7.4s', depth: 3 },
        { type: 'text', content: '🎁', top: '5%', left: '5%', size: 'text-xs', delay: '2.1s', duration: '8.8s', depth: 4 },
        { type: 'text', content: '🎄', top: '95%', right: '5%', size: 'text-xs', delay: '1.3s', duration: '9.1s', depth: 5 },
        { type: 'circle', top: '80%', left: '80%', size: 'w-1 h-1', delay: '2.6s', duration: '6.7s', depth: 2 },
        { type: 'circle', top: '10%', right: '10%', size: 'w-1.5 h-1.5', delay: '0.4s', duration: '7.9s', depth: 3 },
        { type: 'text', content: '❄️', top: '45%', left: '35%', size: 'text-xs', delay: '3.5s', duration: '8.4s', depth: 5 },
        { type: 'text', content: '❄️', top: '55%', right: '65%', size: 'text-sm', delay: '1.8s', duration: '7.2s', depth: 4 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            {/* CSS for floating animation */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-15px) translateX(10px) rotate(5deg); }
          50% { transform: translateY(0) translateX(20px) rotate(10deg); }
          75% { transform: translateY(15px) translateX(10px) rotate(5deg); }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>

            {particles.map((p, i) => (
                <div
                    key={i}
                    className={`absolute animate-float ${p.type === 'circle'
                        ? `rounded-full bg-primary/60 dark:bg-primary/50`
                        : `text-primary/60 dark:text-primary/50 font-bold`
                        } ${p.size}`}
                    style={{
                        top: p.top,
                        left: p.left,
                        right: p.right,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                        transform: `translate(${mousePosition.x * p.depth * 20}px, ${mousePosition.y * p.depth * 20}px)`,
                        transition: 'transform 0.2s ease-out'
                    }}
                >
                    {p.content}
                </div>
            ))}
        </div>
    );
}
