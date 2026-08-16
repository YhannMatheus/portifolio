import { useState, useEffect } from 'react';

interface TerminalScreenProps {
  onStartGame: () => void;
}

export default function TerminalScreen({ onStartGame }: TerminalScreenProps) {
  const mensagem = "olá, sou yhann. estou fazendo esse site ainda... mas para você não ficar entediado, experimente a simulação abaixo.";
  const [textoExibido, setTextoExibido] = useState("");
  const [digitacaoTerminou, setDigitacaoTerminou] = useState(false);

  useEffect(() => {
    let index = 0;
    const intervalo = setInterval(() => {
      setTextoExibido(mensagem.substring(0, index + 1));
      index++;
      if (index === mensagem.length) {
        clearInterval(intervalo);
        setDigitacaoTerminou(true);
      }
    }, 60); 
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#050505] text-[#03e43f] font-mono p-4">
      <div className="text-2xl font-mono mb-4">
        Bem Vindo
      </div>
      <div className="max-w-2xl text-xl md:text-2xl min-h-25 text-center mb-8">
        {textoExibido}
        <span className="animate-pulse">_</span>
      </div>
      {digitacaoTerminou && (
        <button
          onClick={onStartGame}
          className="px-8 py-3 border-2 border-[#03e43f] text-[#03e43f] font-bold uppercase tracking-widest hover:bg-[#03e43f] hover:text-[#050505] transition-all duration-300"
        >
          Iniciar Simulação
        </button>
      )}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
        <a href="mailto:yhann.mendes@outlook.com" className="text-sm text-[#03e43f]">
          yhann.mendes@outlook.com
        </a>
        <a href="mailto:yhann.mendes@icen.ufpa.br" className="mx-4 text-sm text-[#03e43f]">
          yhann.mendes@icen.ufpa.br
        </a>

        <a href="https://github.com/YhannMatheus" className="text-sm text-[#03e43f]">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/yhannmatheus/" className="text-sm text-[#03e43f]">
          LinkedIn
        </a>
      </div>
    </div>
  );
}