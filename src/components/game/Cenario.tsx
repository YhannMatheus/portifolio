import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CONFIG, ESTADO_JOGO } from '../../config';

function Tiro({ index }: { index: number }) {
  const tiroRef = useRef<THREE.Mesh>(null!);

  useFrame((_state, delta) => {
    const dadosTiro = ESTADO_JOGO.tiros[index];
    
    if (!dadosTiro.ativo) {
      tiroRef.current.visible = false;
      return;
    }

    tiroRef.current.visible = true;
    dadosTiro.z -= CONFIG.arma.velocidade * delta;
    tiroRef.current.position.set(dadosTiro.x, dadosTiro.y, dadosTiro.z);

    if (dadosTiro.z < -60) dadosTiro.ativo = false; 
  });

  return (
    <mesh ref={tiroRef} visible={false} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 1]} />
      <meshBasicMaterial color="#03e43f" />
    </mesh>
  );
}

function Meteoro() {
  const meteoroRef = useRef<THREE.Mesh>(null!);
  
  const [{ tamanho, posX, posY, posZ }] = useState(() => ({
    tamanho: Math.random() * 0.8 + 0.3,
    posX: (Math.random() - 0.5) * 20,
    posY: (Math.random() - 0.5) * 15,
    posZ: -Math.random() * 100 - 30 
  }));
  
  const resetarPosicao = () => {
    if (!meteoroRef.current) return;
    meteoroRef.current.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 15,
      -Math.random() * 50 - 50 
    );
  };

  useFrame((_state, delta) => {
    if (!meteoroRef.current || ESTADO_JOGO.gameOver) return;

    meteoroRef.current.position.z += ESTADO_JOGO.velocidadeAtual * delta;
    meteoroRef.current.rotation.x += delta;
    meteoroRef.current.rotation.y += delta;

    const mx = meteoroRef.current.position.x;
    const my = meteoroRef.current.position.y;
    const mz = meteoroRef.current.position.z;

    if (mz > -1 && mz < 1) {
      const distNave = Math.sqrt(
        Math.pow(mx - ESTADO_JOGO.posicaoNave.x, 2) + Math.pow(my - ESTADO_JOGO.posicaoNave.y, 2)
      );
      if (distNave < (CONFIG.colisao.raioNave + tamanho)) {
        ESTADO_JOGO.gameOver = true;
      }
    }

    for (const tiro of ESTADO_JOGO.tiros) {
      if (!tiro.ativo) continue;
      
      if (Math.abs(tiro.z - mz) < 2) {
        const distTiro = Math.sqrt(Math.pow(tiro.x - mx, 2) + Math.pow(tiro.y - my, 2));
        
        if (distTiro < tamanho + 0.3) {
          tiro.ativo = false; 
          resetarPosicao();   
          
          // MUDANÇA AQUI: Destruir asteroide dá pontos agora
          ESTADO_JOGO.pontos += 100; 
          break; 
        }
      }
    }

    if (meteoroRef.current.position.z > 5) resetarPosicao();
  });

  return (
    <mesh ref={meteoroRef} position={[posX, posY, posZ]}>
      <dodecahedronGeometry args={[tamanho, 0]} />
      <meshStandardMaterial color="#f1950a" wireframe={true} />
    </mesh>
  );
}

export default function Cenario() {
  const [qtdMeteoros, setQtdMeteoros] = useState(CONFIG.meteoros.quantidadeInicial);

  useFrame((_state, delta) => {
    if (ESTADO_JOGO.gameOver) return;
    ESTADO_JOGO.velocidadeAtual += delta * CONFIG.mundo.aceleracao;
    ESTADO_JOGO.distancia += ESTADO_JOGO.velocidadeAtual * delta;
  });

  useEffect(() => {
    const intervalo = setInterval(() => {
      setQtdMeteoros((qtdAtual) => {
        if (qtdAtual < CONFIG.meteoros.quantidadeMaxima) return qtdAtual + 1;
        return qtdAtual;
      });
    }, CONFIG.meteoros.taxaDeAumentoMs);

    return () => clearInterval(intervalo);
  }, []);

  const frotaDeMeteoros = Array.from({ length: qtdMeteoros });

  return (
    <>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {frotaDeMeteoros.map((_, index) => (
        <Meteoro key={`meteoro-${index}`} />
      ))}

      {ESTADO_JOGO.tiros.map((_, index) => (
        <Tiro key={`tiro-${index}`} index={index} />
      ))}
    </>
  );
}