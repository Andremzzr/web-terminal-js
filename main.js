
function base62RandomHash(length = 8) {
    const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * 62);
        result += base62Chars[index];
    }
    return result;
}

class Terminal {

    constructor() {
        this.id = base62RandomHash()
        this.containerElement = document.createElement("div");
        this.containerElement.classList.add('terminal-container');
        document.body.append(this.containerElement)
        this.containerElement.id = `terminal-container-${this.id}`
        if (!this.containerElement) {
            throw new Error(`Container ${containerSelector} not found`);
        }
        
        this.currentPath = "user";
        this.commandHistory = [];
        this.commandHistoryIndex = 0;
        
        this.rootPath = {
            "user": {}
        };
        
        this.commands = {
            "mkdir": (folderName) => this.mkdir(folderName),
            "cd": (folderPath) => this.cd(folderPath),
            "clear": () => this.clear(),
            "ls": () => this.ls(),
            "help": () => this.help()
        };
        
        this.init();
    }
    
    init() {
  const terminalHTML = `
        <div class="terminal-line">
            Welcome to Webuntu v4.0.4 :P </br> ** Documentation: <a target='_blank' href='https://github.com/Andremzzr/web-terminal-js'>https://github.com/Andremzzr/web-terminal-js </a>
        </div>
        <div class="terminal-line">
<pre>
#   __     __  ______  ______  __  __  __       ______  ______  ______  __    __  __  __   __  ______  __        
#  /\\ \\  _ \\ \\/\\  ___\\/\\  == \\/\\ \\/\\_\\_\\_\\     /\\__  _\\/\\  ___\\/\\  == \\/\\ "-./  \\/\\ \\/\\ "-.\\  \\/\\  __ \\/\\ \\       
#  \\ \\ \\/ ".\\ \\ \\  __\\\\ \\  __<\\ \\ \\/_/\\_\\/_    \\/_/\\ \\/\\ \\  __\\\\ \\  __<\\ \\ \\-./\\ \\ \\ \\ \\ \\-.  \\ \\  __ \\ \\ \\____  
#   \\ \\__/".\~\\_\\ \\_____\\ \\_____\\ \\_\\/\\_\\/\\_\\      \\ \\_\\ \\ \\_____\\ \\_\\ \\_\\ \\_\\ \\ \\_\\ \\_\\ \\_\\\\"\\_\\ \\_\\ \\_\\ \\_____\\ 
#    \\/_/   \\/_/\\/_____/\\/_____/\\/_/\\/_/\\/_/       \\/_/  \\/_____/\\/_/ /_/\\/_/  \\/_/\\/_/\\/_/ \\/_/\\/_/\\/_/\\/_____/
#</pre>
        </div>
  `;
        
        this.containerElement.innerHTML += terminalHTML;
        this.createMessage('** Type "help" to see your commands.')
        this.createNewLine();
    }
    
    getCurrentPathLocation() {
        return this.currentPath.split("/").reduce((current, key) => {
            if (!current[key]) {
                current[key] = {};
            }
            return current[key];
        }, this.rootPath);
    }
    
    executeInput(value) {
        if (!value) return;
        const input = value.split(" ");
        const commandName = input[0];
        const args = input.slice(1);
        
        const command = this.commands[commandName];
        
        if (!command) {
            this.createMessage(`${commandName}: command not found.`);
            this.createNewLine();
            this.commandHistory.push(value);
            this.commandHistoryIndex = this.commandHistory.length;
            return;
        }
        
        command(args[0]);
        this.createNewLine();
        this.commandHistory.push(value);
        this.commandHistoryIndex = this.commandHistory.length;
    }
    
    executeCommands(e) {
        if (e.key === "Enter") {
            this.executeInput(e.target.value);
        } else if (e.key === "ArrowUp") {
            if (this.commandHistory.length > 0 && this.commandHistoryIndex >= 1) {
                this.commandHistoryIndex -= 1;
                const inputs = this.containerElement.querySelectorAll('.input');
                const lastInput = inputs[inputs.length - 1];
                
                lastInput.value = this.commandHistory[this.commandHistoryIndex] || "";
            }
        } else if (e.key === "ArrowDown") {
            if (this.commandHistory.length > 0 && this.commandHistoryIndex < this.commandHistory.length) {
                this.commandHistoryIndex += 1;
                const inputs = this.containerElement.querySelectorAll('.input');
                const lastInput = inputs[inputs.length - 1];
                lastInput.value = this.commandHistory[this.commandHistoryIndex] || "";
            }
        } else if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
            e.preventDefault()
            this.clear()
            this.createNewLine()
        }
    }
    
    disableLastInput() {
        const inputs = this.containerElement.querySelectorAll('.input');
        const lastInput = inputs[inputs.length - 1];
        if (lastInput) {
            lastInput.disabled = true;
        }
    }
    
    createMessage(message) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = message;
        this.containerElement.appendChild(line);
    }
    
    createNewLine() {
        this.disableLastInput();
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        const span = document.createElement('span');
        span.className = 'dir-name';
        span.innerHTML = this.currentPath;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add("input");
        input.addEventListener("keydown", (e) => this.executeCommands(e));
        
        line.appendChild(span);
        line.appendChild(input);
        this.containerElement.appendChild(line);
        input.focus();
    }
    
    mkdir(folderName) {
        if (!folderName) {
            this.createMessage("mkdir: missing operand");
            return;
        }
        const parentFolder = this.getCurrentPathLocation();
        parentFolder[folderName] = {};
    }
    
    cd(folderPath) {
        if (!folderPath) {
            this.currentPath = "user";
            return;
        }
        
        const originalPath = this.currentPath;
        const parentFolder = this.getCurrentPathLocation();
        
        folderPath.split("/").forEach(folder => {
            if (folder === ".") {
                return;
            }
            
            if (folder === "..") {
                const pathParts = this.currentPath.split("/");
                if (pathParts.length > 1) {
                    this.currentPath = pathParts.slice(0, -1).join("/");
                }
                return;
            }
            
            if (parentFolder[folder]) {
                this.currentPath += `/${folder}`;
            } else {
                this.createMessage(`cd: ${folder}: No such directory`);
                this.currentPath = originalPath; 
                return;
            }
        });
    }
    
    clear() {
        const lines = this.containerElement.querySelectorAll(".terminal-line");
        if(lines.length > 0) {
            lines.forEach(line => line.remove());
        }
    }
    
    ls() {
        const currentDirKeys = Object.keys(this.getCurrentPathLocation());
        const content = currentDirKeys.length > 0 
            ? ".<br>..<br>" + currentDirKeys.join("<br>") 
            : "no folders in this directory";
        this.createMessage(content);
    }
    
    help() {
        const helpMessage = `mkdir: Creates a new directory (folder) in the file system. <br>
                            cd: Changes the current working directory. It allows you to navigate through the file system by moving between directories.<br>
                            clear: Clears the terminal screen, removing all previously displayed content and giving you a clean workspace.<br>
                            ls: Lists the contents of the current directory (or a specified directory), showing files and subdirectories.<br>
                            help: Displays help information for built-in shell commands.`
        this.createMessage(helpMessage);
    }
    
}


const terminal = new Terminal()