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
    var internalRadius = (canvas.width - ((canvas.width / 2) + 10)) / 2;
    var maxMoveStick = internalRadius;
    var externalRadius = internalRadius + 30;
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
        context.beginPath();
        context.arc(centerX, centerY, externalRadius, 0, circumference, false);
        context.lineWidth = externalLineWidth;
        context.strokeStyle = externalStrokeColor;
        context.stroke();

        drawArrow(centerX, centerY - externalRadius, centerX, centerY - externalRadius - 20); // 上箭頭
        drawArrow(centerX, centerY + externalRadius, centerX, centerY + externalRadius + 20); // 下箭頭
        drawArrow(centerX - externalRadius, centerY, centerX - externalRadius - 20, centerY); // 左箭頭
        drawArrow(centerX + externalRadius, centerY, centerX + externalRadius + 20, centerY); // 右箭頭
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

        context.arc(movedX, movedY, internalRadius, 0, circumference, false);
        var grd = context.createRadialGradient(centerX, centerY, 5, centerX, centerY, 200);
        grd.addColorStop(0, internalFillColor);
        grd.addColorStop(1, internalStrokeColor);
        context.fillStyle = grd;
        context.fill();
        context.lineWidth = internalLineWidth;
        context.strokeStyle = internalStrokeColor;
        context.stroke();
    }

    function drawArrow(fromX, fromY, toX, toY) {
        const headLength = 10;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);

        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        context.moveTo(toX, toY);
        context.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        context.strokeStyle = externalStrokeColor;
        context.lineWidth = externalLineWidth;
        context.stroke();
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
    var backgroundImg = document.getElementById('background').querySelector('img');
    var backgroundLeft = backgroundImg.offsetLeft;
    var backgroundTop = backgroundImg.offsetTop;
    function moveCharacterImage() {
        var characterImg = document.getElementById('characterImage');
        

        console.log('背景圖片左上角座標：', backgroundLeft, backgroundTop);

        var maxMoveX = 4; // X軸移動的最大速度因子
        var backgroundSpeedFactor = 1; // 背景滾動速度因子，值越小滾動越慢
    
        var speedX = Math.abs(StickStatus.x) / 100 * maxMoveX;
        var directionX = StickStatus.x >= 0 ? 1 : -1;
        var offsetX = directionX * speedX;
    
        var windowWidth = window.innerWidth;
        var backgroundOffsetX = parseFloat(backgroundImg.style.left) || 0;
        var newBackgroundOffsetX = backgroundOffsetX;
        var backgroundReachedLimit = false;
    
        // 判斷圖片是否在中間
        var characterCenterThreshold = windowWidth/2 ;
        var characterInCenter = Math.abs(parseFloat(characterImg.style.left) - characterCenterThreshold) < maxMoveX;
        if (characterInCenter) {
            // 移動背景
            newBackgroundOffsetX -= offsetX * backgroundSpeedFactor;
            var backgroundImgWidth = backgroundImg.clientWidth;
            var maxScrollX = backgroundImgWidth - windowWidth;
            console.log(backgroundLeft);
    
            if (newBackgroundOffsetX < -maxScrollX) {
                newBackgroundOffsetX = -maxScrollX;
                backgroundReachedLimit = true;
            }
            if (newBackgroundOffsetX > 0) {
                newBackgroundOffsetX = 0;
                backgroundReachedLimit = true;
            }
            backgroundImg.style.left = `${newBackgroundOffsetX}px`;
    
            // 當背景達到邊界，圖片移動到中間
            if (backgroundReachedLimit) {
                var currentImgLeft = parseFloat(characterImg.style.left) || 0;
                var newImgLeft = currentImgLeft + offsetX;
                console.log(newImgLeft);
    
                
                if (newImgLeft < backgroundLeft) {
                    newImgLeft = backgroundLeft;
                }
                if (newImgLeft > windowWidth) {
                    newImgLeft = windowWidth;
                }
    
                characterImg.style.left = `${newImgLeft}px`;
            }
        } else {
            // 將圖片移動到中間
            var currentImgLeft = parseFloat(characterImg.style.left) || 0;
            var newImgLeft = currentImgLeft + offsetX;
            console.log(newImgLeft);
            console.log(windowWidth / 2 + 1.5 * characterImg.clientWidth);
            console.log(offsetX);

    
            // 限制圖片在視窗內移動
            if (newImgLeft < 0 ) {
                
                newImgLeft = 0 ;
            }
            if (newImgLeft > windowWidth ) {
                newImgLeft = windowWidth ;
            }
    
            // 當圖片回到中間後再移動背景
            if (Math.abs(newImgLeft - characterCenterThreshold) < maxMoveX) {
                newImgLeft = characterCenterThreshold;
            }
    
            characterImg.style.left = `${newImgLeft}px`;
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
    }
});





/*
        function moveCharacterImage(data) {
            var characterImg = document.getElementById('characterImage');
            var backgroundImg = document.getElementById('background').querySelector('img');
            var maxMoveX = 4; // Adjust this value as needed
            var backgroundSpeedFactor = 1; // Adjust this value as needed
        
            var speedX = Math.abs(data.x) / 100 * maxMoveX;
            var directionX = data.x >= 0 ? 1 : -1;
            var offsetX = directionX * speedX;
        
            // Positioning background within window boundaries
            var windowWidth = window.innerWidth;
            var backgroundOffsetX = parseFloat(backgroundImg.style.left) || 0;
            var newBackgroundOffsetX = backgroundOffsetX;
            var backgroundReachedLimit = false;
        
            // Center threshold for character image
            var characterCenterThreshold = windowWidth /2;
             
            var characterInCenter = Math.abs(parseFloat(characterImg.style.left) - characterCenterThreshold) < maxMoveX;
           
            if (characterInCenter) {
                // Move background
                newBackgroundOffsetX -= offsetX * backgroundSpeedFactor;
                var backgroundImgWidth = backgroundImg.clientWidth;
                var maxScrollX = backgroundImgWidth - windowWidth;
            
                if (newBackgroundOffsetX < -maxScrollX) {
                    newBackgroundOffsetX = -maxScrollX;
                    backgroundReachedLimit = true;
                }
                if (newBackgroundOffsetX > 0) {
                    newBackgroundOffsetX = 0;
                    backgroundReachedLimit = true;
                }
                backgroundImg.style.left = `${newBackgroundOffsetX}px`;
            
                // When background reaches edge, move image to center
                if (backgroundReachedLimit) {
                    var currentImgLeft = windowWidth /2 ;
                    var newImgLeft = currentImgLeft + offsetX;
            
                    // Limit image movement within window
                    if (newImgLeft < 0 ) {
                        newImgLeft = 0;
                    }
                    if (newImgLeft > windowWidth  ) {
                        newImgLeft = windowWidth ;
                    }
            
                    characterImg.style.left = `${newImgLeft}px`;
                }
            } else { // character not in center
                // Move image to center
                var currentImgLeft = parseFloat(characterImg.style.left) || 0;
                var newImgLeft = currentImgLeft + offsetX;
            
                // Limit image movement within window
                if (newImgLeft < 0 ) {
                    newImgLeft = 0;
                }
                if (newImgLeft > windowWidth ) {
                    newImgLeft = windowWidth;
                }
            
                // When image returns to center, move background
                if (Math.abs(newImgLeft - characterCenterThreshold) < maxMoveX) {
                    newImgLeft = characterCenterThreshold;
                }
            
                characterImg.style.left = `${newImgLeft}px`;
            }
        }*/