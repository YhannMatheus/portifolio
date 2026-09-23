import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, ESTADO_JOGO } from '../../config';

const CAMERA_Z_PADRAO = 7;
const CAMERA_Z_MAXIMO = 13;
const MEIA_LARGURA_MINIMA = 4.5; // Área horizontal que queremos enxergar no plano da nave
const MARGEM_NAVE = 1;

// Em telas estreitas (celular em pé) afasta a câmera e reduz a área de voo
// para a nave nunca sair da tela.
export default function AjusteCamera() {
  const get = useThree((state) => state.get);
  const { width, height } = useThree((state) => state.size);

  useEffect(() => {
    const camera = get().camera as THREE.PerspectiveCamera;
    const aspecto = width / height;
    const tanMeioFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

    const zIdeal = (MEIA_LARGURA_MINIMA + MARGEM_NAVE) / (tanMeioFov * aspecto);
    const z = THREE.MathUtils.clamp(zIdeal, CAMERA_Z_PADRAO, CAMERA_Z_MAXIMO);
    camera.position.z = z;

    const meiaLarguraVisivel = tanMeioFov * z * aspecto;
    ESTADO_JOGO.limites.x = Math.min(CONFIG.nave.limiteX, meiaLarguraVisivel - MARGEM_NAVE);
  }, [get, width, height]);

  return null;
}
