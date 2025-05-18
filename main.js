const inputElement = document.getElementById("input");
const terminalElement = document.getElementsByClassName("terminal-container")[0];

let currentPath = "user"

const ROOTPATH = {
    "user" : {

    }
}


const COMMANDS = {
    "mkdir": function (folderName) {
        const parentFolder = getCurrentPathLocation()
        console.log(parentFolder)
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

function executeCommands(e) {

    if (e.key == "Enter") {
        if ( !this.value ) return;
        const input = this.value.split(" ")

        const command = COMMANDS[input[0]];

        if( !command ) {
            createNewLine();
            return
        }

        command(input[1])
        createNewLine()

        console.log(ROOTPATH)

    }
}
function disableLastInput() {
    const inputs = document.querySelectorAll('.input');
    const lastInput = inputs[inputs.length - 1];
    if ( lastInput ){
        lastInput.disabled = true;
    }
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
    input.addEventListener("keypress", executeCommands);

    line.appendChild(span);
    line.appendChild(input);
    container.appendChild(line);
    input.focus()

}



inputElement.addEventListener("keypress", executeCommands );




(() => { document.getElementsByClassName("dir-name")[0].innerHTML = currentPath; inputElement.focus() })();