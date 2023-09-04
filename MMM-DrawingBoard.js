Module.register("MMM-DrawingBoard", {
    defaults: {},

    start: function () {},

    getStyles: function () {
        return ["MMM-DrawingBoard.css"];
    },

    getDom: function () {
        const wrapper = document.createElement("div");

        
        const image = document.createElement("img");
        image.src = "/modules/MMM-DrawingBoard/pen.png";

        image.id = "openDrawingBoardImage";
        image.style.width = "100px";  // You can set the size as you wish
        image.style.height = "100px";
        image.addEventListener("click", () => {
            this.openDrawingBoard();
        });

        wrapper.appendChild(image);
        
        const canvasWrapper = document.createElement("div");
        canvasWrapper.id = "canvasWrapper";
        canvasWrapper.style.display = "none";

        const canvas = document.createElement("canvas");
        canvas.id = "drawingCanvas";

        canvasWrapper.appendChild(canvas);

        const controlPanel = document.createElement("div");
        controlPanel.id = "controlPanel";

        const makeButton = (name) => {
            const btn = document.createElement("button");
            btn.innerHTML = name;
            btn.id = name.toLowerCase();
            btn.className = "controlButton";
            return btn;
        };

        ["Pen", "Thick Pen", "Eraser", "Clear", "Close"].forEach((name) => {
            controlPanel.appendChild(makeButton(name));
        });

        canvasWrapper.appendChild(controlPanel);
        wrapper.appendChild(canvasWrapper);

        return wrapper;
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === 'DOM_OBJECTS_CREATED') {
            this.initializeDrawingBoard();
        }
    },

    openDrawingBoard: function () {
        const canvasWrapper = document.getElementById("canvasWrapper");
        canvasWrapper.style.display = "block";
        canvasWrapper.style.width = window.innerWidth + "px";
        canvasWrapper.style.height = window.innerHeight + "px";

        this.sendNotification('HIDE_MODULES', { exceptionList: ["MMM-DrawingBoard"] });

        const canvas = document.getElementById("drawingCanvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 100; // Assuming 100px height for the control panel

        this.initializeDrawingBoard();
    },

    initializeDrawingBoard: function () {
        let canvas = document.getElementById('drawingCanvas');
        let ctx = canvas.getContext('2d');

        // Initialize as white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Default to pen
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        document.getElementById('pen').click();

        let drawing = false;

        function startDrawing(e) {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
        }

        function draw(e) {
            if (!drawing) return;
            ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
            ctx.stroke();
        }

        function stopDrawing() {
            drawing = false;
            ctx.closePath();
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);

        // Touch events
        canvas.addEventListener('touchstart', function (e) {
            const touch = e.touches[0];
            startDrawing(touch);
        });
        canvas.addEventListener('touchmove', function (e) {
            const touch = e.touches[0];
            draw(touch);
        });
        canvas.addEventListener('touchend', stopDrawing);

        // Control buttons
        document.getElementById('pen').addEventListener('click', function () {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
        });

        document.getElementById('thick pen').addEventListener('click', function () {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 5;
        });

        document.getElementById('eraser').addEventListener('click', function () {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 10;
        });

        document.getElementById('clear').addEventListener('click', function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        document.getElementById('close').addEventListener('click', () => {
            canvasWrapper.style.display = "none";
            this.sendNotification('SHOW_MODULES');
        });
    }
});
