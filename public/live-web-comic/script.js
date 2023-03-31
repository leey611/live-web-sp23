let socket = io.connect();
let userPrompt
const constraints = {
    video: true,
};

let videoCanvas = document.getElementById('videoCanvas')
let ctx = videoCanvas.getContext('2d')
const video = document.querySelector("#videoContainer video");


socket.on('connect', function() {
    socket.emit('enterComic', {})
    //socket.emit('loadComic', {})
	console.log("enter comic  " + socket.id);
});


socket.on('enterComic', function(data) {
    console.log('enterComic Client ', data)
    let { bothRole, comicImages, comicPrompts } = data
    console.log('bothrole ', bothRole)
    if (bothRole) {
        document.getElementById('chooseCharacter').style.display = 'block'
    } else {
        document.getElementById('chooseCharacter').style.display = 'none'
    }

})

socket.on('loadComic', function(data) {
    const { comicImages, comicPrompts } = data
    if (comicImages.length) {
        for(let i = 0; i < comicImages.length; i++) {
            let comicBlock = document.createElement("div");
            const index = i + 1
            const image64 = comicImages[i]
            const { lightLayer, midLayer, darkLayer } = image64
            comicBlock.innerHTML = `
                <h4>${comicPrompts[i]}</h4>
                <svg class='comicBlock' width='600px' height='300px' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg'>
                    <defs>
                        <mask id='myMask_${index}'>
                            <image id='dark_${index}' width='100%' height='100%' xlink:href=${darkLayer}></image>
                        </mask>
                        <mask id='myMask2_${index}'>
                            <image id='light_${index}' width='100%' height='100%' xlink:href=${lightLayer}></image>
                        </mask>
                        <mask id='myMask3_${index}'>
                            <image id='mid_${index}' width='100%' height='100%' xlink:href=${midLayer}></image>
                        </mask>
                    </defs>
                    <foreignObject class='dark' width='1000px' height='1000px' style='mask:url(#myMask_${index})' xmlns='http://www.w3.org/1999/xhtml'></foreignObject>
                    <foreignObject class='mid' width='1000px' height='1000px' style='mask:url(#myMask3_${index})' xmlns='http://www.w3.org/1999/xhtml'></foreignObject>
                    <foreignObject class='light' width='1000px' height='1000px' style='mask:url(#myMask2_${index})' xmlns='http://www.w3.org/1999/xhtml'></foreignObject>
                </svg>
            `
            document.getElementById('story').appendChild(comicBlock)
        }
    }
})

socket.on('sendComic', function(data) {
    const { image64, index, prompt } = data
    const { lightLayer, midLayer, darkLayer } = image64
    // let myImg = new Image()
    // myImg.src = image64
    // console.log('sendCom ', image64)
    let comicBlock = document.createElement("div");

    

comicBlock.innerHTML = `
    <p>When you see your prompt, act it out! Take a picture of your pose.</p>
    <h4>${prompt}</h4>
    <svg class='comicBlock' width='600px' height='300px' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg'>
        <defs>
            <mask id='myMask_${index}'>
                <image id='dark_${index}' width='100%' height='100%' xlink:href=${darkLayer}></image>
            </mask>
            <mask id='myMask2_${index}'>
                <image id='light_${index}' width='100%' height='100%' xlink:href=${lightLayer}></image>
            </mask>
            <mask id='myMask3_${index}'>
                <image id='mid_${index}' width='100%' height='100%' xlink:href=${midLayer}></image>
            </mask>
        </defs>
        <foreignObject class='dark' width='1000px' height='1000px' style='mask:url(#myMask_${index})' xmlns='http://www.w3.org/1999/xhtml'></foreignObject>
        <foreignObject class='mid' width='1000px' height='1000px' style='mask:url(#myMask3_${index})' xmlns='http://www.w3.org/1999/xhtml'></foreignObject>
        <foreignObject class='light' width='1000px' height='1000px' style='mask:url(#myMask2_${index})' xmlns='http://www.w3.org/1999/xhtml'></foreignObject>
    </svg>
`
    document.getElementById('story').appendChild(comicBlock)
    // update how many more shots
    const howManyMore = 4 - index
    document.getElementById('waiting-ppl').innerText = howManyMore
})

