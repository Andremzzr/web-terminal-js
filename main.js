const inputElement = document.getElementById("input");
const terminalElement = document.getElementsByClassName("terminal-container")[0];

let currentPath = "andre"

const ROOTPATH = {
    "andre" : {

    }
}

const COMMANDS = {
    "mkdir": function(folderName){
        ROOTPATH[currentPath][folderName] = {} 
    },

    "cd": function( folderPath) {
        folderPath.split("/").forEach(folder => {
            if( ROOTPATH[currentPath][folder] ) {
                currentPath += `/${folder}`
            }
            
        })
    }
}

function executeCommands(e) {

    if (e.key == "Enter") {
        if ( !this.value ) return;
        const input = this.value.split(" ")

        const command = COMMANDS[input[0]];

        if( !command ) return

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