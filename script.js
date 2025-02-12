// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
    let startButton = document.getElementById("start-button");
    let titleScreen = document.getElementById("title-screen");
    let gameContainer = document.getElementById("game-container");
    let ghost = document.getElementById("ghost");
    

    // Hide ghost initially
    ghost.style.display = "none";


    // Start Game
    let backgroundMusic = new Audio("sound.mp3"); // Replace with your actual file
    backgroundMusic.loop = true; // Loop the music
    backgroundMusic.volume = 0.5; // Adjust volume if needed

    let gunshotSound = new Audio("gunshot.mp3");
    gunshotSound.preload = "auto";  // Preload for instant playback
    gunshotSound.volume = 0.8;  
    let hasGun = false; // Track if player has the gun
    let isShootingMode = false;      // Adjust volume

    startButton.addEventListener("click", function () {
        titleScreen.style.display = "none";
        gameContainer.style.display = "block";
        gameActive = true;
        backgroundMusic.play();

        // Start the first scene
        updateScene(
            "You stand before a creepy old mansion. The door is slightly open. Do you enter?",
            "han.webp",
            ["Enter", "Leave"],
            ["enter", "leave"]
        );
    });
    
});
function showModal(message) {
    let modal = document.createElement("div");
    modal.className = "modal";

    let modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.innerText = message;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Show modal with eerie delay
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10);

    // Remove after 4 seconds for a haunting effect
    setTimeout(() => {
        modal.style.opacity = "0";
        setTimeout(() => modal.remove(), 500);
    }, 2500);
}



// Function to animate ghost
// Function to animate the ghost growing from center
function moveGhost() {
    let ghost = document.getElementById("ghost");
    let hasCross = false;

    if (hasCross) {
        ghost.style.display = "none"; // If the cross is collected, the ghost doesn't appear
        return;
    }

    ghost.style.display = "block";
    ghost.style.position = "absolute";
    ghost.style.left = "50%";
    ghost.style.top = "50%";
    ghost.style.transform = "translate(-50%, -50%)";
    ghost.style.width = "0px";
    ghost.style.height = "auto";
    ghost.style.opacity = "0";

    let size = 0;
    let opacity = 0;

    function animate() {
        if (hasCross) {
            ghost.style.display = "none"; // If the cross is collected during animation, stop it
            return;
        }
        
        if (size < window.innerWidth * 0.9) {
            size += 10;
            opacity += 0.02;
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
// Function to check if all puzzle pieces are in the correct place
function showPuzzle() {
    let gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = ""; // Clear previous content
    gameContainer.style.backgroundImage = "url('painting.webp')"; // Set painting image

    // Create puzzle wrapper
    let puzzleContainer = document.createElement("div");
    puzzleContainer.id = "puzzle-container";
    gameContainer.appendChild(puzzleContainer);

    // Create container for draggable puzzle pieces
    let puzzlePiecesContainer = document.createElement("div");
    puzzlePiecesContainer.id = "puzzle-pieces-container";
    puzzleContainer.appendChild(puzzlePiecesContainer);

    // Create container for the puzzle grid
    let puzzleGrid = document.createElement("div");
    puzzleGrid.id = "puzzle-grid";
    puzzleContainer.appendChild(puzzleGrid);

    let pieces = [];

    // Create an array of indexes and shuffle them for randomness
    let shuffledIndexes = Array.from({ length: 9 }, (_, i) => i).sort(() => Math.random() - 0.5);

    shuffledIndexes.forEach((randomIndex) => {
        let piece = document.createElement("img");
        piece.src = `puzzle${randomIndex + 1}.png`; // Each piece should be a separate image
        piece.classList.add("puzzle-piece");
        piece.setAttribute("draggable", "true");
        piece.dataset.index = randomIndex; // Store correct position index

        piece.style.width = "150px"; // Larger size
        piece.style.height = "150px";

        puzzlePiecesContainer.appendChild(piece); // Append to pieces container
        pieces.push(piece);
    });

    for (let i = 0; i < 9; i++) {
        let slot = document.createElement("div");
        slot.classList.add("puzzle-slot");
        slot.dataset.index = i; // Store correct index

        slot.style.width = "150px"; 
        slot.style.height = "150px"; 
        slot.style.border = "2px dashed white"; // Make grid visible

        puzzleGrid.appendChild(slot);

        slot.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        slot.addEventListener("drop", (e) => {
            e.preventDefault();
            let index = e.dataTransfer.getData("text/plain");
            let draggedPiece = pieces.find(p => p.dataset.index === index);

            if (slot.childNodes.length === 0) { 
                slot.appendChild(draggedPiece);
                draggedPiece.style.position = "static";

                // Check if the dropped piece is in the correct slot
                if (slot.dataset.index === draggedPiece.dataset.index) {
                    draggedPiece.classList.add("correct"); // Optional: add style for correct pieces
                }
            }

            checkWinCondition();
        });
    }

    pieces.forEach(piece => {
        piece.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.dataset.index);
        });
    });
}

