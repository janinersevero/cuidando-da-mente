# Cuidando da Mente

Um web app interativo para tablet focado em exercícios simples de mindfulness para crianças com TDAH, ansiedade e depressão leve.

## Sobre o Projeto

Este projeto implementa um jogo educativo baseado nos quatro elementos da natureza, onde cada elemento representa um tipo diferente de exercício de mindfulness:

- **🔥 Fogo**: Controle de movimentos e gestos suaves
- **💧 Água**: Remoção de folhas com movimentos calmos
- **🌬️ Vento**: Estourar bolhas em movimento com foco
- **🌱 Terra**: Desenvolvimento de paciência e crescimento de plantas

## Funcionalidades

### Jogos Implementados
- ✅ **Jogo do Fogo**: Detecção de velocidade de gestos com feedback visual
- ✅ **Jogo da Água**: Sistema de remoção de folhas com movimento de correnteza
- ✅ **Jogo do Vento**: Estourar bolhas em movimento (otimizado para tablets)
- ✅ **Jogo da Terra**: Sistema de paciência com crescimento de plantas

### Componentes Base
- ✅ **TouchArea**: Componente para detecção de gestos touch e mouse
- ✅ **ProgressCircle**: Indicador circular de progresso com animações
- ✅ **CalmIndicator**: Indicador visual do estado de calma
- ✅ **ElementCard**: Cards para seleção de elementos
- ✅ **BackButton**: Navegação consistente

### Sistemas Implementados
- ✅ **Estado Global**: Zustand para gerenciamento de estado
- ✅ **Detecção de Gestos**: Velocidade, direção e intensidade
- ✅ **Sistema de Áudio**: Howler.js com sons ambiente e feedback
- ✅ **Roteamento**: React Router com navegação completa
- ✅ **Animações**: Framer Motion para transições suaves

### Interface Responsiva
- ✅ Design otimizado para tablets
- ✅ Estilização com CSS customizado
- ✅ Suporte a touch e mouse
- ✅ Feedback visual em tempo real

## Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd cuidando-da-mente

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## Tecnologias Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Zustand** - Gerenciamento de estado global
- **React Router** - Roteamento
- **Framer Motion** - Animações e transições
- **Howler.js** - Gerenciamento de áudio
- **CSS Modules** - Estilização customizada

## Estrutura do Projeto

```
src/
├── assets/              # Assets estáticos
│   └── figma/          # Imagens e backgrounds
├── components/         # Componentes reutilizáveis
│   └── ui/            # Componentes de interface
├── modules/           # Módulos dos jogos
│   └── game/         # Lógica específica de cada elemento
│       ├── fire/     # Jogo do Fogo
│       ├── water/    # Jogo da Água
│       ├── wind/     # Jogo do Vento
│       └── earth/    # Jogo da Terra
├── pages/            # Páginas principais
├── store/            # Estado global (Zustand)
├── utils/            # Utilitários
│   ├── gestureUtils.js  # Detecção de gestos
│   └── audioUtils.js    # Gerenciamento de áudio
├── styles/           # Estilos globais
├── App.jsx           # Componente principal
└── main.jsx         # Ponto de entrada
```

## Mecânicas dos Jogos

### Fogo - Controle de Movimentos
- **Objetivo**: Mover o dedo/mouse suavemente sobre a chama
- **Mecânica**: Detecção de velocidade de movimento
- **Feedback**: Chama muda de cor (verde = calmo, vermelho = muito intenso)
- **Sucesso**: Movimentos lentos e controlados aumentam o progresso

### Água - Tranquilidade e Paciência
- **Objetivo**: Remover folhas do rio com calma
- **Mecânica**: Clicar nas folhas que flutuam pela correnteza
- **Feedback**: Folhas se movem naturalmente pela água
- **Sucesso**: Remover todas as 12 folhas com tranquilidade

### Vento - Foco e Concentração
- **Objetivo**: Estourar bolhas de ar em movimento
- **Mecânica**: Clicar nas bolhas que flutuam pela tela
- **Feedback**: Bolhas maiores (otimizadas para tablets) em movimento
- **Sucesso**: Estourar 15 bolhas com foco

### Terra - Paciência e Crescimento
- **Objetivo**: Plantar e regar sementes com paciência
- **Mecânica**: Hold prolongado para cada estágio de crescimento
- **Feedback**: Planta cresce visualmente a cada etapa
- **Sucesso**: Completar o ciclo de crescimento da planta

## Sistema de Progresso

Cada jogo rastreia:
- **Tempo restante** (120 segundos por sessão)
- **Acertos e erros**
- **Progresso geral** (0-100%)
- **Taxa de sucesso**
- **Estado de calma** (calm/não calmo)

## Estado Global

O Zustand gerencia:
```javascript
{
  element: 'fire' | 'water' | 'wind' | 'earth',
  progress: 0-100,
  timeRemaining: 120,
  calm: boolean,
  hits: number,
  misses: number,
  gestureIntensity: 0-1,
  isGameActive: boolean
}
```

## Design e UX

- **Estética Pixel Art**: Visual atrativo e não estimulante demais
- **Cores suaves**: Paleta pensada para relaxamento
- **Feedback imediato**: Resposta visual e sonora instantânea
- **Instruções claras**: Textos simples e diretos
- **Animações sutis**: Transições suaves sem distrair
- **Touch-friendly**: Interface otimizada para tablets

## Propósito Terapêutico

O jogo foi desenvolvido especificamente para auxiliar crianças com:
- **TDAH**: Exercícios de foco e controle de impulso
- **Ansiedade**: Atividades relaxantes e movimento consciente
- **Depressão leve**: Atividades engajantes e gratificantes

Cada elemento trabalha aspectos diferentes:
- **Controle motor** (Fogo)
- **Tranquilidade e paciência** (Água)
- **Foco e concentração** (Vento)
- **Persistência e paciência** (Terra)

## Desenvolvimento

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linting do código
