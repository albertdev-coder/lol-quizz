'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, BookOpen, Trophy, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: BookOpen,
      title: 'Aprende Jugando',
      description: 'Preguntas diseñadas para todos los niveles',
      gradient: 'bg-gradient-blue-cyan',
    },
    {
      icon: Trophy,
      title: 'Desafía tu Mente',
      description: 'Mejora tus conocimientos de ciencia',
      gradient: 'bg-gradient-yellow-orange',
    },
    {
      icon: TrendingUp,
      title: 'Progresa a tu Ritmo',
      description: 'Avanza desde nivel niño hasta adulto',
      gradient: 'bg-gradient-purple-pink',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos animados */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-purple-pink rounded-full opacity-20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-blue-cyan rounded-full opacity-20 blur-3xl"
      />

      <div className="max-w-6xl w-full relative z-10">
        {/* Header con logo y título */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-purple-pink-strong p-6 rounded-full shadow-2xl">
              <Sparkles className="w-20 h-20 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient-purple-pink-orange">
            Quiz Ciencia
          </h1>
          
          <p className="text-xl md:text-2xl font-medium mb-8" style={{ color: 'var(--color-gray-700)' }}>
            ¡Descubre cuánto sabes de ciencia de forma divertida! 🚀
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() => router.push('/quiz')}
              size="lg"
              className="bg-gradient-purple-pink-strong hover:opacity-90 text-white font-bold text-2xl px-12 py-8 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
            >
              ¡Jugar Ahora! 🎮
            </Button>
          </motion.div>
        </motion.div>

        {/* Tarjetas de características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white" style={{ borderWidth: '4px', borderColor: 'var(--color-purple-light)' }}>
                  <div className={`w-16 h-16 rounded-full ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-gray-800)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--color-gray-600)' }}>
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card 
            className="p-8 rounded-3xl bg-gradient-yellow-orange shadow-xl" 
            style={{ borderWidth: '4px', borderColor: 'var(--color-yellow-light)' }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-gray-800)' }}>
              📚 30 Preguntas de Ciencia
            </h3>
            <p className="text-lg" style={{ color: 'var(--color-gray-700)' }}>
              Explora temas de astronomía, biología, física, química y más.
              Elige tu nivel: Niño, Joven, Adulto o prueba el modo Mixto.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
