# Cuidando da Mente

Um web app interativo para tablet focado em exercícios simples de mindfulness para crianças com TDAH, ansiedade e depressão leve.

## Sobre o Projeto

Este projeto implementa um jogo educativo baseado nos quatro elementos da natureza (Fogo, Água, Vento, Terra), onde cada elemento representa um tipo diferente de exercício de mindfulness:

- **🔥 Fogo**: Controle de movimentos e gestos suaves
- **💧 Água**: Exercícios de respiração 4-4 (inspirar 4s, segurar 4s)
- **🌬️ Vento**: Movimentos contínuos e suaves como a brisa
- **🌱 Terra**: Desenvolvimento de paciência e foco sustentado

## Funcionalidades Implementadas

### Jogos Funcionais
- [x] **Jogo do Fogo**: Detecção de velocidade de gestos, feedback visual e sonoro
- [x] **Jogo da Água**: Sistema de respiração cronometrado com ciclos de 4 segundos
- [x] **Jogo do Vento**: Detecção de arrasto suave com animação de folhas
- [x] **Jogo da Terra**: Sistema de hold prolongado com crescimento de plantas

### Componentes Base
- [x] **TouchArea**: Componente para detecção de gestos touch e mouse
- [x] **ProgressCircle**: Indicador circular de progresso com animações
- [x] **CalmIndicator**: Indicador visual do estado de calma
- [x] **ElementCard**: Cards para seleção de elementos
- [x] **BackButton**: Navegação consistente

### Sistemas Implementados
- [x] **Estado Global**: Zustand para gerenciamento de estado
- [x] **Detecção de Gestos**: Velocidade, direção, intensidade e duração
- [x] **Sistema de Áudio**: Howler.js com sons ambiente e feedback
- [x] **Roteamento**: React Router com navegação completa
- [x] **Animações**: Framer Motion para transições suaves

### Interface Responsiva
- [x] Design otimizado para tablets
- [x] Tailwind CSS para estilização
- [x] Suporte a touch e mouse
- [x] Feedback visual em tempo real

## Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd cuidando-da-mente

# Instale as dependências (já executado)
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
- **Tailwind CSS** - Estilização
- **PostCSS** - Processamento de CSS

## Estrutura do Projeto

```
src/
├── assets/              # Assets estáticos
│   ├── sounds/         # Arquivos de som
│   └── sprites/        # Sprites e imagens
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
├── App.jsx           # Componente principal
└── main.jsx         # Ponto de entrada
```

## Sistema de Áudio

O jogo inclui suporte a áudio ambiente e feedback sonoro. Os arquivos de som devem ser colocados em `public/sounds/`:

### Sons Necessários:
- `fire.mp3` - Som ambiente do fogo
- `water.mp3` - Som ambiente da água
- `wind.mp3` - Som ambiente do vento
- `birds.mp3` - Som ambiente da terra (natureza)
- `success.mp3` - Som de sucesso/acerto
- `error.mp3` - Som de erro/tentativa

**Nota**: O jogo funciona perfeitamente sem os arquivos de áudio, tratando erros silenciosamente.

## Mecânicas dos Jogos

### 🔥 Fogo - Controle de Movimentos
- **Objetivo**: Mover o dedo/mouse suavemente
- **Mecânica**: Detecção de velocidade de movimento
- **Feedback**: Chama muda de cor (verde = calmo, vermelho = muito intenso)
- **Sucesso**: Movimentos lentos e controlados

### 💧 Água - Respiração 4-4
- **Objetivo**: Respiração controlada
- **Mecânica**: Segurar toque por 4 segundos (inspirar), soltar (expirar)
- **Feedback**: Círculo cresce durante inspiração
- **Sucesso**: Manter timing entre 3.5-5.5 segundos

### 🌬️ Vento - Movimento Contínuo
- **Objetivo**: Arrastar suavemente da esquerda para direita
- **Mecânica**: Detecção de direção e suavidade
- **Feedback**: Folhas se movem conforme o gesto
- **Sucesso**: Movimentos suaves na direção correta

### 🌱 Terra - Paciência e Foco
- **Objetivo**: Segurar toque por 3 segundos
- **Mecânica**: Hold prolongado com feedback visual
- **Feedback**: Progresso visual da planta crescendo
- **Sucesso**: Completar 3 segundos de hold

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
  breathingRhythm: 0-100,
  isGameActive: boolean
}
```

## Design e UX

- **Cores suaves**: Paleta pensada para não estimular demais
- **Feedback imediato**: Resposta visual e sonora instantânea
- **Instruções claras**: Textos simples e diretos
- **Animações sutis**: Transições suaves sem distrair
- **Touch-friendly**: Interface otimizada para tablets

## 🏥 Propósito Terapêutico

O jogo foi desenvolvido especificamente para auxiliar crianças com:
- **TDAH**: Exercícios de foco e controle de impulso
- **Ansiedade**: Técnicas de respiração e movimento consciente
- **Depressão leve**: Atividades engajantes e relaxantes

Cada elemento trabalha aspectos diferentes:
- **Controle motor** (Fogo)
- **Regulação respiratória** (Água)
- **Coordenação e fluidez** (Vento)
- **Paciência e persistência** (Terra)

## Desenvolvimento

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linting do código

