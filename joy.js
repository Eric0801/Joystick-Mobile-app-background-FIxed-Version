let StickStatus = {
    xPosition: 0,
    yPosition: 0,
    x: 0,
    y: 0,
    cardinalDirection: "C"
};


var JoyStick = (function(container, parameters, callback) {
    parameters = parameters || {};
    var title = parameters.title || "joystick";
    var internalFillColor = parameters.internalFillColor || "#008000";
    var internalLineWidth = parameters.internalLineWidth || 2;
    var internalStrokeColor = parameters.internalStrokeColor || "#008000";
    var externalLineWidth = parameters.externalLineWidth || 2;
    var externalStrokeColor = parameters.externalStrokeColor || "#008000";
    var autoReturnToCenter = parameters.autoReturnToCenter !== undefined ? parameters.autoReturnToCenter : true;
   

    callback = callback || function(StickStatus) {};

    var objContainer = document.getElementById(container);
    objContainer.style.touchAction = "none";

    var canvas = document.createElement("canvas");
    canvas.id = title;
    canvas.width = objContainer.clientWidth;
    canvas.height = objContainer.clientHeight;
    objContainer.appendChild(canvas);
    var context = canvas.getContext("2d");

    var pressed = 0;
    var circumference = 2 * Math.PI;
    var internalRadius = (canvas.width - ((canvas.width / 2) )) / 2;
    var maxMoveStick = internalRadius;
    var externalRadius = internalRadius + 20;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var movedX = centerX;
    var movedY = centerY;

    var animationFrameId;
   

    canvas.addEventListener("pointerdown", onPointerDown, false);
    document.addEventListener("pointermove", onPointerMove, false);
    document.addEventListener("pointerup", onPointerUp, false);

    drawExternal();
    drawInternal();

    function drawExternal() {
        context.clearRect(0, 0, canvas.width, canvas.height); // 清空畫布，可選步骤，視情况而定
   
        // 繪製外部綠色漸變圓框
        context.beginPath();
        context.arc(centerX, centerY, externalRadius+8, 0, circumference, false);
        context.lineWidth = externalLineWidth;
   
        var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
       
        gradient.addColorStop(0, "#FFFF37"); // 黃色
        gradient.addColorStop(1, "#4DFFFF"); // 藍色
       
   
        context.strokeStyle = gradient;
        context.stroke();




        // 繪製白色圓底
        context.beginPath();
        context.arc(centerX, centerY, internalRadius + 23, 0, circumference, false);
        context.lineWidth = 70; // 調整白色圓框宽度

        // 創建逕向漸變
        var gradientundwhite = context.createRadialGradient(centerX, centerY, internalRadius+13, centerX, centerY, internalRadius +23);
        gradientundwhite.addColorStop(0, "#EDEDED"); // 灰色
        gradientundwhite.addColorStop(1, "#FCFCFC"); // 白色

        context.fillStyle = gradientundwhite; // 設置填充樣式為逕向漸變
        context.fill(); // 填充圓形
        // 繪製白色圓底結束
       



        console.log(internalRadius)
        console.log(centerX)
        console.log(centerY)

        // 繪製灰色圓底
        context.beginPath();
        context.arc(centerX, centerY, internalRadius + 13, 0, circumference, false);
        context.lineWidth = 80; // 調整灰色圓框宽度

        // 設置陰影效果
        context.shadowColor = 'rgba(0, 0, 0, 0.7)'; // 陰影颜色，使用半透明黑色
        context.shadowBlur = -5; // 陰影模糊程度
        context.shadowOffsetX = 0; // 陰影在 X 軸的偏移量
        context.shadowOffsetY = 0; // 陰影在 Y 軸的偏移量

        // 創建逕向漸變
        var gradient = context.createRadialGradient(centerX, centerY, internalRadius-10, centerX, centerY, internalRadius+13 );
        gradient.addColorStop(0, "#FCFCFC"); // 淺灰色
        gradient.addColorStop(1, "#E0E0E0"); // 深灰色

        context.fillStyle = gradient; // 設置填充樣式為逕向漸變
        context.fill(); // 填充圓形

        // 清除陰影設置,以免影響其他設定
        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
   


        console.log(externalRadius)
        console.log(centerY)


        // 計算内部圓盤的圓心坐標
        // 繪製黄色三角形箭頭
        drawArrow(centerX, centerY*0.75, centerX, centerY*0.4); // 上箭頭
        drawArrow(centerX, centerY*1.5, centerX, centerY *1.6); // 下箭頭
        drawArrow(centerX *1.5, centerY, centerX *0.4, centerY); // 左箭頭
        drawArrow(centerX *1.5, centerY, centerX *1.6, centerY); // 右箭頭
    }
   
   
   
    function drawArrow(fromX, fromY, toX, toY) {
        const headLength = 20; // 調整箭頭長度
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
   
        context.beginPath();
        context.moveTo(toX, toY);
        context.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        context.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        context.closePath(); // 封閉路徑，形成三角形
   
        context.fillStyle = "orange"; // 設置填充颜色為黄色
        context.fill(); // 填充三角形
    }
   
    function drawInternal() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawExternal();
   
        context.beginPath();
        var deltaX = movedX - centerX;
        var deltaY = movedY - centerY;
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
   
        if (distance > maxMoveStick) {
            movedX = centerX + (deltaX / distance) * maxMoveStick;
            movedY = centerY + (deltaY / distance) * maxMoveStick;
        }
   
        // 繪製內部白色圓盤
        // 繪製带有漸變陰影的圓形
        context.beginPath();
        context.arc(movedX, movedY, internalRadius - 20, 0, circumference, false);

        // 設置陰影效果
        context.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 陰影颜色，使用半透明黑色
        context.shadowBlur = 10; // 陰影模糊程度
        context.shadowOffsetX = (movedX-120)*0.15; // 陰影在 X 軸的偏移量
        context.shadowOffsetY = (movedY-120)*0.15; // 陰影在 Y 軸的偏移量
        console.log(internalRadius)
        // 創建逕向漸變
        var grd = context.createRadialGradient(movedX, movedY, 5, movedX, movedY, internalRadius*4/7);
        grd.addColorStop(0, "#F0F0F0"); // 灰色陰影
        grd.addColorStop(1, "#ffffff"); // 白色
        context.fillStyle = grd; // 設置填充样式為逕向漸變
        context.fill(); // 填充圓形

        // 清除陰影設置，以免影響其他繪製
        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
       
    }
   
   


    function onPointerDown(event) {
        pressed = 1;
        updatePointerPosition(event);
        drawInternal();
        updateStickStatus();
        startAnimationLoop();
    }

    function onPointerMove(event) {
        if (pressed === 1) {
            updatePointerPosition(event);
            drawInternal();
            updateStickStatus();
        }
    }

    function onPointerUp(event) {
        pressed = 0;
        if (autoReturnToCenter) {
            movedX = centerX;
            movedY = centerY;
        }
        drawInternal();
        updateStickStatus();
        stopAnimationLoop();
    }

    function updatePointerPosition(event) {
        var rect = canvas.getBoundingClientRect();
        movedX = event.clientX - rect.left;
        movedY = event.clientY - rect.top;
    }

    function updateStickStatus() {
        StickStatus.xPosition = movedX;
        StickStatus.yPosition = movedY;
        StickStatus.x = ((movedX - centerX) / maxMoveStick * 100).toFixed(2);
        StickStatus.y = ((movedY - centerY) / maxMoveStick * -100).toFixed(2);
        StickStatus.cardinalDirection = getCardinalDirection();
        callback(StickStatus);
        console.log('StickStatus:', StickStatus); // 打印StickStatus所有參數
    }

    function startAnimationLoop() {
        if (!animationFrameId) {
            animationLoop();
        }
    }

    function stopAnimationLoop() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function animationLoop() {
        moveCharacterImage();
        animationFrameId = requestAnimationFrame(animationLoop);
    }

    function moveCharacterImage() {
    var characterImg = document.getElementById('characterImage');
    var backgroundImg = document.getElementById('background').querySelector('img');
    var backgroundTop = backgroundImg.offsetTop;

    var maxMoveX = 6; // X軸移動的最大速度因子
    var maxMoveY = 6; // Y軸移動的最大速度因子
    var backgroundSpeedFactor = 1; // 背景滚動速度因子，值越小滚動越慢

    var speedX = Math.abs(StickStatus.x) / 100 * maxMoveX;
    var speedY = Math.abs(StickStatus.y) / 100 * maxMoveY;
    var directionX = StickStatus.x >= 0 ? 1 : -1;
    var directionY = StickStatus.y >= 0 ? 1 : -1;
    var offsetX = directionX * speedX;
    var offsetY = directionY * speedY;

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var backgroundOffsetX = parseFloat(backgroundImg.style.left) || 0;
    var backgroundOffsetY = parseFloat(backgroundImg.style.top) || 0;
    var newBackgroundOffsetX = backgroundOffsetX;
    var newBackgroundOffsetY = backgroundOffsetY;
    var backgroundReachedLimitX = false;
    var backgroundReachedLimitY = false;

    // 判斷圖片是否在中間
    var characterCenterThresholdX = windowWidth / 2;
    var characterCenterThresholdY = windowHeight / 2;
    var characterInCenterX = Math.abs(parseFloat(characterImg.offsetLeft) - characterCenterThresholdX) <= maxMoveX;
   

    if (characterCenterThresholdX == windowWidth / 2 && characterInCenterX ) {
        // 移動背景
        newBackgroundOffsetX -= offsetX * backgroundSpeedFactor;
        newBackgroundOffsetY -= offsetY * backgroundSpeedFactor;
        var backgroundImgWidth = backgroundImg.clientWidth;
        var currentImgTop = parseFloat(characterImg.offsetTop) || 0;
        var maxScrollX = backgroundImgWidth - windowWidth;
        var newImgTop = currentImgTop - offsetY;

        if (newBackgroundOffsetX < -maxScrollX) {
            newBackgroundOffsetX = -maxScrollX;
            backgroundReachedLimitX = true;
        }
        if (newBackgroundOffsetX > 0) {
            newBackgroundOffsetX = 0;
            backgroundReachedLimitX = true;
        }

        if (newImgTop < backgroundTop) {
            newImgTop = backgroundTop;
        }
        if (newImgTop > backgroundImg.height - characterImg.style.height) {
            newImgTop = backgroundImg.height - characterImg.style.height;
           
        }
        characterImg.style.left = `${newImgLeft}px`;
        characterImg.style.top = `${newImgTop}px`;

        backgroundImg.style.left = `${newBackgroundOffsetX}px`;
       
        // 當背景達到邊界，圖片移動到中間
        if (backgroundReachedLimitX ) {
            console.log(123);
            var currentImgLeft = parseFloat(characterImg.offsetLeft) || 0;
            var currentImgTop = parseFloat(characterImg.offsetTop) || 0;
            var newImgLeft = currentImgLeft + offsetX;
            var newImgTop = currentImgTop - offsetY;

            if (newImgLeft < 0) {
                newImgLeft = 0;
            }
            if (newImgLeft > backgroundImgWidth) {
                newImgLeft = backgroundImgWidth;
            }
            if (newImgTop < backgroundTop) {
                newImgTop = backgroundTop;
            }
            if (newImgTop > backgroundImg.height) {
                newImgTop = backgroundImg.height;
               
            }

            characterImg.style.left = `${newImgLeft}px`;
            characterImg.style.top = `${newImgTop}px`;
        }
    } else {
        // 將圖片移動到中間
        var currentImgLeft = parseFloat(characterImg.style.left) || 0;
        var currentImgTop = parseFloat(characterImg.style.top) || 0;
        var newImgLeft = currentImgLeft + offsetX;
        var newImgTop = currentImgTop - offsetY;

        // 限制圖片在視窗内移動
        if (newImgLeft < 0) {
            newImgLeft = 0;
        }
        if (newImgLeft > windowWidth) {
            newImgLeft = windowWidth;
        }
        if (newImgTop < 0) {
            newImgTop = 0;
        }
        if (newImgTop > windowHeight) {
            newImgTop = windowHeight;
        }

        // 當圖片回到中間後再移動背景
        if (Math.abs(newImgLeft - characterCenterThresholdX) < maxMoveX && Math.abs(newImgTop - characterCenterThresholdY) < maxMoveY) {
            newImgLeft = characterCenterThresholdX;
            newImgTop = characterCenterThresholdY;
        }

        characterImg.style.left = `${newImgLeft}px`;
        characterImg.style.top = `${newImgTop}px`;
    }
}

   
   

    function getCardinalDirection() {
        let result = "";
        if (Math.abs(StickStatus.y) > Math.abs(StickStatus.x)) {
            if (StickStatus.y < 0) {
                result += "N";
            }
            if (StickStatus.y > 0) {
                result += "S";
            }
        } else {
            if (StickStatus.x < 0) {
                result += "W";
            }
            if (StickStatus.x > 0) {
                result += "E";
            }
        }
        return result || "C";
    }

    return {
        GetWidth: function() { return canvas.width; },
        GetHeight: function() { return canvas.height; },
        GetPosX: function() { return movedX; },
        GetPosY: function() { return movedY; },
        GetX: function() { return StickStatus.x; },
        GetY: function() { return StickStatus.y; },
        GetDir: function() { return StickStatus.cardinalDirection; }
    };
});