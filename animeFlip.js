document.addEventListener('DOMContentLoaded', () => {

  async function populateAnimeDatalist() {
    try {
      const response = await fetch('anime_titles_nodupes.txt');
      const textData= await response.text();
      const datalist = document.getElementById('anime-list');

      const lines = textData.trim().split('\n');

      const animeNames = lines
        .filter(line => line.length > 0)
        .map(line => {
        // Find the last comma in the line
          const lastCommaIndex = line.lastIndexOf(',');

        // If a comma is found, take the text before it; otherwise, use the whole line
          return lastCommaIndex !== -1 ? line.substring(0, lastCommaIndex).trim() : line.trim();
        });

      const sortedNames = animeNames.sort();

      datalist.innerHTML = '';
      sortedNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
      });

      console.log(`Successfully populated datalist with ${sortedNames.length} titles from .txt file.`);

    } catch (error) {
      console.error('Error loading or parsing data:', error);
    }
  
  }
  // Call the function to load the data when the page is ready
  populateAnimeDatalist();



  const images = [
    'Naruto-shippuden.jpg',
    'Solo-Leveling.jpg',
    'death-note.jpg',
    'Mashle.jpg',
    'Dan-Da-Dan.jpg',
    'Haikyuu.jpg',
    'Kaiju-No-8.jpg',
    'Dragon-ball-daima.png',
    'Blue-box.jpg'
  ];

  const tiles = document.querySelectorAll('.tile');
  const modal = document.getElementById('modal');
  const modalContent = document.querySelector('.modal-content');
  const answerInput = document.getElementById('answerInput');
  const submitBtn = document.getElementById('submitAnswer');
  const feedback = document.getElementById('feedback');

  let currentTile = null;
  let validAnswers = [];

  // Assign background images
  tiles.forEach((tile, index) => {
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('tile-img');
    imgDiv.style.backgroundImage = `url('images/${images[index]}')`;
    tile.appendChild(imgDiv);

    tile.addEventListener('click', () => {
      // Do nothing if tile already revealed
      if (tile.classList.contains('revealed')) return;

      // Store current tile and answer
      currentTile = tile;
      validAnswers = tile.dataset.answer.toLowerCase().split('|');

      const tileRect = currentTile.getBoundingClientRect();
            
      // Position the modal to the right of the tile with a 20px gap
      modalContent.style.top = `${tileRect.top}px`;
      modalContent.style.left = `${tileRect.right + 20}px`;

      // Reset modal state
      answerInput.value = '';
      feedback.textContent = '';

      // Show modal
      modal.classList.remove('hidden');
      answerInput.focus();
    });
  });

  // Handle submit button click
  function handleGuess() {
    const guess = answerInput.value.trim().toLowerCase();
    if (!guess) {
      feedback.textContent = 'Please enter an anime title!';
      feedback.style.color = 'black';
      return;
    }

    if (validAnswers.includes(guess)) {
      feedback.textContent = 'Correct!';
      feedback.style.color = 'green';
      currentTile.classList.add('revealed');
      currentTile.style.cursor = 'default';

      setTimeout(() => {
        currentTile.classList.add('is-flipping');
        setTimeout(() => {
          currentTile.classList.remove('is-flipping');
        }, 1000);
      }, 400);


      const revealedTiles = document.querySelectorAll('.tile.revealed');
      if (revealedTiles.length === tiles.length) {
        // Wait a moment before starting the final animation sequence
        setTimeout(() => {
          // Loop through all tiles and apply the animation class with a delay
          tiles.forEach((tile, index) => {
            setTimeout(() => {
              tile.classList.add('flip');
            }, index * 120); // Stagger each tile's animation start
          });
        }, 800); // 800ms delay to let the user see the last correct answer
      }

      setTimeout(() => {
        modal.classList.add('hidden');
      }, 1000);
    } else {
      feedback.textContent = 'Wrong! Try again.';
      feedback.style.color = 'red';
    }
  }

  // 2. Call the function when the submit button is clicked
  submitBtn.addEventListener('click', handleGuess);

  // 3. Add a new event listener for the "Enter" key on the input field
  answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      // Prevent the default Enter key action (like submitting a form)
      event.preventDefault();
      // Run the same logic as clicking the button
      handleGuess();
    }
  });

  // Cancel button //
  const cancelBtn = document.getElementById('cancelGuess');

  cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Optional: close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });

  modal.addEventListener('click', (event) => {
    // If the direct target of the click is the modal overlay itself, close it
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
  });
});
