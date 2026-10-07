import subprocess
import time
import json
import urllib.request

def main():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    port = 9222
    
    # Start Chrome with remote debugging
    proc = subprocess.Popen([
        chrome_path,
        "--headless=new",
        f"--remote-debugging-port={port}",
        "http://localhost:5174/"
    ])
    
    time.sleep(2)
    
    try:
        # Get target websocket URL
        tabs_url = f"http://127.0.0.1:{port}/json"
        with urllib.request.urlopen(tabs_url) as resp:
            tabs = json.loads(resp.read().decode())
        
        print("Tabs found:", len(tabs))
        for tab in tabs:
            print("Tab URL:", tab.get("url"))
            print("Tab Title:", tab.get("title"))
            
        # Connect to tab via websocket
        ws_url = tabs[0]["webSocketDebuggerUrl"]
        import urllib.parse
        
        # We can use python's built-in or test evaluating expression via HTTP target /json
        print("WebSocket URL:", ws_url)
        
    finally:
        proc.terminate()

if __name__ == "__main__":
    main()
