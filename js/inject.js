var scriptElement = document.createElement('script')
scriptElement.type = 'text/javascript'
scriptElement.src = chrome.runtime.getURL('js/fetch_script.js')
document.documentElement.appendChild(scriptElement);