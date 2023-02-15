var tree = document.querySelector(".layerContainer");
let inputField = document.querySelector(".stringInput");
var codeContainer = document.querySelector(".codeContainer");

//Idea from https://voskan.host/2023/01/29/huffman-data-compression-using-javascript/
class char{
    constructor(char){
        this.char = char;
        this.encoding = "";
    }
}

inputField.querySelector(".submit").addEventListener("click", (event) => {
    codeContainer.innerHTML = "";
    tree.innerHTML = "";
    let inputString = inputField.querySelector(".inputField").value;
    inputField.querySelector(".inputField").value = "";
    getChars(inputString);
})


let charArray = [];

function getChars(string){
    let numbers = [];
    let checkedChars = [];
    charArray = []
    for(i = 0; i < string.length; i++){
        let checkChar = string.charAt(i);
        if(!checkedChars.includes(checkChar)){
            let occurences = string.split(checkChar).length - 1;
            checkedChars.push(checkChar);
            numbers.push([checkChar, occurences]);
        }
    }
    numbers.forEach(number => {
        charArray.push(new char(number[0]))
    })

    if(numbers.length < 2){
        document.querySelector(".inputField").innerText = "must be at least 2 different characters"
    }else{
        createTree(numbers);
        encode(string);
    }
}

function createTree(numbers){
    //From https://www.codingem.com/javascript-sort-an-array-of-arrays/#:~:text=To%20sort%20the%20array%20of,magnitude%20of%20the%20second%20elements.
    numbers.sort((a,b) => b[1] - a[1]);
    console.log(charArray);

    //While-Loop is and idea from https://voskan.host/2023/01/29/huffman-data-compression-using-javascript/
    while(numbers.length > 1)
    {
        let branchOne = [numbers[0][0]];
        let branchTwo = [numbers[1][0]];
        if(numbers[0][0] === ""){
            branchOne = numbers[0][2];
        }
        if(numbers[1][0] === ""){
            branchTwo = numbers[1][2];
        }

        charArray.forEach(object => {
            if(branchOne.includes(object.char)){
                object.encoding += "0";
            }

            if(branchTwo.includes(object.char))
            {
                object.encoding += "1";
            }
        })
        

        let nums = [numbers[0], numbers[1]]
        let newNumber = numbers[0][1] + numbers[1][1];
        
        //Deletion Process from https://www.geeksforgeeks.org/how-to-remove-multiple-elements-from-array-in-javascript/
        let remove = [0, 1];
        for (var i = remove.length -1; i >= 0; i--){
            numbers.splice(remove[i], 1);   
        }

        if(nums[0][0] === "" && nums[1][0] === ""){
            let newArray = [].concat(nums[0][2]).concat(nums[1][2]);
            numbers.push(["", newNumber, newArray]);
        }
        else if(nums[1][0] === ""){
            let newArray = [nums[0][0]].concat(nums[1][2]);
            numbers.push(["", newNumber, newArray]);
        }
        else if(nums[0][0] === ""){
            let newArray = [nums[1][0]].concat(nums[0][2]);
            numbers.push(["", newNumber, newArray]);
        }
        else{
            numbers.push(["", newNumber, [nums[0][0], nums[1][0]]]);
        }

        renderTree(numbers, newNumber, nums)
    }
}

function encode(string){
    charArray.forEach(object => {
        object.encoding = reverseString(object.encoding);
    })

    let encodedString = "";
    for(i = 0; i < string.length; i++){
        charArray.forEach(object => {
            if(object.char === string[i]){
                encodedString += `${object.encoding} `
            }
        })
    }

    codeContainer.innerHTML += `
    <div class="codeTitle">encoded string</div>
    <div class="code">${encodedString}</div>`;
}

//from https://www.freecodecamp.org/news/how-to-reverse-a-string-in-javascript-in-3-different-ways-75e4763c68cb/
function reverseString(str) {
    var splitString = str.split("");
 
    var reverseArray = splitString.reverse();
 
    var joinArray = reverseArray.join("");
    
    return joinArray;
}

//from https://www.naukri.com/learning/articles/remove-duplicates-javascript-array/
function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}

function returnNode(number){
    let usablenode;
    let alreadyDone = 0;
    document.querySelectorAll(".mainnode").forEach(node => {
        if(alreadyDone === 0 && parseInt(node.querySelector(".amount").innerText) === number[1] && node.querySelector(".char").innerText === number[0]){
            alreadyDone++;
            node.setAttribute("class", "node")
            usablenode = node.parentElement.innerHTML;
            node.parentElement.remove();
        }
    })
    return usablenode;
}
function renderTree(numbers, newNumber, nums){
    let firstNode;
    let secondNode;

    if(nums[0][0] === ""){
        firstNode = returnNode(nums[0]);
    }
    else{
        firstNode = `<div class="node">
        <div class="amount">${nums[0][1]}</div>
        <div class="char">' ${nums[0][0]} '</div>
        </div>`;
    }

    if(nums[1][0] === ""){
        secondNode = returnNode(nums[1]);
    }
    else{
        secondNode = `<div class="node">
        <div class="amount">${nums[1][1]}</div>
        <div class="char">' ${nums[1][0]} '</div>
        </div>`;
    }
    
    
    tree.innerHTML += `
    <div class="upperbranch">
        <div class="node mainnode">
        <div class="amount">${newNumber}</div>
        <div class="char"></div>
        </div>
        <div class="connectDots">
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
        <div class="branch">
            <div class="upperbranch">
            ${firstNode}
            </div>
            <div class="upperbranch">
            ${secondNode}
            </div>
        </div>
    </div>`;
}