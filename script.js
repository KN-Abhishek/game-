// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
    let startButton = document.getElementById("start-button");
    let titleScreen = document.getElementById("title-screen");
    let gameContainer = document.getElementById("game-container");
    let bloodContainer = document.getElementById("blood-container");
    let ghost = document.getElementById("ghost");
    let gameActive = false; // Track if the game is active

    // Hide ghost initially
    ghost.style.display = "none";

    // Start Game
    let backgroundMusic = new Audio("sound.mp3"); // Replace with your actual file
    backgroundMusic.loop = true; // Loop the music
    backgroundMusic.volume = 0.5; // Adjust volume if needed

    startButton.addEventListener("click", function () {
        titleScreen.style.display = "none";
        gameContainer.style.display = "block";
        gameActive = true;

        backgroundMusic.play();
        
        // Start the first scene
        updateScene(
            "You stand before a creepy old mansion. The door is slightly open. Do you enter?",
            "entry.jpeg",
            ["Enter", "Leave"],
            ["enter", "leave"]
        );
    });

    // Shooting Effect
    gameContainer.addEventListener("click", function (e) {
        if (!gameActive) return;
        let blood = document.createElement("div");
        blood.classList.add("blood");
        blood.style.left = `${e.clientX - 50}px`;
        blood.style.top = `${e.clientY - 50}px`;
        bloodContainer.appendChild(blood);
        setTimeout(() => blood.remove(), 1000);
        new Audio("gunshot.mp3").play();
    });
});

// Function to animate ghost
// Function to animate the ghost growing from center
function moveGhost() {
    let ghost = document.getElementById("ghost");

    // Set initial position and size
    ghost.style.display = "block";
    ghost.style.position = "absolute";
    ghost.style.left = "50%";
    ghost.style.top = "50%";
    ghost.style.transform = "translate(-50%, -50%)"; // Center ghost
    ghost.style.width = "0px";
    ghost.style.height = "auto"; // Maintain aspect ratio
    ghost.style.opacity = "0";

    let size = 0;
    let opacity = 0;

    function animate() {
        if (size < window.innerWidth * 0.9) { // 90% of the screen width
            size += 10; // Increase size gradually
            opacity += 0.02; // Increase opacity
            ghost.style.width = `${size}px`;
            ghost.style.opacity = opacity;
            requestAnimationFrame(animate);
        }
    }

    animate();
}


// Function for typing effect
function typeText(text) {
    let storyText = document.getElementById("story");
    storyText.innerHTML = "";
    let i = 0;
    function typing() {
        if (i < text.length) {
            storyText.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, 50);
        }
    }
    typing();
}

// Function to update the scene
function updateScene(text, image, buttonLabels, buttonActions) {
    let gameContent = document.getElementById("game-content");
    let gameContainer = document.getElementById("game-container");
    gameContainer.style.backgroundImage = `url('${image}')`;
    typeText(text);
    let buttonsHTML = "<div class='choice-container'>";
    for (let i = 0; i < buttonLabels.length; i++) {
        buttonsHTML += `<button class="choice-button" onclick="choose('${buttonActions[i]}')">${buttonLabels[i]}</button>`;
    }
    buttonsHTML += "</div>";
    gameContent.innerHTML = `<p id="story"></p>${buttonsHTML}`;
    typeText(text);
}

// Function to handle choices
function choose(option) {
    let gameContainer = document.getElementById("game-container");
    let ghost = document.getElementById("ghost");
    gameContainer.style.backgroundImage = "none";
    
    if (option === "enter") {
        updateScene("You step inside. There's a staircase and a door. Do you go upstairs or open the door?", "b.jpeg", 
            ["Go Upstairs", "Explore the Door"], ["staircase", "door"]);
    } else if (option === "leave") {
        document.getElementById("title-screen").style.display = "flex";
        document.getElementById("game-container").style.display = "none";
    } else if (option === "staircase") {
        updateScene("You go upstairs. A ghostly figure appears at the top of the stairs... Do you run or stay?", "basement.jpeg", 
            ["Run", "Stay"], ["run", "stay"]);
    } else if (option === "run") {
        updateScene("You run back downstairs, but the front door slams shut behind you! You're trapped!", "locked.jpeg", 
            ["Look for Another Exit"], ["find_exit"]);
    } else if (option === "stay") {
        updateScene("A ghostly figure appears. A candle lights itself, revealing an old diary. Do you read it?", "basement.jpeg",
             ["Read the Diary", "Ignore it"], ["read_diary", "ignore_diary"]);
        setTimeout(moveGhost, 1000);
    } else if (option === "door") {
        updateScene("The door creaks open, revealing a dark room with a flickering light. A shadow moves in the corner...", "dark_room.jpeg", 
            ["Investigate the Shadow", "Close the Door"], ["shadow", "close_door"]);
    } else if (option === "keep_walking") {
        updateScene("You keep walking and find a stairway leading to the basement. Do you go down?", "basement.jpeg", 
            ["Go Downstairs", "Turn Back"], ["basement", "turn_back"]);
    }
}