socket.on('storyTime', function() {
    document.getElementById('waiting').style.display = 'none'
})

let myInterval

socket.on('chooseRole', function(data) {
    const { role, prompt } = data
    if (role === 'character') {
        if (prompt.length) {
            document.getElementById('prompt').innerText = prompt
            userPrompt = prompt
        }
        //get user media
        console.log('get user media')
        navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess);
        myInterval = setInterval(updateCapture, 200)

        
    }
})

let lightLayer, midLayer, darkLayer

function updateCapture() {
    videoCanvas.width = video.videoWidth;
    videoCanvas.height = video.videoHeight;

    ctx.filter = "blur(1px) grayscale(100%) brightness(140%) contrast(90)"; // Step 1
    ctx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height); // Step 2
    document
        .querySelector("#light")
        .setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        videoCanvas.toDataURL("image/png")
    ); // Step 3
    lightLayer = videoCanvas.toDataURL("image/png")

    ctx.filter = "blur(6px) grayscale(100%) brightness(140%) contrast(90)";
    ctx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
    document
        .querySelector("#mid")
        .setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
        videoCanvas.toDataURL("image/png")
    );
    midLayer = videoCanvas.toDataURL("image/png")

    ctx.filter = "blur(4px) grayscale(100%) brightness(190%) contrast(120)";
    ctx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
    document
        .querySelector("#dark")
        .setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
        videoCanvas.toDataURL("image/png")
    );
    darkLayer = videoCanvas.toDataURL("image/png")
}

document.getElementById('chooseCharacter').addEventListener('click', () => {
    socket.emit('chooseRole', { role: 'character' })
    // hide welcome page
    document.getElementById('welcome').style.display = 'none'
})

document.getElementById('chooseViewer').addEventListener('click', () => {
    socket.emit('chooseRole', { role: 'viewer' })
    // hide welcome page
    document.getElementById('welcome').style.display = 'none'
    document.getElementById('role').style.display = 'none'
    document.getElementById('capture').style.display = 'none'
})

// let previewImg

document.getElementById('captureCharacterBtn').addEventListener('click', () => {
    console.log('take a shot!')
    // let svgElm = new XMLSerializer().serializeToString(document.querySelector(".frame"))
    // let encodedData = window.btoa(svgElm);
    // const imgSrc = 'data:image/svg+xml;base64,' + encodedData
    // let imgSrc = videoCanvas.toDataURL()
    // previewImg = new Image();
    // previewImg.src = videoCanvas.toDataURL('image/jpg')
    
    clearInterval(myInterval)
    
    // let img = new Image()
    
    // ctx.drawImage(video, 0, 0)
    // img.src = videoCanvas.toDataURL("image/png")

    // const img = new Image()
    //       img.src = imgSrc
    // document.getElementById('capture').appendChild(img)
    //const image64 = myCanvas.elt.toDataURL()
    // const data = { image64 }
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }
    // fetch('/api', options)
    //socket.emit('sendImage', { image64 });

    // hide role capture page
    // document.getElementById('role').style.display = 'none'
})

document.getElementById('confirmCaptureBtn').addEventListener('click', () => {
    //document.getElementById('story').appendChild(previewImg)
    let previewImg = new Image();
    
    previewImgSrc = videoCanvas.toDataURL("image/png")
    previewImg.src = previewImgSrc
    //document.getElementById('story').appendChild(previewImg)
    //previewImg.src = videoCanvas.toDataURL('image/jpg')
    socket.emit('sendComic', { image64: {lightLayer, midLayer, darkLayer}, prompt: userPrompt });

    // hide confirm capture page
    document.getElementById('capture').style.display = 'none'
})

function setup() {

}

function draw() {
    //console.log('hi')
    //socket.emit('enterComic', {})
}

function handleSuccess(stream) {
    video.srcObject = stream;
  }

