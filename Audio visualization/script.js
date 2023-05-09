const audio=document.querySelector('audio');
const cvs=document.querySelector('canvas');
const ctx=cvs.getContext('2d');


const init = () => {
    cvs.width = window.innerWidth * devicePixelRatio;
    cvs.height = window.innerHeight / 2 * devicePixelRatio;
}
init();


// 是否已经初始化
let isInit = false;
// 接收分析器节点的分析数据
let dataArray;
// 分析器节点
let analyser;
audio.onplay = () => {
    if(isInit){
        return;
    }

    // 创建音频上下文
    const audioCtx = new AudioContext();
    // 创建音频源节点
    const source = audioCtx.createMediaElementSource(audio);
    // 创建分析器节点
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    // 接收分析器节点的分析数据
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    isInit = true;
}

const draw = () => {
    // 逐帧绘制
    requestAnimationFrame(draw);
    // 清空画布
    const { width, height} = cvs;
    ctx.clearRect(0,0,width,height);
    if(!isInit){
        return;
    }
    // 分析器节点分析数据到数组中
    analyser.getByteFrequencyData(dataArray);
    const len = dataArray.length / 2;   // 条的数量，取一半，前半部分（低频范围就好，高频人耳几乎听不到，看不到波形）
    const barWidth = width / len / 2;   // 条的宽度
    ctx.fillStyle = '#fff';
    // 循环绘制
    for(let i = 0; i < len; i++){
        const data = dataArray[i];
        const barHeight = (data / 255) * height;
        const x1 = i * barWidth + width / 2;    // 右边区域中条的x坐标
        const x2 =  width / 2 - (i + 1) * barWidth; //左边区域中条的x坐标，镜像
        const y = height - barHeight;   // 条的y坐标
        ctx.fillRect(x1,y,barWidth - 2, barHeight); // 右边区域
        ctx.fillRect(x2,y,barWidth - 2, barHeight); // 左边区域
    }
}
draw();