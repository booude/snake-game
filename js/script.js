const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const audioEat = new Audio('../assets/eat.ogg')

const size = 30
const snake = [
    { x: 270, y: 270 },
    { x: 300, y: 270 },

]

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = (min, max) => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 225)
    const green = randomNumber(0, 225)
    const blue = randomNumber(0, 225)

    return `rgb(${red}, ${green}, ${blue})`
}

const apple = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

const drawApple = () => {

    const { x, y, color } = apple

    ctx.shadowColor = color
    ctx.shadowBlur = 7
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#009929"

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "#006414"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

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

const drawGrid = () => {
    ctx.lineWidth = 1.5
    ctx.strokeStyle = "white"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()

    }

}

const checkEat = () => {
    const head = snake.at(-1)
    if (head.x == apple.x && head.y == apple.y) {
        snake.push(head)
        audioEat.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        apple.x = x
        apple.y = y
        apple.color = randomColor()

    }

}

const checkCollision = () => {
    const head = snake.at(-1)
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

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
const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawApple()
    drawSnake()
    moveSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 100)
}

gameLoop()

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