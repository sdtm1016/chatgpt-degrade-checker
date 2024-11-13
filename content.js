(function () {
	"use strict";

	// 创建显示框
	const displayBox = document.createElement("div");
	displayBox.style.position = "fixed";
	displayBox.style.top = "50%";
	displayBox.style.right = "20px";
	displayBox.style.transform = "translateY(-50%)";
	displayBox.style.width = "220px";
	displayBox.style.padding = "10px";
	displayBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
	displayBox.style.color = "#fff";
	displayBox.style.fontSize = "14px";
	displayBox.style.borderRadius = "8px";
	displayBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
	displayBox.style.zIndex = "10000";
	displayBox.style.transition = "all 0.3s ease";
	displayBox.style.display = "none";

	displayBox.innerHTML = `
	 <div style="
            padding-bottom: 8px;
            border-bottom: 0.5px solid rgba(255, 255, 255, 0.15);
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            letter-spacing: 0.3px;
        ">
            ChatGPT Degrade Checker
    </div>
        <div style="margin-bottom: 10px;">
            <strong>PoW Information</strong>
        </div>
        <div id="content">
            PoW Difficulty: <span id="difficulty">N/A</span><span id="difficulty-level" style="margin-left: 3px"></span>
            <span id="difficulty-tooltip" style="
                cursor: pointer;
                color: #fff;
                font-size: 12px;
                display: inline-block;
                width: 16px;
                height: 16px;
                line-height: 14px;
                text-align: center;
                border-radius: 50%;
                border: 1px solid #fff;
                margin-left: 3px;
            ">?</span><br>
            IP Quality: <span id="ip-quality">N/A</span><br>
            <span id="persona-container" style="display: none">User Type: <span id="persona">N/A</span></span>
        </div>
       
	<div style="
            margin-top: 12px;
            padding-top: 8px;
            border-top: 0.5px solid rgba(255, 255, 255, 0.15);
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            letter-spacing: 0.3px;
        ">
            Help: upchatgpt.cn
    </div>`;
	document.body.appendChild(displayBox);

	// 创建收缩状态的指示器
	const collapsedIndicator = document.createElement("div");
	collapsedIndicator.style.position = "fixed";
	collapsedIndicator.style.top = "50%";
	collapsedIndicator.style.right = "20px";
	collapsedIndicator.style.transform = "translateY(-50%)";
	collapsedIndicator.style.width = "32px";
	collapsedIndicator.style.height = "32px";
	collapsedIndicator.style.backgroundColor = "transparent";
	collapsedIndicator.style.borderRadius = "50%";
	collapsedIndicator.style.cursor = "pointer";
	collapsedIndicator.style.zIndex = "10000";
	collapsedIndicator.style.padding = "4px";
	collapsedIndicator.style.display = "flex";
	collapsedIndicator.style.alignItems = "center";
	collapsedIndicator.style.justifyContent = "center";
	collapsedIndicator.style.transition = "all 0.3s ease";

	// 使用SVG作为指示器
	collapsedIndicator.innerHTML = `
    <svg id="status-icon" width="32" height="32" viewBox="0 0 64 64" style="transition: all 0.3s ease;">
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g id="icon-group" filter="url(#glow)">
            <circle cx="32" cy="32" r="28" fill="url(#gradient)" stroke="#fff" stroke-width="2"/>
            <circle cx="32" cy="32" r="20" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="100">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 32 32"
                    to="360 32 32"
                    dur="8s"
                    repeatCount="indefinite"/>
            </circle>
            <circle cx="32" cy="32" r="12" fill="none" stroke="#fff" stroke-width="2">
                <animate
                    attributeName="r"
                    values="12;14;12"
                    dur="2s"
                    repeatCount="indefinite"/>
            </circle>
            <circle id="center-dot" cx="32" cy="32" r="4" fill="#fff">
                <animate
                    attributeName="r"
                    values="4;6;4"
                    dur="2s"
                    repeatCount="indefinite"/>
            </circle>
        </g>
    </svg>`;
	document.body.appendChild(collapsedIndicator);

	// 鼠标悬停事件
	collapsedIndicator.addEventListener("mouseenter", function () {
		displayBox.style.display = "block";
		collapsedIndicator.style.opacity = "0";
	});

	displayBox.addEventListener("mouseleave", function () {
		displayBox.style.display = "none";
		collapsedIndicator.style.opacity = "1";
	});

	// 创建提示框
	const tooltip = document.createElement("div");
	tooltip.id = "tooltip";
	tooltip.innerText =
		"A lower value indicates higher PoW difficulty, suggesting that ChatGPT may consider your IP as higher risk.";
	tooltip.style.position = "fixed";
	tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
	tooltip.style.color = "#fff";
	tooltip.style.padding = "8px 12px";
	tooltip.style.borderRadius = "5px";
	tooltip.style.fontSize = "12px";
	tooltip.style.visibility = "hidden";
	tooltip.style.zIndex = "10001";
	tooltip.style.width = "240px";
	tooltip.style.lineHeight = "1.4";
	tooltip.style.pointerEvents = "none";
	document.body.appendChild(tooltip);

	// 显示提示
	document
		.getElementById("difficulty-tooltip")
		.addEventListener("mouseenter", function (event) {
			tooltip.style.visibility = "visible";

			const tooltipWidth = 240;
			const mouseX = event.clientX;
			const mouseY = event.clientY;

			let leftPosition = mouseX - tooltipWidth - 10;
			if (leftPosition < 10) {
				leftPosition = mouseX + 20;
			}

			let topPosition = mouseY - 40;

			tooltip.style.left = `${leftPosition}px`;
			tooltip.style.top = `${topPosition}px`;
		});

	// 隐藏提示
	document
		.getElementById("difficulty-tooltip")
		.addEventListener("mouseleave", function () {
			tooltip.style.visibility = "hidden";
		});

	// 更新difficulty指示器
	function updateDifficultyIndicator(difficulty) {
		const difficultyLevel = document.getElementById("difficulty-level");
		const ipQuality = document.getElementById("ip-quality");

		if (difficulty === "N/A") {
			setIconColors("#888", "#666");
			difficultyLevel.innerText = "";
			ipQuality.innerHTML = "N/A";
			return;
		}

		const cleanDifficulty = difficulty.replace("0x", "").replace(/^0+/, "");
		const hexLength = cleanDifficulty.length;

		let color, secondaryColor, textColor, level, qualityText;

		if (hexLength <= 2) {
			color = "#F44336";
			secondaryColor = "#d32f2f";
			textColor = "#ff6b6b";
			level = "(Difficult)";
			qualityText = "High Risk";
		} else if (hexLength === 3) {
			color = "#FFC107";
			secondaryColor = "#ffa000";
			textColor = "#ffd700";
			level = "(Medium)";
			qualityText = "Moderate";
		} else if (hexLength === 4) {
			color = "#8BC34A";
			secondaryColor = "#689f38";
			textColor = "#9acd32";
			level = "(Easy)";
			qualityText = "Good";
		} else {
			color = "#4CAF50";
			secondaryColor = "#388e3c";
			textColor = "#98fb98";
			level = "(Very Easy)";
			qualityText = "Excellent";
		}

		setIconColors(color, secondaryColor);
		difficultyLevel.innerHTML = `<span style="color: ${textColor}">${level}</span>`;
		ipQuality.innerHTML = `<span style="color: ${textColor}">${qualityText}</span>`;
	}

	function setIconColors(primaryColor, secondaryColor) {
		const gradient = document.querySelector("#gradient");
		gradient.innerHTML = `
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
        `;
	}

	window.addEventListener("message", function(e){
		const difficulty = e.data.difficulty;
		const persona = e.data.persona;
		document.getElementById("difficulty").innerText = difficulty;
		const personaContainer = document.getElementById("persona-container");
		personaContainer.style.display = "block";
		if (persona && !persona.toLowerCase().includes("free")) {
			document.getElementById("persona").innerText = persona;
		} else {
			document.getElementById("persona").innerText = 'freeaccount';
		}
		updateDifficultyIndicator(difficulty);
	});
})();


