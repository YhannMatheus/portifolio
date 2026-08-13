import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ESTADO_JOGO } from '../../config';

interface HudProps {
  onRestart: () => void;
  onAbort: () => void;
}

export default function Hud({ onRestart, onAbort }: HudProps) {
  const distanciaRef = useRef<HTMLDivElement>(null!);
  const velocidadeRef = useRef<HTMLDivElement>(null!);
  const pontosRef = useRef<HTMLDivElement>(null!);
  
  const [isGameOver, setIsGameOver] = useState(false);
  const [recordeDistancia, setRecordeDistancia] = useState(0);

  useFrame(() => {
    if (ESTADO_JOGO.gameOver && !isGameOver) {
      setIsGameOver(true);
      
      const recordeSalvo = localStorage.getItem('starfox_recorde_dist');
      const atualDistancia = Math.floor(ESTADO_JOGO.distancia);
      let melhorDistancia = recordeSalvo ? parseInt(recordeSalvo) : 0;
      
      if (atualDistancia > melhorDistancia) {
        melhorDistancia = atualDistancia;
        localStorage.setItem('starfox_recorde_dist', melhorDistancia.toString());
      }
      setRecordeDistancia(melhorDistancia);
    }

    if (distanciaRef.current) {
      const distFormatada = Math.floor(ESTADO_JOGO.distancia).toString().padStart(5, '0');
      distanciaRef.current.innerText = `DISTÂNCIA: ${distFormatada} M`;
    }

    if (velocidadeRef.current) {
      const velFormatada = Math.floor(ESTADO_JOGO.velocidadeAtual * 10).toString().padStart(3, '0');
      velocidadeRef.current.innerText = `VELOCIDADE: ${velFormatada} KM/H`;
    }

    if (pontosRef.current) {
      const ptsFormatado = ESTADO_JOGO.pontos.toString().padStart(5, '0');
      pontosRef.current.innerText = `PONTOS: ${ptsFormatado}`;
    }
  });

  return (
    <Html fullscreen>
      {!isGameOver && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none text-[#03e43f] font-mono text-sm md:text-base tracking-wider bg-black/40 border border-[#03e43f]/50 px-6 py-2 rounded-sm backdrop-blur-sm">
          <span>[W A S D] / [SETAS] : MOVER NAVE</span>
          <span className="opacity-50">|</span>
          <span>[ESPAÇO] : ATIRAR</span>
        </div>
      )}

      {!isGameOver && (
        <button
          onClick={onAbort}
          className="absolute top-4 left-4 z-10 text-[#03e43f]/50 hover:text-[#03e43f] font-mono text-sm pointer-events-auto transition-colors"
        >
          {'< ABORTAR'}
        </button>
      )}

      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row justify-between pointer-events-none text-[#03e43f] font-mono text-lg md:text-xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(3,228,63,0.8)]">
        <div ref={distanciaRef}>DISTÂNCIA: 00000 M</div>
        <div ref={pontosRef} className="text-center md:absolute md:left-1/2 md:-translate-x-1/2 text-[#f1950a] drop-shadow-[0_0_8px_rgba(241,149,10,0.8)]">PONTOS: 00000</div>
        <div ref={velocidadeRef} className="text-right">VELOCIDADE: 000 KM/H</div>
      </div>

      {isGameOver && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-[#03e43f] font-mono pointer-events-auto transition-opacity duration-1000 z-50">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-widest">
            FALHA CRÍTICA
          </h1>
          
          <div className="text-center mb-10 bg-[#050505] border border-[#03e43f] p-8 rounded-sm shadow-[0_0_20px_rgba(3,228,63,0.15)] flex flex-col gap-3 min-w-[300px]">
             <p className="text-xl">DISTÂNCIA: <span className="text-white font-bold">{Math.floor(ESTADO_JOGO.distancia)} M</span></p>
             <p className="text-xl">PONTOS DE COMBATE: <span className="text-[#f1950a] font-bold">{ESTADO_JOGO.pontos}</span></p>
             <hr className="border-[#03e43f]/30 my-2" />
             <p className="text-sm text-[#03e43f]/70">RECORDE DE DISTÂNCIA: {recordeDistancia} M</p>
          </div>

          <div className="flex gap-6 flex-col md:flex-row">
            <button 
              onClick={onRestart} 
              className="px-10 py-3 bg-[#03e43f]/10 border-2 border-[#03e43f] text-[#03e43f] font-bold uppercase tracking-widest hover:bg-[#03e43f] hover:text-[#050505] transition-all"
            >
              Reiniciar
            </button>
            <button 
              onClick={onAbort} 
              className="px-10 py-3 bg-red-500/10 border-2 border-red-500 text-red-500 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-[#050505] transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </Html>
  );
}