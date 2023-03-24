
// p5 canvas variables
let myCanvas
let gridSize = 20
let shapeSize = gridSize //* 0.7
let rows, cols
let mx, my
let cards = []
let fixWidth = 800
let fixHeight = 800
let bgClr = "#babdc4"
let charClr = "#1b2f55"
let userChar
const CHARS = " ._▂▃▄▅▆▇ ░▒▓█ ▊▋▌▍▎▏".split("")
console.log(CHARS)

// socket variaables
let socket = io.connect();
let socketCards

socket.on('connect', function() {
    socket.emit('enterGame', {})
	console.log("enter game " + socket.id);
});

socket.on('enterGame', function(data) {
    console.log('enterGame, ', data)
    socketCards = data
    
    for(let i in socketCards) {
        if (socketCards[i]) {
            cards[i] = new Card(i, socketCards[i])
        }
    }
})

socket.on('clickCard', function(data) {
    const { cardId, content } = data
    cards[cardId].setContent(content)
    //console.log(data)
})

function setup() {
    let p = document.getElementById("gameCanvas").getBoundingClientRect()
	myCanvas = createCanvas(800, 800);
    myCanvas.parent('#gameCanvas')
    
    console.log(p.width)
	background(bgClr);
    rows = floor(fixWidth/gridSize)
	cols = floor(fixHeight/gridSize)
	mx = (fixWidth-rows*gridSize)/2 + gridSize/2
	my = (fixHeight-cols*gridSize)/2 + gridSize/2
    rectMode(CENTER)
    // make cards
    for(let x=0; x<cols; x++) {
        for(let y=0; y<rows; y++) {
            let index = x*cols + y
            
            if (cards[index] === undefined) {
                cards[index] = new Card(index, "")
                //cards.push(new Card(index, ""))
            } else {
                cards[index] = new Card(index, socketCards[index])
            }
        }
    }
    userChar = random(CHARS.filter(c => c != ' '))
    document.getElementById("userChar").innerText = userChar
    //console.log('card setup', cards)
}

function draw() {
    background(100)
    // draw grid lines
    // for(let x=0; x<cols; x++) {
    //     line(x*gridSize, 0, x*gridSize,fixHeight)
    // }
    // for(let y=0; y<rows; y++) {
    //     line(0, y*gridSize, fixWidth, y*gridSize)
    // }

    // show cards
    cards.forEach(card => {
        card.show()
    })
}

function mousePressed() {
    //cards
    if (isOnCanvas()) {
        let cardId = floor(mouseX/gridSize) * cols
               + floor(mouseY/gridSize)
        let content =  userChar//random(CHARS)
        cards[cardId].setContent(content)
        socket.emit('clickCard', { cardId, content: cards[cardId].content });
    }
    
}

function mouseDragged() {
    if (isOnCanvas()) {
        let lastCardId = floor(pmouseX/gridSize) * cols
                       + floor(pmouseY/gridSize)
        let cardId = floor(mouseX/gridSize) * cols
                   + floor(mouseY/gridSize)
        if (lastCardId !== cardId) {
            let content =  userChar//random(CHARS)
            cards[cardId].setContent(content)
            socket.emit('clickCard', { cardId, content: cards[cardId].content });
        }
    }

}

function isOnCanvas() {
    return mouseX >=0 && mouseX <= width && mouseY >= 0 && mouseY <= height
}

document.getElementById('sendImageBtn').addEventListener('click', () => {
    const image64 = myCanvas.elt.toDataURL()
    // const data = { image64 }
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }
    // fetch('/api', options)
    socket.emit('sendImage', { image64 });
})

charsets.forEach(c => console.log(c))
const allChars = document.querySelectorAll('.char')
allChars.forEach(elm => {
    elm.addEventListener('click', () => {
        userChar = elm.innerText
        document.getElementById("userChar").innerText = userChar
    })
    //console.log(elm.innerText)
})

class Card {
    constructor(uid, content) {
        this.uid = uid
        this.content = content
    }

    getGridPos() {
        let y = (this.uid % cols) * gridSize + gridSize/2
        let x = floor(this.uid / rows) * gridSize + gridSize/2
        return { x, y }
    }

    isHoever() {
        const { x ,y } = this.getGridPos()
        if (mouseX > x - gridSize/2 && mouseX < x + gridSize/2 && mouseY > y - gridSize/2 && mouseY < y + gridSize/2) {
            return true
        } else {
            return false
        }
    }

    getCardID(x, y) {
        let index = floor(x/gridSize) * cols
                  + floor(y/gridSize)
        return index
    }

    show() {
        const { x, y } = this.getGridPos()
        noStroke()
        //let scaleV = map( sin(frameCount/10), -1,1, 1, 0.8, 1.2)
        
        push()
        translate(x,y)
        //scale()

        fill(this.isHoever() ? charClr: bgClr)
        rect(0,0, gridSize, gridSize)
        textAlign(CENTER,CENTER)
        fill(this.isHoever() ? bgClr: charClr)
        textFont("Share Tech, sans-serif, Noto Sans TC")
        textSize(shapeSize)
        text(this.content, 0, 0)
        pop()
    }

    setContent(content) {
        this.content = content//random(["A","B", "C"])
        // socket.emit('clickCard', { cardId: this.uid, content: this.content });
    }
}

// function windowResized() {
//     let p = document.getElementById("gameCanvas").getBoundingClientRect()
//     resizeCanvas(p.width, p.width);
//   }
  