// Function to check if all puzzle pieces are in the correct place
function checkWinCondition() {
    let slots = document.querySelectorAll(".puzzle-slot");
    let correctPieces = 0;

    slots.forEach(slot => {
        if (slot.childNodes.length > 0) {
            let piece = slot.childNodes[0];
            if (slot.dataset.index === piece.dataset.index) {
                correctPieces++;
            }
        }
    });

    if (correctPieces === 9) { // All pieces are correct
        setTimeout(() => {
            // Remove or hide the puzzle container
            document.getElementById("puzzle-container").style.display = "none";

            // Create a key element
            let key = document.createElement("img");
            key.src = "keys.gif";  // Replace with actual key image
            key.id = "secret-key";
            key.style.position = "absolute";
            key.style.left = "50%";
            key.style.top = "50%";
            key.style.transform = "translate(-50%, -50%) scale(0)";
            key.style.width = "100px"; // Adjust size
            key.style.height = "auto";
            key.style.cursor = "pointer";
            key.style.transition = "transform 1s ease-out"; // Smooth animation

            document.getElementById("game-container").appendChild(key);

            // Animate the key appearing
            setTimeout(() => {
                key.style.transform = "translate(-50%, -50%) scale(1)";
            }, 100);

            // Allow player to collect the key
            key.addEventListener("click", function () {
                key.remove(); // Remove key from screen

                // Create win message
                let winMessage = document.createElement("div");
                winMessage.innerHTML = "<h2>You Won!</h2><p>You found the way out of the cursed mansion!</p>";
                winMessage.style.position = "absolute";
                winMessage.style.left = "50%";
                winMessage.style.top = "40%";
                winMessage.style.transform = "translate(-50%, -50%)";
                winMessage.style.background = "rgba(0, 0, 0, 0.8)";
                winMessage.style.color = "white";
                winMessage.style.padding = "20px";
                winMessage.style.borderRadius = "10px";
                winMessage.style.textAlign = "center";
                winMessage.style.fontSize = "20px";
                document.getElementById("game-container").appendChild(winMessage);

                // Create Buttons Container
                let buttonContainer = document.createElement("div");
                buttonContainer.style.display = "flex";
                buttonContainer.style.justifyContent = "center";
                buttonContainer.style.gap = "15px";
                buttonContainer.style.marginTop = "20px";
                winMessage.appendChild(buttonContainer);

                // Restart Button
                let restartButton = document.createElement("button");
                restartButton.innerText = "Restart";
                restartButton.style.padding = "10px 20px";
                restartButton.style.fontSize = "18px";
                restartButton.style.background = "#ff0000";
                restartButton.style.color = "white";
                restartButton.style.border = "none";
                restartButton.style.cursor = "pointer";
                restartButton.style.borderRadius = "5px";

                restartButton.addEventListener("click", function () {
                    location.reload(); // Refresh the page to restart the game
                });

                // Get Out Button
                let getOutButton = document.createElement("button");
                getOutButton.innerText = "Get Out";
                getOutButton.style.padding = "10px 20px";
                getOutButton.style.fontSize = "18px";
                getOutButton.style.background = "#ff0000";
                getOutButton.style.color = "white";
                getOutButton.style.border = "none";
                getOutButton.style.cursor = "pointer";
                getOutButton.style.borderRadius = "5px";

                getOutButton.addEventListener("click", function () {
                    // Move to the next scene (han.webp background)
                    updateScene(
                        "You step outside into the unknown...Run for your life!",
                        "han.webp",
                        []
                    );
                });

                // Append buttons to container
                buttonContainer.appendChild(restartButton);
                buttonContainer.appendChild(getOutButton);
            });

        }, 500);
    }
}



