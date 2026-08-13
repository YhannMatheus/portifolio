import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Nave from './game/Sheep';
import TerminalScreen from './game/Terminal';
import Cenario from './game/Cenario';
import Hud from './game/Hud';
import { ESTADO_JOGO, CONFIG } from '../config';

export default function Hero() {
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const iniciarJogo = () => {
    ESTADO_JOGO.distancia = 0;
    ESTADO_JOGO.pontos = 0; // Zera a pontuação
    ESTADO_JOGO.velocidadeAtual = CONFIG.mundo.velocidadeInicial;
    ESTADO_JOGO.gameOver = false;
    
    ESTADO_JOGO.tiros.forEach(tiro => tiro.ativo = false);
    
    setResetKey(chaveAntiga => chaveAntiga + 1);
    setJogoIniciado(true);
  };

  const abortarJogo = () => {
    setJogoIniciado(false);
  };

  return (
    <>
      {!jogoIniciado ? (
        <TerminalScreen onStartGame={iniciarJogo} />
      ) : (
        <div className="w-screen h-screen bg-[#050505] relative">
          
          <KeyboardControls
            map={[
              { name: 'frente', keys: ['ArrowUp', 'w', 'W'] },
              { name: 'tras', keys: ['ArrowDown', 's', 'S'] },
              { name: 'esquerda', keys: ['ArrowLeft', 'a', 'A'] },
              { name: 'direita', keys: ['ArrowRight', 'd', 'D'] },
              { name: 'atirar', keys: ['Space'] }, 
            ]}
          >
            <Canvas key={resetKey} camera={{ position: [0, 2, 7] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 10]} intensity={2} />
              
              <Cenario />
              <Nave />
              
              <Hud onRestart={iniciarJogo} onAbort={abortarJogo} />
              
            </Canvas>
          </KeyboardControls>
        </div>
      )}
    </>
  );
}