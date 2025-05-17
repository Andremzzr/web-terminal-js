const inputElement = document.getElementById("input");
const terminalElement = document.getElementsByClassName("terminal-container")[0];

let currentPath = "andre"

const ROOTPATH = {
    "andre" : {

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
            createNewLine()
        }

        command(input[1])
        createNewLine()

        console.log(ROOTPATH)

    }
}
function disableLastInput() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    const lastLine = terminalLines[terminalLines.length - 1];
    lastLine.querySelector('input').disabled = true;
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
}



inputElement.addEventListener("keypress", executeCommands );




(() => { document.getElementsByClassName("dir-name")[0].innerHTML = currentPath })();