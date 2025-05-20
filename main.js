const inputElement = document.getElementById("input");
const terminalElement = document.getElementsByClassName("terminal-container")[0];

let currentPath = "user"

const commandHistory = []
let commandHistoryIndex = 0

const ROOTPATH = {
    "user" : {

    }
}


const COMMANDS = {
    "mkdir": function (folderName) {
        const parentFolder = getCurrentPathLocation()
        parentFolder[folderName] = {};
    },

    "cd": function( folderPath ) {
        const parentFolder = getCurrentPathLocation()
        
        folderPath.split("/").forEach( folder => {
            if (folder == "." ) {
                return
            }

            if (folder == "..") {
                currentPath = currentPath.split("/").slice(0, -1).join("/")
                return
            }

            if( parentFolder[folder] ) {
                currentPath += `/${folder}`
            }
            
        })
    },

    "clear": function () {
        const lines = document.querySelectorAll(".terminal-line");
        lines.forEach(line => line.remove());
    },

    "ls": function() {
        const currentDirKeys = Object.keys(getCurrentPathLocation());
        const container = document.getElementsByClassName('terminal-container')[0];
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = currentDirKeys.length > 0 ? currentDirKeys.join("<br>") : "no folders on this dir"
        container.append(line)
    },

    "help": function() {
        const commandsList = Object.keys(COMMANDS);
        const container = document.getElementsByClassName('terminal-container')[0];
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = commandsList.join("<br>") 
        container.append(line)
    }

}


function getCurrentPathLocation() {
    return currentPath.split("/").reduce((current, key) => {
        if (!current[key]) {
            current[key] = {};
        }
        return current[key];
    }, ROOTPATH);
}

function executeInput( value ) {
    if ( !value ) return;
    const input = value.split(" ")

    const command = COMMANDS[input[0]];

    if( !command ) {
        createMessage(`${input[0]}: command not found.`)
        createNewLine();
        commandHistory.push(value)
        commandHistoryIndex = commandHistory.length
        return
    }

    command(input[1])
    createNewLine()
    commandHistory.push(value)
    commandHistoryIndex = commandHistory.length

    console.log(ROOTPATH)
} 

function executeCommands(e) { 
    if (e.key == "Enter") {
        executeInput(this.value)
    }

    if (e.key == "ArrowUp") {
        if (commandHistory.length > 0 ) {
            commandHistoryIndex -= 1
            console.log(commandHistoryIndex)
            const inputs = document.querySelectorAll('.input');
            const lastInput = inputs[inputs.length - 1];

            lastInput.value = commandHistory[commandHistoryIndex] ? commandHistory[commandHistoryIndex] : ""
        }
    }

        if (e.key == "ArrowDown") {
            if (commandHistory.length > 0 && commandHistoryIndex >= 0) {
                commandHistoryIndex += 1
                console.log(commandHistoryIndex)
                const inputs = document.querySelectorAll('.input');
                const lastInput = inputs[inputs.length - 1];
                lastInput.value = commandHistory[commandHistoryIndex] ? commandHistory[commandHistoryIndex] : ""
            }
    }

}
function disableLastInput() {
    const inputs = document.querySelectorAll('.input');
    const lastInput = inputs[inputs.length - 1];
    if ( lastInput ){
        lastInput.disabled = true;
    }
}

function createMessage(message) {
    const container = document.getElementsByClassName('terminal-container')[0];
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = message
    container.append(line)
}

function createNewLine() {
    disableLastInput();
    const container = document.getElementsByClassName('terminal-container')[0];
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const span = document.createElement('span');
    span.className = 'dir-name';
    span.innerHTML = currentPath;

    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add("input")
    input.addEventListener("keydown", executeCommands);

    line.appendChild(span);
    line.appendChild(input);
    container.appendChild(line);
    input.focus()

}



inputElement.addEventListener("keydown", executeCommands );




(() => { document.getElementsByClassName("dir-name")[0].innerHTML = currentPath; inputElement.focus() })();