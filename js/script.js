// Seleciona o elemento canvas do HTML
const canvas = document.querySelector("canvas")

// Obtém o contexto de desenho 2D do canvas
const ctx = canvas.getContext("2d")

// Cria um elemento de áudio para reproduzir o som de comer a maçã
const audioEat = new Audio('../assets/eat.ogg')

// Tamanho dos elementos (cobra e maçã) no jogo
const size = 30

// Array que representa a cobra inicialmente com duas partes
const snake = [
    { x: 270, y: 270 },
    { x: 300, y: 270 },
]

// Função para gerar um número aleatório dentro de um intervalo
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

// Função para gerar uma posição aleatória para a maçã
const randomPosition = (min, max) => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

// Função para gerar uma cor aleatória em formato RGB
const randomColor = () => {
    const red = randomNumber(0, 225)
    const green = randomNumber(0, 225)
    const blue = randomNumber(0, 225)

    return `rgb(${red}, ${green}, ${blue})`
}

// Objeto que representa a maçã no jogo
const apple = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

// Variáveis para controle da direção da cobra e do loop principal do jogo
let direction, loopId

// Função para desenhar a maçã na tela
const drawApple = () => {
    const { x, y, color } = apple

    ctx.shadowColor = color
    ctx.shadowBlur = 7
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

// Função para desenhar a cobra na tela
const drawSnake = () => {
    ctx.fillStyle = "#009929" // Cor do corpo da cobra

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "#006414" // Cor da cabeça da cobra
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

// Função para mover a cobra
const moveSnake = () => {
    if (!direction) return

    const head = snake.at(-1)

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

// Função para desenhar a grade do jogo
const drawGrid = () => {
    ctx.lineWidth = 1.5
    ctx.strokeStyle = "white" // Cor das linhas da grade

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
// Função para obter o highscore armazenado no localStorage
const getHighscore = () => {
    return localStorage.getItem('highscore') || 0;
}

// Função para verificar se a cobra comeu a maçã
const checkEat = () => {
    const head = snake.at(-1)
    if (head.x == apple.x && head.y == apple.y) {
        snake.push(head)
        audioEat.play()

        // Gera uma nova posição para a maçã
        let x = randomPosition()
        let y = randomPosition()

        // Verifica se a nova posição da maçã não está dentro da cobra
        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        // Define a nova posição e cor da maçã
        apple.x = x
        apple.y = y
        apple.color = randomColor()

        // Atualiza o highscore se necessário
        const currentScore = snake.length - 2
        const highscore = getHighscore();
        if (currentScore > highscore) {
            localStorage.setItem('highscore', currentScore)
        }

}

// Função para verificar colisões (com a parede ou a própria cobra)
const checkCollision = () => {
    const head = snake.at(-1)
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    // Verifica colisão com a parede
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    // Verifica colisão com o corpo da cobra
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    // Se houver colisão, o jogo acaba
    if (wallCollision || selfCollision) {
        gameOver()
    }
}

// Função chamada quando o jogo acaba
const gameOver = () => {
    direction = undefined;

    // Reinicia o jogo após um pequeno atraso
    setTimeout(() => {
        resetGame();
    }, 1000); // Espera 1 segundo antes de reiniciar o jogo
}

// Função para resetar o estado do jogo
const resetGame = () => {
    // Reseta a posição inicial da cobra e da maçã
    snake.length = 2; // Cobra volta ao tamanho inicial
    snake[0] = { x: 270, y: 270 };
    snake[1] = { x: 300, y: 270 };
    apple.x = randomPosition();
    apple.y = randomPosition();
    apple.color = randomColor();

    // Reinicia o loop do jogo
    gameLoop();
}

// Variável para armazenar o intervalo inicial do jogo
let initialInterval = 100;

// Função principal do jogo
const gameLoop = () => {
    clearInterval(loopId);

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a grade, maçã, cobra, etc.
    drawGrid();
    drawApple();
    drawSnake();
    moveSnake();
    checkEat();
    checkCollision();

    // Calcula a velocidade com base no tamanho da cobra
    const interval = Math.max(initialInterval - (snake.length * 1.2), 50);

    // Loop para atualizar o jogo
    loopId = setTimeout(() => {
        gameLoop();
    }, interval);
}

// Reinicia o loop do jogo
gameLoop()

// Evento de teclado para controlar a direção da cobra
document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }
    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})