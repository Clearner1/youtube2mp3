// ==UserScript==
// @name         YouTube MP3 Downloader Storage Config
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Storage configuration for YouTube MP3 Downloader
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// ==/UserScript==

const StorageManager = {
    _memoryStorage: new Map(),
    
    init() {
        this.storage = this._getStorageImplementation();
        return this;
    },

    _getStorageImplementation() {
        // 按优先级尝试不同的存储方式
        if (typeof GM_getValue !== 'undefined' && typeof GM_setValue !== 'undefined') {
            console.log('Using GM Storage');
            return {
                type: 'GM_Storage',
                set: (key, value) => {
                    try {
                        GM_setValue(key, value);
                        return true;
                    } catch (e) {
                        console.error('GM Storage error:', e);
                        return false;
                    }
                },
                get: (key) => {
                    try {
                        return GM_getValue(key);
                    } catch (e) {
                        console.error('GM Storage error:', e);
                        return null;
                    }
                }
            };
        }
        
        if (typeof localStorage !== 'undefined') {
            console.log('Using localStorage');
            return {
                type: 'localStorage',
                set: (key, value) => {
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                        return true;
                    } catch (e) {
                        console.error('localStorage error:', e);
                        return false;
                    }
                },
                get: (key) => {
                    try {
                        const item = localStorage.getItem(key);
                        return item ? JSON.parse(item) : null;
                    } catch (e) {
                        console.error('localStorage error:', e);
                        return null;
                    }
                }
            };
        }

        console.log('Using memory storage');
        return {
            type: 'memoryStorage',
            set: (key, value) => {
                try {
                    this._memoryStorage.set(key, value);
                    return true;
                } catch (e) {
                    console.error('Memory storage error:', e);
                    return false;
                }
            },
            get: (key) => {
                try {
                    return this._memoryStorage.get(key);
                } catch (e) {
                    console.error('Memory storage error:', e);
                    return null;
                }
            }
        };
    }
};

// 导出存储管理器实例
const storageManager = StorageManager.init(); 