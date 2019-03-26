
const constraints = {
    audio: false,
    // video: true
    video: {
        width: { min: 1280 },
        height: { min: 720 }
    }
}
let canvas;
let ctx;
let pixel;
let tolerance = 32;

const interval = 1000 / 24;

window.addEventListener('DOMContentLoaded', () => {
    // canvas setup
    canvas = document.getElementById("canvas-1");
    ctx = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 360;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    const slider = document.getElementById("tolerancePicker");
    console.log(slider);
    slider.addEventListener('input',() => {
        tolerance = slider.value;
    });

    const h1 = document.getElementsByTagName("h1")[0];

    canvas.onmousedown = event => {
		event.preventDefault();
		const x = event.pageX - canvas.offsetLeft;
        const y = event.pageY - canvas.offsetTop;

        pixel = ctx.getImageData(x, y, 1, 1).data;

        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        h1.style.color = hex;
    }
      
    navigator.mediaDevices.getUserMedia(constraints)
        .then(initSuccess)
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
});

const initSuccess = (requestedStream) => {
    var video = document.querySelector('video');
    // Older browsers may not have srcObject
    try {
        video.srcObject = requestedStream;
    } catch {
        video.src = window.URL.createObjectURL(stream);
    }
    video.onloadedmetadata = () => {
        video.play();
        // capture(video);
        setInterval(() => {
            // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // removePixels(canvas, pixel, tolerance);
            requestAnimationFrame(() => {animation(video)});
        }, interval);
    };
}

const animation = (video) => {
    setTimeout(() => {
        requestAnimationFrame(() => {animation(video)});
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        removePixels(canvas, pixel, tolerance);
    }, interval);
}

const removePixels = (canvas, rgb, tolerance) => {
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0,0,canvas.width, canvas.height);
    let currentPixel;
    for(i=0; i<imgData.data.length; i+=4){
        currentPixel = imgData.data.slice(i, i+3);
        if( isNeighborColor(currentPixel, rgb, tolerance) ){
            imgData.data[i+3]=0;
        }
    }
    ctx.putImageData(imgData,0,0);
}

const isNeighborColor = (color1, color2, tolerance) => {
    if(tolerance == undefined) {
        tolerance = 32;
    }

    return Math.abs(color1[0] - color2[0]) <= tolerance
        && Math.abs(color1[1] - color2[1]) <= tolerance
        && Math.abs(color1[2] - color2[2]) <= tolerance;
}

const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    const hex = ((r << 16) | (g << 8) | b).toString(16);
    return "#" + ("000000" + hex).slice(-6);
}


// capture = (video) => {
//     const canvasWidth = canvas.width;
//     const canvasHeight = canvas.height;
//     canvas.captureContext.drawImage(video, 0, 0, canvasWidth, canvasHeight);
//     const captureImageData = canvas.captureContext.getImageData(0, 0, canvas.canvasWidth, canvas.canvasHeight );

//     canvas.motionContext.putImageData(captureImageData, 0, 0);

//     // diff current capture over previous capture, leftover from last time
//     canvas.diffContext.globalCompositeOperation = 'difference';
//     canvas.diffContext.drawImage( video, 0, 0, canvasWidth, canvasHeight );

//     const diffImageData = canvas.diffContext.getImageData( 0, 0, canvasWidth, canvasHeight );

//     if (isReadyToDiff) {
//         let rgba = diffImageData.data;
//         // pixel adjustments are done by reference directly on diffImageData
//         for (let i = 0; i = canvas.pixelDiffThreshold; i++) {
//             removePixels(canvas, rgba, tolerance);
//         }
//     }
//     // draw current capture normally over diff, ready for next time
//     canvas.diffContext.globalCompositeOperation = 'source-over';
//     canvas.diffContext.drawImage( video, 0, 0, canvasWidth, canvasHeight );
//     canvas.isReadyToDiff = true;
// }