
window.addEventListener('DOMContentLoaded', () => {
    // canvas setup
    const canvas = document.getElementById("canvas-1");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");

    const h1 = document.getElementsByTagName("h1")[0];

    // image setup
    const image = new Image();
    image.src = "./flower.bmp";
    image.setAttribute('crossOrigin', '');
    image.onload = () => {
        ctx.drawImage(image, 0, 0);
    };

    // click event
    canvas.onmousedown = event => {
		event.preventDefault();
		const x = event.pageX - canvas.offsetLeft;
        const y = event.pageY - canvas.offsetTop;

        const pixel = ctx.getImageData(x, y, 1, 1).data;
        // const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        // body.style.backgroundColor = hex;
        // console.log(`click ${hex}`);
        // console.log(`click ${pixel[0]} ${pixel[1]} ${pixel[2]}`);
        removePixels(canvas, pixel);
    }
    
    canvas.onmousemove = event => {
        event.preventDefault();
		const x = event.pageX - canvas.offsetLeft;
        const y = event.pageY - canvas.offsetTop;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        h1.style.color = hex;
    }
});

const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    const hex = ((r << 16) | (g << 8) | b).toString(16);
    return "#" + ("000000" + hex).slice(-6);
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
        // if( imgData.data[i]==rgb[0] &&
        //     imgData.data[i+1]==rgb[1] &&
        //     imgData.data[i+2]==rgb[2]
        //  ){
        //     imgData.data[i+3]=0;
        //  }
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