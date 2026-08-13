import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { CONFIG, ESTADO_JOGO } from '../../config'; 

export default function Nave() {
  const naveRef = useRef<THREE.Mesh>(null!);
  const [, getTeclas] = useKeyboardControls();
  const velocidade = CONFIG.nave.velocidade;
  
  const cooldownRef = useRef(0); 

  useFrame((_state, delta) => {
    if (!naveRef.current || ESTADO_JOGO.gameOver) return;

    const { frente, tras, esquerda, direita, atirar } = getTeclas();

    let alvoX = naveRef.current.position.x;
    let alvoY = naveRef.current.position.y;

    if (esquerda) alvoX -= velocidade * delta;
    if (direita) alvoX += velocidade * delta;
    if (frente) alvoY += velocidade * delta;
    if (tras) alvoY -= velocidade * delta;

    alvoX = THREE.MathUtils.clamp(alvoX, -CONFIG.nave.limiteX, CONFIG.nave.limiteX);
    alvoY = THREE.MathUtils.clamp(alvoY, -CONFIG.nave.limiteY, CONFIG.nave.limiteY);

    naveRef.current.position.x = THREE.MathUtils.lerp(naveRef.current.position.x, alvoX, CONFIG.nave.suavizacaoMovimento);
    naveRef.current.position.y = THREE.MathUtils.lerp(naveRef.current.position.y, alvoY, CONFIG.nave.suavizacaoMovimento);

    let inclinarPara = 0;
    if (direita) inclinarPara = Math.PI / 4;
    if (esquerda) inclinarPara = -Math.PI / 4;
    
    naveRef.current.rotation.y = THREE.MathUtils.lerp(naveRef.current.rotation.y, inclinarPara, CONFIG.nave.suavizacaoInclinacao);

    ESTADO_JOGO.posicaoNave.x = naveRef.current.position.x;
    ESTADO_JOGO.posicaoNave.y = naveRef.current.position.y;

    // LÓGICA DO DISPARO
    cooldownRef.current -= delta;
    if (atirar && cooldownRef.current <= 0) {
      cooldownRef.current = CONFIG.arma.cooldown;
      
      const tiroLivre = ESTADO_JOGO.tiros.find(t => !t.ativo);
      if (tiroLivre) {
        tiroLivre.ativo = true;
        tiroLivre.x = naveRef.current.position.x;
        tiroLivre.y = naveRef.current.position.y;
        tiroLivre.z = naveRef.current.position.z;
      }
    }
  });

  return (
    <mesh ref={naveRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <coneGeometry args={[1, 2, 4]} />
      <meshStandardMaterial color="#03e43f" wireframe={true} />
    </mesh>
  );
}