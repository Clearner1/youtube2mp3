// ==UserScript==
// @name         YouTube to MP3 Converter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Convert YouTube videos to MP3
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      loader.to
// @connect      p.oceansaver.in
// @downloadURL  https://update.greasyfork.org/scripts/512674/YouTube%20to%20MP3%20Converter.user.js
// @updateURL    https://update.greasyfork.org/scripts/512674/YouTube%20to%20MP3%20Converter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 初始化按钮
    function createDownloadButton() {
        const trigger = document.createElement('div');
        trigger.id = 'yt-mp3-trigger';

        const button = document.createElement('button');
        button.id = 'yt-mp3-download';

        const text = document.createTextNode('⬇');
        button.appendChild(text);

        button.addEventListener('click', showDownloadOptions);

        const wrapper = document.createDocumentFragment();
        wrapper.appendChild(trigger);
        wrapper.appendChild(button);

        return wrapper;
    }

    // 添加样式
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #yt-mp3-download {
                position: fixed !important;
                bottom: -30px !important;
                left: 20px !important;
                width: 40px !important;
                height: 40px !important;
                background-color: rgba(0, 0, 0, 0.6) !important;
                color: white !important;
                border: none !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                opacity: 0 !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                z-index: 9999999 !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
            }
            #yt-mp3-trigger {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                width: 100px !important;
                height: 60px !important;
                z-index: 9999998 !important;
            }
            #yt-mp3-trigger:hover + #yt-mp3-download,
            #yt-mp3-download:hover {
                bottom: 20px !important;
                opacity: 0.8 !important;
            }
            #yt-mp3-download:hover {
                transform: scale(1.1) !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // 初始化脚本
    function init() {
        console.log('Initializing YouTube MP3 Converter...');

        if (!document.getElementById('yt-mp3-styles')) {
            addStyles();
            console.log('Styles added');
        }

        if (!document.getElementById('yt-mp3-download')) {
            const elements = createDownloadButton();
            document.body.appendChild(elements);
            console.log('Button added');
        }
    }

    // 页面加载后执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        if (!document.getElementById('yt-mp3-download')) {
            init();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 显示下载选项
    function showDownloadOptions() {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) {
            alert('No video ID found. Please make sure you are on a YouTube video page.');
            return;
        }

        const API_KEY = 'a4016fa228909c2bd7cb02037ca2a34c815d03a7';
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        const optionsContainer = document.createElement('div');
        optionsContainer.id = 'yt-mp3-options';
        optionsContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            min-width: 250px;
            max-width: 300px;
            backdrop-filter: blur(5px);
            transform: translateX(0);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;

        const headerBar = document.createElement('div');
        headerBar.style.cssText = `
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: move;
        `;

        const title = document.createElement('div');
        title.textContent = 'Download Options';
        title.style.fontSize = '14px';

        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.gap = '8px';

        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = '−';
        minimizeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0 6px;
            font-size: 16px;
        `;

        let isMinimized = false;
        const content = document.createElement('div');
        content.style.cssText = `
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            transition: height 0.3s ease;
        `;

        minimizeButton.onclick = () => {
            isMinimized = !isMinimized;
            content.style.display = isMinimized ? 'none' : 'flex';
            minimizeButton.textContent = isMinimized ? '+' : '−';
            optionsContainer.style.width = isMinimized ? 'auto' : '250px';
        };

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0 6px;
            font-size: 16px;
        `;
        closeButton.onclick = () => document.body.removeChild(optionsContainer);

        buttonGroup.appendChild(minimizeButton);
        buttonGroup.appendChild(closeButton);
        headerBar.appendChild(title);
        headerBar.appendChild(buttonGroup);
        optionsContainer.appendChild(headerBar);
        optionsContainer.appendChild(content);

        const formatSelector = document.createElement('div');
        formatSelector.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        `;

        const formats = [
            { label: 'MP3', value: 'mp3' },
            { label: 'MP4 720p', value: '720' },
            { label: 'MP4 1080p', value: '1080' },
        ];

        formats.forEach((format) => {
            const button = document.createElement('button');
            button.textContent = format.label;
            button.style.cssText = `
                background-color: #333;
                color: white;
                border: none;
                padding: 8px 16px;
                cursor: pointer;
                border-radius: 4px;
                transition: background-color 0.3s ease;
            `;
            button.onmouseover = () => (button.style.backgroundColor = '#444');
            button.onmouseout = () => (button.style.backgroundColor = '#333');
            button.onclick = () => startDownload(format.value);
            formatSelector.appendChild(button);
        });

        const statusText = document.createElement('div');
        statusText.textContent = 'Select format to download';

        content.appendChild(statusText);
        content.appendChild(formatSelector);

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 100%;
            height: 4px;
            background: #333;
            border-radius: 2px;
            margin: 10px 0;
            display: none;
        `;

        const progressInner = document.createElement('div');
        progressInner.style.cssText = `
            width: 0%;
            height: 100%;
            background: #FF0000;
            border-radius: 2px;
            transition: width 0.3s ease;
        `;

        progressBar.appendChild(progressInner);
        content.appendChild(progressBar);

        document.body.appendChild(optionsContainer);

        // 添加拖动功能
        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        headerBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === headerBar) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, optionsContainer);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function startDownload(format) {
            const videoId = new URLSearchParams(window.location.search).get('v');
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const API_KEY = 'a4016fa228909c2bd7cb02037ca2a34c815d03a7';

            progressBar.style.display = 'block';
            statusText.textContent = 'Preparing download...';

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://loader.to/ajax/download.php?format=${format}&url=${encodeURIComponent(videoUrl)}&api=${API_KEY}`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.success) {
                            checkDownloadProgress(data.id, format);
                        } else {
                            statusText.textContent = 'Failed to start download';
                            console.error('Download failed:', data);
                        }
                    } catch (error) {
                        statusText.textContent = 'Error parsing response';
                        console.error('Parse error:', error);
                    }
                },
                onerror: function(error) {
                    statusText.textContent = 'Error initiating download';
                    console.error('Download request error:', error);
                }
            });
        }

        function checkDownloadProgress(downloadId, format) {
            const progressCheck = setInterval(() => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://p.oceansaver.in/ajax/progress.php?id=${downloadId}`,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (!data) {
                                clearInterval(progressCheck);
                                statusText.textContent = 'Error: Invalid progress data';
                                return;
                            }

                            const percent = (data.progress / 10).toFixed(1);
                            progressInner.style.width = `${percent}%`;
                            statusText.textContent = data.text || `Converting: ${percent}%`;

                            if (data.download_url) {
                                clearInterval(progressCheck);
                                statusText.textContent = 'Download ready!';
                                const downloadButton = document.createElement('a');
                                downloadButton.href = data.download_url;
                                downloadButton.textContent = `Download ${format.toUpperCase()}`;
                                downloadButton.style.cssText = `
                                    background-color: #FF0000;
                                    color: white;
                                    border: none;
                                    padding: 8px 16px;
                                    cursor: pointer;
                                    border-radius: 4px;
                                    text-decoration: none;
                                    margin-top: 10px;
                                `;
                                content.appendChild(downloadButton);
                            }
                        } catch (error) {
                            clearInterval(progressCheck);
                            statusText.textContent = 'Error parsing progress data';
                            console.error('Parse error:', error);
                        }
                    },
                    onerror: function(error) {
                        clearInterval(progressCheck);
                        statusText.textContent = 'Error checking progress';
                        console.error('Progress check error:', error);
                    }
                });
            }, 1000);
        }

        // 使元素可拖动的功能
        function dragElement(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            element.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();

                pos3 = e.clientX;
                pos4 = e.clientY;

                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();

                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;

                pos3 = e.clientX;
                pos4 = e.clientY;

                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    }
})();
