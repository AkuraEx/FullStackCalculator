const API_URL = '/api';

// Variable to store if an operation has been pressed
// so that it is not pressed twice in a row
let symbolPress = 0;

// This function loads the history of equations
async function loadHistory() {
    const response = await fetch(API_URL);
    const history = await response.json();

    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';

    history.forEach((msg) => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('history');
        newDiv.innerHTML = `
            <button class = "clr" onClick="pastEquation(${msg.result})">${msg.equation} ${msg.result} </button>    

            <script src="script.js"></script>
        `;

        historyDiv.appendChild(newDiv);

    });
}

// This function adds to the string of numbers to be calculated
function addNum(val) {    
    
    if(document.getElementById('display').value == 0) {
        document.getElementById('display').value = val;
    } else{
    document.getElementById('display').value += val;
    }
    symbolPress = 0;
}

// --------------- Math Operations: ------------------ //
function add() {

    if(document.getElementById('display').value == 0) {
        document.getElementById('display').value += '+';
    }else if(symbolPress == 0) {
        document.getElementById('display').value += '+';
    }
    symbolPress = 1;
}

function sub() {

    if(document.getElementById('display').value == 0) {
        document.getElementById('display').value += '-';
    }else if(symbolPress == 0) {
        document.getElementById('display').value += '-';
    }
    symbolPress = 1;
}

function mul() {

    if(document.getElementById('display').value != 0 && symbolPress == 0) {
        document.getElementById('display').value += '*';
    }
    symbolPress = 1;
}

function div() {

    if(document.getElementById('display').value != 0 && symbolPress == 0) {
        document.getElementById('display').value += '/';
    }
    symbolPress = 1;
}


// This function clears the string displayed 
function clearDisplay() {
    const input = document.getElementById('display');
    input.removeAttribute('readonly');
    input.value = '';
    input.setAttribute('readonly', true);
}


// Equal Operator: Submit
document.getElementById('equals').addEventListener('click', async () => {

    const result = handleEquation(document.getElementById('display').value);
    const equation = document.getElementById('display').value + '=';
    
    // Display is updated
    document.getElementById('display').value = result;


    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({equation, result})
    });

    loadHistory();
});


// This function exists to parse the string built
// by the user when they hit the equals sign
function handleEquation(equation) {
    
    const numArray = equation.split(/[+\-*/]/).map(Number);
    const opArray = equation.match(/[+\-*/]/g);

    let result = numArray[0];

    for (let i = 0; i < opArray.length; i++) {
        switch (opArray[i]) {
            case '+':
                result += numArray[i + 1];
        }
        switch (opArray[i]) {
            case '-':
                result -= numArray[i + 1];
        }
        switch (opArray[i]) {
            case '*':
                result *= numArray[i + 1];
        }
        switch (opArray[i]) {
            case '/':
                if(numArray[i + 1] == 0) {
                    result = 0;
                } else {
                    result /= numArray[i + 1];
                }
        }
    }

    if(!Number.isInteger(result)) {
        result = result.toFixed(3);
    }

    return result;
}


// This function allows the user to add
// previous results to the display field
function pastEquation(result) {
    const input = document.getElementById('display');
    input.removeAttribute('readonly');
    input.value = result;
    input.setAttribute('readonly', true);
}

// Initial Load
time();