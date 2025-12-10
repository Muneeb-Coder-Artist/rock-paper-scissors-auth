/* ---------------- REGISTRATION + LOGIN ---------------- */

function showRegister() {
  registerBox.classList.add("active");
  loginBox.classList.remove("active");
  welcomeBox.classList.remove("active");
  gameBox.classList.remove("active");
  clearErrors();
}

function showLogin() {
  loginBox.classList.add("active");
  registerBox.classList.remove("active");
  welcomeBox.classList.remove("active");
  gameBox.classList.remove("active");
  clearErrors();
}

function showWelcome() {
  welcomeBox.classList.add("active");
  registerBox.classList.remove("active");
  loginBox.classList.remove("active");
  gameBox.classList.remove("active");
  username.innerText = localStorage.getItem("name");
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => e.innerText = "");
  document.querySelectorAll("input").forEach(i => i.classList.remove("invalid"));
}

function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*]).{8,}$/.test(password);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function register() {
  clearErrors();
  let name = regName.value.trim();
  let email = regEmail.value.trim();
  let password = regPassword.value;

  let valid = true;

  if (!name) { nameError.innerText="Name required"; regName.classList.add("invalid"); valid=false; }
  if (!email) { emailError.innerText="Email required"; regEmail.classList.add("invalid"); valid=false; }
  else if (!email.includes("@")) { emailError.innerText="Email must include @"; regEmail.classList.add("invalid"); valid=false; }
  if (!password) { passwordError.innerText="Password required"; regPassword.classList.add("invalid"); valid=false; }
  else if (!isValidPassword(password)) { passwordError.innerText="8+ chars, upper, lower, number & symbol"; regPassword.classList.add("invalid"); valid=false; }

  if (!valid) return;

  localStorage.setItem("name", name);
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);
  showLogin();
}

function login() {
  clearErrors();
  let email = loginEmail.value.trim();
  let password = loginPassword.value;

  let savedEmail = localStorage.getItem("email");
  let savedPass = localStorage.getItem("password");

  let valid = true;
  if (!email) { loginEmailError.innerText="Email required"; loginEmail.classList.add("invalid"); valid=false; }
  if (!password) { loginPasswordError.innerText="Password required"; loginPassword.classList.add("invalid"); valid=false; }
  if (!valid) return;

  if (email===savedEmail && password===savedPass) showWelcome();
  else { loginPasswordError.innerText="Invalid Email or Password"; loginEmail.classList.add("invalid"); loginPassword.classList.add("invalid"); }
}

function logout() { showLogin(); }

/* ---------------- EMAIL AUTO COMPLETE ---------------- */
function autoCompleteEmail(input) {
  input.addEventListener("input", () => {
    let val = input.value;
    if (val.includes("@") && !val.includes(".") && !val.endsWith(".com")) {
      let parts = val.split("@");
      if(parts[1]==="") {
        input.value = parts[0]+"@gmail.com";
        input.setSelectionRange(parts[0].length+1, input.value.length);
      }
    }
  });
}

autoCompleteEmail(regEmail);
autoCompleteEmail(loginEmail);

/* ---------------- GAME LOGIC ---------------- */
let mode="", player1="", player2="";

function startGame(){
  welcomeBox.classList.remove("active");
  gameBox.classList.add("active");
  modeSelect.style.display="block";
  gameArea.style.display="none";
}

function exitGame(){
  resetGame();
  gameArea.style.display="none";
  modeSelect.style.display="block";
  showWelcome();
}

function setMode(selectedMode){
  mode = selectedMode;
  modeSelect.style.display="none";
  gameArea.style.display="block";
}

function playerMove(choice){
  if(mode==="friend"){
    if(player1===""){ player1=choice; turnMsg.innerText="Player 2: Choose your move"; }
    else{ player2=choice; checkWinner(); }
  } else {
    player1=choice;
    let cpu=["Stone","Paper","Scissors"];
    player2=cpu[Math.floor(Math.random()*3)];
    checkWinner();
  }
}

function checkWinner(){
  playerChoice.innerText="Player 1 chose: "+player1;
  cpuChoice.innerText=(mode==="cpu")?"CPU chose: "+player2:"Player 2 chose: "+player2;

  if(player1===player2) result.innerText="It's a Draw!";
  else if(
    (player1==="Stone" && player2==="Scissors")||
    (player1==="Paper" && player2==="Stone")||
    (player1==="Scissors" && player2==="Paper")
  ) result.innerText="Player 1 Wins!";
  else result.innerText=(mode==="cpu")?"CPU Wins!":"Player 2 Wins!";

  turnMsg.innerText="Game Over!";
}

function resetGame(){
  player1=""; player2="";
  playerChoice.innerText=""; cpuChoice.innerText=""; result.innerText="";
  turnMsg.innerText=(mode==="cpu")?"Choose your move":"Player 1: Choose your move";
}
