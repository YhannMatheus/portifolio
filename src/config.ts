export const CONFIG = {
  nave: {
    velocidade: 20,             
    suavizacaoMovimento: 0.15, 
    suavizacaoInclinacao: 0.1, 
    limiteX: 6,                
    limiteY: 3.5,              
  },
  mundo: {
    velocidadeInicial: 15,     
    aceleracao: 1.5,           
  },
  meteoros: {
    quantidadeInicial: 15,     
    quantidadeMaxima: 80,      
    taxaDeAumentoMs: 1000,     
  },
  colisao: {
    raioNave: 0.8,
  },
  arma: {
    cooldown: 0.25, 
    velocidade: 40, 
  }
};

export const ESTADO_JOGO = {
  distancia: 0,
  pontos: 0,
  velocidadeAtual: CONFIG.mundo.velocidadeInicial,
  gameOver: false,
  posicaoNave: { x: 0, y: 0 }, 
  tiros: Array.from({ length: 10 }, () => ({ x: 0, y: 0, z: 0, ativo: false }))
};