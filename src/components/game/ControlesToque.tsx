import { useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';
import { ESTADO_JOGO } from '../../config';

const RAIO_JOYSTICK = 50;
const ZONA_MORTA = 0.1;

function zerarControle() {
  ESTADO_JOGO.controle.x = 0;
  ESTADO_JOGO.controle.y = 0;
  ESTADO_JOGO.controle.atirar = false;
}

export default function ControlesToque() {
  const baseRef = useRef<HTMLDivElement>(null!);
  const maneteRef = useRef<HTMLDivElement>(null!);
  const botaoRef = useRef<HTMLButtonElement>(null!);
  const ponteiroJoystick = useRef<number | null>(null);

  useEffect(() => zerarControle, []);

  const moverManete = (e: PointerEvent) => {
    if (e.pointerId !== ponteiroJoystick.current) return;

    const rect = baseRef.current.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const distancia = Math.hypot(dx, dy);
    if (distancia > RAIO_JOYSTICK) {
      dx = (dx / distancia) * RAIO_JOYSTICK;
      dy = (dy / distancia) * RAIO_JOYSTICK;
    }

    maneteRef.current.style.transform = `translate(${dx}px, ${dy}px)`;

    const eixoX = dx / RAIO_JOYSTICK;
    const eixoY = -dy / RAIO_JOYSTICK;
    ESTADO_JOGO.controle.x = Math.abs(eixoX) > ZONA_MORTA ? eixoX : 0;
    ESTADO_JOGO.controle.y = Math.abs(eixoY) > ZONA_MORTA ? eixoY : 0;
  };

  const iniciarJoystick = (e: PointerEvent<HTMLDivElement>) => {
    ponteiroJoystick.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    moverManete(e);
  };

  const soltarJoystick = (e: PointerEvent) => {
    if (e.pointerId !== ponteiroJoystick.current) return;
    ponteiroJoystick.current = null;
    maneteRef.current.style.transform = 'translate(0px, 0px)';
    ESTADO_JOGO.controle.x = 0;
    ESTADO_JOGO.controle.y = 0;
  };

  const definirDisparo = (atirando: boolean) => {
    ESTADO_JOGO.controle.atirar = atirando;
    botaoRef.current.style.backgroundColor = atirando ? 'rgba(3, 228, 63, 0.4)' : '';
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        ref={baseRef}
        onPointerDown={iniciarJoystick}
        onPointerMove={moverManete}
        onPointerUp={soltarJoystick}
        onPointerCancel={soltarJoystick}
        className="absolute left-6 bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] w-32 h-32 rounded-full border-2 border-[#03e43f]/50 bg-[#03e43f]/5 flex items-center justify-center pointer-events-auto touch-none"
      >
        <div
          ref={maneteRef}
          className="w-14 h-14 rounded-full bg-[#03e43f]/30 border-2 border-[#03e43f] shadow-[0_0_12px_rgba(3,228,63,0.6)]"
        />
      </div>

      <button
        ref={botaoRef}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          definirDisparo(true);
        }}
        onPointerUp={() => definirDisparo(false)}
        onPointerCancel={() => definirDisparo(false)}
        className="absolute right-6 bottom-[calc(env(safe-area-inset-bottom)+2.5rem)] w-24 h-24 rounded-full border-2 border-[#03e43f] bg-[#03e43f]/10 text-[#03e43f] font-mono font-bold tracking-widest pointer-events-auto touch-none shadow-[0_0_12px_rgba(3,228,63,0.4)]"
      >
        FOGO
      </button>
    </div>
  );
}
