AnimeFlip Guessing Game

AnimeFlip is an interactive web game where users guess the names of popular anime from blurred cover images. It features a responsive design that works on both desktop and mobile devices.

Features
Interactive Grid: A 3x3 grid of tiles, each hiding an anime cover.

Dynamic Guessing: Click a tile to open a pop-up modal to submit your guess.

Autocomplete Suggestions: The input field provides autocomplete options from a database of over 2000 anime titles to help you guess.

Multiple Correct Answers: The game accepts full titles as well as common abbreviations (e.g., "mha" works for "My Hero Academia").

Smooth Animations: Tiles perform a flip animation after a correct guess.

Responsive Design: The layout automatically adjusts for a great experience on both large desktop screens and small mobile phones.

How to Run Locally
Important: Due to browser security policies (CORS), you must run this project from a local server. You cannot just open the animeFlip.html file directly in your browser.

The easiest way is to use the Live Server extension in Visual Studio Code.

Open the project folder in Visual Studio Code.

Install the "Live Server" extension from the Extensions marketplace.

Right-click on animeFlip.html in the file explorer and select "Open with Live Server".

Customization
To change or add answers: In animeFlip.html, edit the data-answer attribute for any tile. You can add multiple correct answers by separating them with a pipe | symbol.

Example: data-answer="Attack on Titan|aot"

To change images: Place your image files in the /images folder. The JavaScript is currently set up to find images based on the anime's name (e.g., an answer of "Naruto" corresponds to naruto.jpg).