// Function to handle choices
function choose(option) {
    let gameContainer = document.getElementById("game-container");
    let ghost = document.getElementById("ghost");
    gameContainer.style.backgroundImage = "none";

    if (ghost) {
        ghost.style.display = "none";
    }

    // Remove gun if it exists
    let existingGun = document.getElementById("gun");
    if (existingGun) {
        existingGun.remove();
    }

    // Remove cross if it exists
    let existingCross = document.getElementById("cross");
    if (existingCross) {
        existingCross.remove();
    }

    let existingBook = document.getElementById("book");
    if (existingBook) {
        existingBook.remove();
    }
    
    if (option === "enter") {
        updateScene("You step inside and see the front door , you spot a gun on the floor ,PICKUPTHEGUN!!", "gun.webp", 
            ["Go Inside", "Wait and Explore"], ["inside", "wait"]);
    // Add gun image
    let gunImage = document.createElement("img");
    gunImage.src = "gun.gif"; // Replace with your actual gun image
    gunImage.id = "gun";
    gunImage.style.position = "absolute";
    gunImage.style.bottom = "50px"; // Adjust position as needed
    gunImage.style.left = "70%";
    gunImage.style.width = "200px"; // Adjust size as needed
    gunImage.style.cursor = "pointer";

    // Append the gun image to game-content
    document.getElementById("game-container").appendChild(gunImage);


    // Add event listener to collect the gun
    gunImage.addEventListener("click", function () {
        new Audio("reload.mp3").play(); // Play sound effect (Replace with actual file)
        gunImage.remove();
        hasGun = true;
        showModal("You picked up the gun!"); // Show message or update inventory
    });
    }
    else if (option === "wait") {
        // Play eerie music
        let eerieMusic = new Audio("eerie_music.mp3"); // Replace with actual file name
        eerieMusic.loop = true; // Loop for continuous play
        eerieMusic.volume = 0.5; // Adjust volume as needed
        eerieMusic.play();
    
        // Display a creepy message while the music plays
        updateScene(
            "You pause, sensing something unseen watching you. The silence is heavy… then, a faint whisper echoes in your ear. You can't tell where it's coming from.",
            "gun.webp", // Replace with an appropriate background image
            ["Go Back"],
            ["enter"]
        );
    }
     
    else if (option === "inside") {
        updateScene(
            "You step inside and see a staircase and a door, what will you do? ",
            "entrance.webp",
            ["Go Upstairs", "Explore the Door"],
            ["staircase", "door"]
        );
    
    
    } else if (option === "leave") {
        document.getElementById("title-screen").style.display = "flex";
        document.getElementById("game-container").style.display = "none";
    } else if (option === "staircase") {
        updateScene("You go upstairs. A ghostly figure appears at the top of the stairs... Do you run or stay?", "stair.webp", 
            ["Run", "Stay"], ["run", "stay"]);
    }else if (option === "run") {
        updateScene(
            "You dash downstairs, but the room twists around you. Suddenly, you're in a dimly lit library, surrounded by towering bookshelves. On a pedestal, an old book catches your eye—it might hold a crucial clue.",
            "lib.jpeg", 
            ["Examine the Book", "Go Back"], 
            ["examine_book", "stay"]
        );
    
        // Wait for the scene to update before adding the GIF
        setTimeout(() => {
            let gameContainer = document.getElementById("game-container");
            
            // Create the GIF element
            let bookGif = document.createElement("img");
            bookGif.src = "clue.gif"; // Path to the GIF
            bookGif.alt = "Mysterious Book";
            bookGif.id = "book";
            bookGif.style.width = "150px";  // Adjust size as needed
            bookGif.style.position = "absolute";
            bookGif.style.top = "55%";      // Adjust position
            bookGif.style.left = "90%"; 
            bookGif.style.transform = "translate(-50%, -50%)";
            bookGif.style.cursor = "pointer";  // Make it clickable
            
            // Click event to trigger 'examine_book' action
            bookGif.addEventListener("click", () => {
                bookGif.remove();
                updateScene(
                    "As you open the book, the pages seem to whisper secrets of the mansion. Strange symbols glow faintly, hinting at something important.",
                    "poem.webp",
                    ["Continue Reading", "Close the Book"],
                    ["examine_book", "run"]
                );
                showModal("You have collected a clue!");
            });
    
            // Append the GIF to the game container
            gameContainer.appendChild(bookGif);
        }, 100);  // Delay to ensure the scene updates before adding the GIF
    }
    
    
    // Handling book interaction
    else if (option === "examine_book") {
        updateScene(
            "You carefully open the old book. As you turn the pages, strange symbols and a poem appear. The words seem to whisper a hidden message.",
            "poem.webp",
            ["Close the Book"],
            ["run"]
        );
        
    }
    
    else if (option === "stay") {
        updateScene("A ghostly figure emerges as a candle flickers to life. In its glow, you spot a cross—use it to drive the spirit away! Where will you go next?",
        "upstairs.webp",
            ["Go Left", "Go Right"], ["left", "right"]);
        
        setTimeout(moveGhost, 1000); // Ghost animation after 1 second
    
        // Add cross image
        let crossImage = document.createElement("img");
        crossImage.src = "cross.gif"; // Replace with your actual cross image
        crossImage.id = "cross";
        crossImage.style.position = "absolute";
        crossImage.style.bottom = "170px"; // Adjust position as needed
        crossImage.style.left = "30%";
        crossImage.style.transform = "translateX(-50%)"; // Center the cross
        crossImage.style.width = "100px"; // Adjust size as needed
        crossImage.style.cursor = "pointer";
    
        // Append the cross image to game-content
        document.getElementById("game-container").appendChild(crossImage);
    
        // Add event listener to collect the cross
        crossImage.addEventListener("click", function () {
            new Audio("p.mp3").play();
            crossImage.remove();
            hasCross = true; // Update the flag
            showModal("You picked up the cross! The ghost vanishes!");
        
            // Hide the ghost immediately if it's present
            document.getElementById("ghost").style.display = "none";
        });
        
    } else if (option === "right") {
        updateScene("The door creaks open, revealing a terrace of the Mansion", "terrace.webp", 
            ["Take a smooth Escape using ladder", "Jump Out Of The Mansion"],  ["ladder", "jump"]);       
    }
    else if (option === "jump") {
        updateScene("You Took a jump from the terrace of the Mansion, causing you to die horribly " , "Jump.webp", 
            ["Restart"],  ["reset"]);              
    }
    else if (option === "reset") {
        document.getElementById("title-screen").style.display = "flex";
        document.getElementById("game-container").style.display = "none";              
    }
    else if (option === "ladder") {
        updateScene("You Took the ladder to escape , but found that this is a loop which leads back to the entrace of the mansion " , "ladder.webp", 
            ["Enter"],  ["enter"]); 
    }
    else if (option === "left") {
        updateScene(
            "As you turn left, you find yourself in a dimly lit hallway. At the end, two identical doors stand before you. One leads to freedom, the other... to certain doom. A cold draft seeps through the cracks, and distant whispers fill the air. You must choose wisely—your fate depends on it.",
            "choice.webp",
            ["Enter the left door", "Enter the right door"],
            ["light", "dark"]
        );       
    }
    else if (option === "light") {
        updateScene(
            "With a deep breath, you push open the glowing door. A rush of fresh air fills your lungs as the scent of the outside world washes over you. Sunlight pierces through the mist, revealing a hidden path that leads away from the mansion. You've done it—you've escaped the nightmare. But as you step forward, a chilling whisper lingers behind you... 'This is not over.'",
            "insane.webp",
            ["Restart"],
            ["reset"]
        );
    }
    else if (option === "dark") {
        updateScene(
            "As you step inside, the door slams shut. Total darkness surrounds you. A guttural growl echoes, and icy fingers grip your shoulders. Hollow eyes gleam in the void before razor-sharp teeth sink into your flesh. Your screams fade—the mansion has claimed another soul.",
            "dead.webp",
            ["Restart"],
            ["reset"]
        );
    }           
     else if (option === "door") {
        updateScene("The door creaks open, revealing a dark room with a flickering light. A shadow moves in the corner...", "door.webp", 
            ["Investigate the Shadow", "Close the Door"], ["shadow", "close_door"]);       
    }
    else if (option === "door") {
        updateScene(
            "The door creaks open, revealing a dark room with a flickering light. A shadow moves in the corner...",
            "door.webp",
            ["Investigate the Shadow", "Close the Door"],
            ["shadow", "close_door"]
        );
    } 
    
    // New scene when "Close the Door" is selected
    else if (option === "close_door") {
        updateScene(
            "As you shut the door, the lock clicks behind you. There's no way back. In the dim light, a massive mirror looms before you. But something is wrong… your reflection isn’t just a reflection—it’s an eerie ghost staring back. It raises a hand and whispers in a hollow voice: 'RUN… or seek the truth?'",
            "mirror.webp",
            ["Run", "Investigate the Painting"],
            ["run_from_mirror", "painting"]
        );
    } 
    
    // Running from the mirror
    else if (option === "run_from_mirror") {
        updateScene(
            "You turn and sprint away, but the room twists around you. The mirror's reflection warps reality, pulling you back. Your own ghostly face grins as the world fades into darkness. You have been claimed by the haunted mirror.",
            "loop.webp",
            ["Restart"],
            ["reset"]
        );
    }
    
    else if (option === "shadow") {
        updateScene("You keep walking towards the shadow, it vanishes but the room seems to be closed form all sides, is there any way to get out?", "paint.webp", 
            ["Investigate The Painting ", "Turn Back"], ["painting", "inside"]);
    }
    else if (option === "painting") {
        updateScene(
            "You examine the eerie painting. It seems like a puzzle… maybe solving it will reveal something?",
            "painting.webp",
            ["Solve the Puzzle", "Step Back"],
            ["solve_puzzle", "shadow"]
        );
    } else if (option === "solve_puzzle") {
        showPuzzle();
    }
    
     else if (option === "turn_back") {
        updateScene("You keep walking and find a stairway leading to the basement. Do you go down?", "basement.jpeg", 
            ["Go Downstairs", "Turn Back"], ["basement", "turn_back"]);
    }
}
