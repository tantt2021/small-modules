const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");

const init = () => {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
}

init();

// 根据DPR（设备像素比）计算字体大小
const fontSize = 10 * devicePixelRatio;
// 设置字体
ctx.font = `${fontSize}px "Consolas"`;
// 计算总列数
const columnCounts = Math.floor(cvs.width / fontSize);
// 根据列数创建数组并填充为0
const charIndex = new Array(columnCounts).fill(0);

// 获取随机字符
const getRandomChar = () => {
    const str = '0123456789abcdefghijklmnopqrstuvwxyz';
    return str[Math.floor(Math.random() * str.length)];
}

// 绘制代码雨
const draw = () => {
    // 渐隐效果
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0,0,cvs.width,cvs.height);
    // 设置字体颜色
    ctx.fillStyle = "#44bc87";
    // 设置文本基线为顶部,
    ctx.textBaseline = 'top';
    for(let i = 0; i < columnCounts; i++){
        // 随机字符
        const text = getRandomChar();
        // 计算坐标
        const x = i * fontSize;
        const y = charIndex[i]*fontSize;
        // 绘制文本
        ctx.fillText(text,x,y);
        // 超过画布归零
        // 加判断，使错开归零的时间点,达到随机一列的效果
        if(y > cvs.height && Math.random() > 0.99){
            charIndex[i] = 0;   // y坐标置0
        }else{
            charIndex[i]++;    // 递增向下排列
        }
    }
}
// 50ms重绘
setInterval(draw,50);

