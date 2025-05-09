// Main JavaScript file for the Kinyarwanda Story Generator

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const lightModeIcon = document.getElementById('lightModeIcon');
    const generateBtn = document.getElementById('generateBtn');
    const storyPrompt = document.getElementById('storyPrompt');
    const storyContainer = document.getElementById('storyContainer');
    const storyContent = document.getElementById('storyContent');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const copiedText = document.getElementById('copiedText');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const htmlElement = document.documentElement;
    const episodicToggle = document.getElementById('episodicToggle');
    const episodeControls = document.getElementById('episodeControls');
    const currentEpisode = document.getElementById('currentEpisode');
    const totalEpisodes = document.getElementById('totalEpisodes');
    const episodeInfo = document.getElementById('episodeInfo');
    const episodeNav = document.getElementById('episodeNav');
    const prevEpisodeBtn = document.getElementById('prevEpisodeBtn');
    const nextEpisodeBtn = document.getElementById('nextEpisodeBtn');

    // State management for episodic stories
    let storyState = {
        isEpisodic: false,
        prompt: '',
        currentEpisode: 1,
        totalEpisodes: 3,
        episodeStories: {},
        storyTitle: '',
        mainCharacter: null,
        secondaryCharacter: null,
        storyTheme: null
    };

    // Theme toggling functionality
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            htmlElement.setAttribute('data-bs-theme', 'light');
            darkModeIcon.classList.add('d-none');
            lightModeIcon.classList.remove('d-none');
        } else {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            darkModeIcon.classList.remove('d-none');
            lightModeIcon.classList.add('d-none');
        }
    });

    // Toggle episodic controls
    episodicToggle.addEventListener('change', function() {
        if (this.checked) {
            episodeControls.classList.remove('d-none');
            storyState.isEpisodic = true;
        } else {
            episodeControls.classList.add('d-none');
            storyState.isEpisodic = false;
        }
    });

    // Generate story on button click
    generateBtn.addEventListener('click', function() {
        const prompt = storyPrompt.value.trim();
        
        if (!prompt) {
            alert('Nyamuneka, andika insanganyamatsiko y\'inkuru!');
            return;
        }
        
        // Show the story container and loading indicator
        storyContainer.classList.remove('d-none');
        storyContent.innerHTML = '';
        loadingIndicator.classList.remove('d-none');
        
        // Set up episodic state if needed
        if (storyState.isEpisodic) {
            storyState.prompt = prompt;
            storyState.currentEpisode = parseInt(currentEpisode.value) || 1;
            storyState.totalEpisodes = parseInt(totalEpisodes.value) || 3;
            
            // Validate inputs
            if (storyState.currentEpisode < 1) storyState.currentEpisode = 1;
            if (storyState.totalEpisodes < 2) storyState.totalEpisodes = 2;
            if (storyState.currentEpisode > storyState.totalEpisodes) {
                storyState.currentEpisode = storyState.totalEpisodes;
            }
            
            // Update UI
            currentEpisode.value = storyState.currentEpisode;
            totalEpisodes.value = storyState.totalEpisodes;
            
            // Show episode navigation and info
            episodeInfo.textContent = `Igice ${storyState.currentEpisode}/${storyState.totalEpisodes}`;
            episodeInfo.classList.remove('d-none');
            episodeNav.classList.remove('d-none');
            
            // Update navigation buttons
            updateEpisodeNavigationButtons();
        } else {
            // Hide episodic elements for regular stories
            episodeInfo.classList.add('d-none');
            episodeNav.classList.add('d-none');
            
            // Reset story state
            storyState = {
                isEpisodic: false,
                prompt: prompt,
                currentEpisode: 1,
                totalEpisodes: 3,
                episodeStories: {},
                storyTitle: '',
                mainCharacter: null,
                secondaryCharacter: null,
                storyTheme: null
            };
        }
        
        // Generate the story asynchronously to avoid blocking the UI
        setTimeout(function() {
            generateEpisode(storyState.currentEpisode);
            loadingIndicator.classList.add('d-none');
        }, 1000);
    });

    // Generate a specific episode
    function generateEpisode(episodeNumber) {
        // If this episode is already generated, just display it
        if (storyState.episodeStories[episodeNumber]) {
            storyContent.innerHTML = formatStory(storyState.episodeStories[episodeNumber], episodeNumber);
            return;
        }
        
        let generatedStory;
        
        // First episode establishes the story
        if (episodeNumber === 1) {
            // Generate a fresh story for the first episode
            generatedStory = TextGenerator(storyState.prompt);
            
            // Store essential story elements for continuity
            storyState.storyTitle = generatedStory.title;
            storyState.mainCharacter = generatedStory.mainCharacter;
            storyState.secondaryCharacter = generatedStory.secondaryCharacter;
            storyState.storyTheme = generatedStory.storyTheme;
        } else {
            // For subsequent episodes, continue the story with previous context
            generatedStory = TextGenerator(storyState.prompt, {
                isEpisodic: true,
                episodeNumber: episodeNumber,
                totalEpisodes: storyState.totalEpisodes,
                previousEpisode: storyState.episodeStories[episodeNumber - 1],
                storyTitle: storyState.storyTitle,
                mainCharacter: storyState.mainCharacter,
                secondaryCharacter: storyState.secondaryCharacter,
                storyTheme: storyState.storyTheme
            });
        }
        
        // Store this episode
        storyState.episodeStories[episodeNumber] = generatedStory;
        
        // Update the UI
        storyContent.innerHTML = formatStory(generatedStory, episodeNumber);
    }

    // Update episode navigation buttons based on current state
    function updateEpisodeNavigationButtons() {
        // Update previous button
        if (storyState.currentEpisode <= 1) {
            prevEpisodeBtn.disabled = true;
        } else {
            prevEpisodeBtn.disabled = false;
        }
        
        // Update next button
        if (storyState.currentEpisode >= storyState.totalEpisodes) {
            nextEpisodeBtn.disabled = true;
        } else {
            nextEpisodeBtn.disabled = false;
        }
    }

    // Previous episode navigation
    prevEpisodeBtn.addEventListener('click', function() {
        if (storyState.currentEpisode > 1) {
            storyState.currentEpisode--;
            episodeInfo.textContent = `Igice ${storyState.currentEpisode}/${storyState.totalEpisodes}`;
            currentEpisode.value = storyState.currentEpisode;
            updateEpisodeNavigationButtons();
            generateEpisode(storyState.currentEpisode);
        }
    });

    // Next episode navigation
    nextEpisodeBtn.addEventListener('click', function() {
        if (storyState.currentEpisode < storyState.totalEpisodes) {
            storyState.currentEpisode++;
            episodeInfo.textContent = `Igice ${storyState.currentEpisode}/${storyState.totalEpisodes}`;
            currentEpisode.value = storyState.currentEpisode;
            updateEpisodeNavigationButtons();
            
            // Show loading indicator for new episodes
            if (!storyState.episodeStories[storyState.currentEpisode]) {
                storyContent.innerHTML = '';
                loadingIndicator.classList.remove('d-none');
                
                setTimeout(function() {
                    generateEpisode(storyState.currentEpisode);
                    loadingIndicator.classList.add('d-none');
                }, 1000);
            } else {
                generateEpisode(storyState.currentEpisode);
            }
        }
    });

    // Enter key functionality for the input field
    storyPrompt.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    // Copy story functionality
    copyBtn.addEventListener('click', function() {
        const textToCopy = storyContent.innerText;
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                copyText.classList.add('d-none');
                copiedText.classList.remove('d-none');
                
                setTimeout(() => {
                    copyText.classList.remove('d-none');
                    copiedText.classList.add('d-none');
                }, 2000);
            })
            .catch(err => {
                console.error('Error copying text: ', err);
                alert('Hari ikibazo mu gukopa inyandiko. Nyamuneka gerageza nanone.');
            });
    });

    // Format the story with proper HTML structure
    function formatStory(story, episodeNumber = null) {
        if (typeof story !== 'object') {
            return '<p>Hari ikibazo cyabaye mu gutunganya inkuru.</p>';
        }
        
        let formattedStory = '';
        
        // Add episode info if in episodic mode
        if (storyState.isEpisodic && episodeNumber !== null) {
            formattedStory += `<div class="episode-title">Igice cya ${episodeNumber}: ${story.episodeTitle || story.title}</div>`;
        } else {
            formattedStory += `<div class="story-title">${story.title}</div>`;
        }
        
        // Episode recap for episodes after the first
        if (storyState.isEpisodic && episodeNumber > 1) {
            formattedStory += `<div class="episode-transition">
                <p><strong>Mu igice cyahise:</strong> ${story.recap || 'Inkuru yakomeje...'}</p>
            </div>`;
        }
        
        // Introduction
        formattedStory += `<div class="story-section">`;
        story.introduction.forEach(paragraph => {
            formattedStory += `<p>${paragraph}</p>`;
        });
        formattedStory += `</div>`;
        
        // Rising Action
        formattedStory += `<div class="story-section">`;
        story.risingAction.forEach(paragraph => {
            formattedStory += `<p>${paragraph}</p>`;
        });
        formattedStory += `</div>`;
        
        // Climax and Development
        formattedStory += `<div class="story-section">`;
        story.climaxDevelopment.forEach(paragraph => {
            formattedStory += `<p>${paragraph}</p>`;
        });
        formattedStory += `</div>`;
        
        // Resolution
        formattedStory += `<div class="story-section">`;
        story.resolution.forEach(paragraph => {
            formattedStory += `<p>${paragraph}</p>`;
        });
        formattedStory += `</div>`;
        
        // Add a "to be continued" for episodes before the last
        if (storyState.isEpisodic && episodeNumber < storyState.totalEpisodes) {
            formattedStory += `<div class="episode-transition">
                <p><em>Ibikurikira mu gice gitaha...</em></p>
            </div>`;
        }
        
        return formattedStory;
    }
});

/**
 * TextGenerator - Generates a rich, engaging story in Kinyarwanda based on a prompt
 * @param {string} prompt - User-provided story prompt or topic
 * @param {object} episodicOptions - Options for episodic story generation (optional)
 * @return {object} Story with title and sections
 */
function TextGenerator(prompt, episodicOptions = null) {
    // Dictionary for common Kinyarwanda words and phrases to use in the story
    const kinyarwandaDict = {
        // Characters (names common in Rwanda)

        characters: [
  "Mutara", "Kagame", "Nyiramacumu", "Gasana", "Mukamana", "Rusanganwa", 
  "Uwimana", "Nyirarukundo", "Bizimana", "Nyirahabimana", "Murenzi", 
  "Nyiraneza", "Ndayisenga", "Ntawukuliryayo", "Umutoni", "Uwase", 
  "Niyonzima", "Nshimiyimana", "Ishimwe", "Cyusa", "Umuhoza", "Mugisha",
  // Amazina asanzwe 100
  "Joseph", "Claude", "Eric", "Alice", "Patrick", "Diane", "John", "Esther", "Emmanuel", "Grace",
  "Kevin", "Sandra", "Daniel", "Ange", "Benjamin", "Elisa", "James", "Carine", "Peter", "Josiane",
  "David", "Clementine", "Brian", "Viviane", "Sam", "Divine", "Alex", "Bella", "Mike", "Queen",
  "Thomas", "Rachel", "Fred", "Jolie", "Jean", "Nadine", "Pascal", "Liliane", "Chris", "Ariane",
  "Dieudonne", "Yvonne", "Gilbert", "Solange", "Allan", "Clarisse", "Tony", "Chantal", "Alain", "Olive",
  "Elias", "Phiona", "Justin", "Linda", "Leon", "Patricia", "Roger", "Jackie", "Francis", "Mediatrice",
  "Noel", "Denise", "Didier", "Lyse", "Arnold", "Agnes", "Laurent", "Laetitia", "Blaise", "Joelle",
  "Samson", "Belinda", "Richard", "Assumpta", "Frank", "Cynthia", "Jean Paul", "Edith", "Ericson", "Claudine",
  "Gil", "Judith", "Tom", "Gloria", "Bryan", "Ruth", "Steven", "Florence", "Steve", "Alice",
  "Vincent", "Tina", "Ian", "Peace", "Ezekiel", "Hope", "Godfrey", "Joy"
]
        // Places
            places: [
              // Ibyo wari usanzwe ufite
              "Kigali", "Huye", "Nyamirambo", "Musanze", "Rubavu", "Nyanza", 
              "Muhanga", "Nyagatare", "Rusizi", "Nyungwe", "Uganda", "Ruhango", 
              "isoko", "Nyamagabe", "Gisagara", "Karongi", "Rwamagana", "Bugesera",
              "Nyamasheke", "Gakenke", "Ngororero", "Rulindo", "Umudugudu",

              // Uduce 200 two mu Rwanda
              "Gisozi", "Remera", "Kacyiru", "Kimironko", "Kanombe", "Gikondo", "Kicukiro", "Nyarugenge", "Kibagabaga", "Gatenga",
              "Gisozi", "Masaka", "Kabuye", "Ndera", "Gasogi", "Bumbogo", "Nyabugogo", "Gahanga", "Kimisagara", "Gitega",
              "Jali", "Kimisange", "Rusororo", "Kinyinya", "Gikomero", "Biryogo", "Kimirama", "Kamatamu", "Kagugu", "Nyarutarama",
              "Rwezamenyo", "Cyahafi", "Karama", "Zindiro", "Rebero", "Bumbogo", "Kabeza", "Kanzenze", "Nyanza ya Kicukiro", "Gatsata",
              "Gikondo", "Nyamirama", "Kigufi", "Bumbogo", "Busanza", "Rugando", "Kibungo", "Ngoma", "Rukira", "Zaza",
              "Rurenge", "Mutenderi", "Rukumberi", "Sake", "Nyagatare", "Matimba", "Rwempasha", "Rwimiyaga", "Kiyombe", "Katabagemu",
              "Mimuli", "Karangazi", "Tabagwe", "Rukomo", "Gatunda", "Nyagatare", "Gatsibo", "Kabarore", "Rugarama", "Remera",
              "Gasange", "Ngarama", "Muhura", "Murambi", "Kageyo", "Rwagitima", "Kiziguro", "Gituza", "Rugarama", "Bungwe",
              "Kinyababa", "Nyundo", "Busogo", "Kinigi", "Gataraga", "Shingiro", "Muhoza", "Cyuve", "Rugarama", "Jenda",
              "Kabaya", "Bigogwe", "Nyundo", "Rubavu", "Kanama", "Nyakiriba", "Nyamyumba", "Busasamana", "Bugeshi", "Cyangugu",
              "Kamembe", "Gihundwe", "Mibirizi", "Giheke", "Butare", "Ngoma", "Tumba", "Mbazi", "Save", "Gishamvu",
              "Rwaniro", "Maraba", "Simbi", "Rusatira", "Kigoma", "Muganza", "Gikonko", "Kibilizi", "Save", "Munini",
              "Mushubi", "Gasaka", "Kaduha", "Mugano", "Buruhukiro", "Tare", "Nkomane", "Rugendabari", "Kibeho", "Bweyeye",
              "Bweyeye", "Butaro", "Rugarama", "Gatonde", "Bungwe", "Cyabingo", "Mubuga", "Bwishyura", "Ruganda", "Twumba",
              "Rubengera", "Gashari", "Gitesi", "Mutuntu", "Ruramira", "Gahengeri", "Munyaga", "Karenge", "Nzige", "Muhazi",
              "Musha", "Kibungo", "Gashanda", "Zaza", "Mugesera", "Nyarubuye", "Gatore", "Kirehe", "Nasho", "Mahama",

              // Ahantu 100 hanze y’u Rwanda
              "Nairobi", "Mombasa", "Dar es Salaam", "Arusha", "Kampala", "Juba", "Bujumbura", "Addis Ababa", "Kinshasa", "Lusaka",
              "Harare", "Goma", "Lubumbashi", "Johannesburg", "Cape Town", "Pretoria", "Accra", "Lagos", "Abuja", "Bamako",
              "Ouagadougou", "Dakar", "Tunis", "Algiers", "Cairo", "Khartoum", "Casablanca", "Tripoli", "Benghazi", "Rabat",
              "Doha", "Dubai", "Abu Dhabi", "Riyadh", "Jeddah", "Istanbul", "Ankara", "Tehran", "Baghdad", "Amman",
              "Jerusalem", "Tel Aviv", "Beirut", "Damascus", "Moscow", "London", "Paris", "Berlin", "Madrid", "Rome",
              "Lisbon", "Vienna", "Warsaw", "Prague", "Oslo", "Helsinki", "Stockholm", "Copenhagen", "Brussels", "Amsterdam",
              "Zurich", "Geneva", "Dublin", "Athens", "New York", "Los Angeles", "Chicago", "Houston", "Miami", "Washington",
              "Toronto", "Vancouver", "Montreal", "Ottawa", "Mexico City", "Buenos Aires", "Sao Paulo", "Rio de Janeiro", "Lima", "Bogota",
              "Quito", "Caracas", "Havana", "Kingston", "Port-au-Prince", "Panama City", "San Jose", "Santiago", "La Paz", "Brasilia",
              "Tokyo", "Osaka", "Seoul", "Beijing", "Shanghai", "Bangkok", "Jakarta", "Manila", "Hanoi", "Kuala Lumpur"
            ],
        
        // Time expressions
        timeExpressions: [
  // Ibihe wari usanganywe
  "Kare cyane", "Mu gitondo", "Saa sita z'amanywa", "Mu masaa ya nimugoroba", 
  "Ijoro ryinamye", "Bukeye", "Hashize iminsi", "Mu kwezi gushize", 
  "Umunsi umwe", "Umwaka ushize", "Ejo hashize", "Biratinda", "Mu gihe cy'ihinga", 
  "Mu gihe cy'isarura", "Mu gihe cya kera", "Imyaka itanu ishize", "Uyu mwaka",

  // Ibihe bishya by’inyongera
  "Ejo hazaza", "Uyu munsi", "Uyu munsi nijoro", "Mu masaha make ari imbere",
  "Mu cyumweru gishize", "Icyumweru gitaha", "Ukwezi gutaha", "Mu mezi atatu ashize",
  "Mu mezi ari imbere", "Igihe cy’ubukonje", "Igihe cy’ubushyuhe", "Igihe cy’imvura",
  "Igihe cy’impeshyi", "Igihe cy’ubukonje bukabije", "Mu gitondo cya kare", 
  "Mu gitondo cyo hagati", "Ku manywa", "Mu masaha y’umugoroba", 
  "Mu rukerera", "Mu ijoro", "Mu rukerera rwo kuwa mbere", 
  "Mu gihe cy’ikiruhuko", "Mu biruhuko bya Noheli", "Mu biruhuko by’icyumweru",
  "Ku wa mbere", "Ku wa kabiri", "Ku wa gatatu", "Ku wa kane", "Ku wa gatanu",
  "Ku wa gatandatu", "Ku cyumweru", "Mu mpera z’icyumweru", "Mu ntangiriro z’icyumweru",
  "Mu gihe cy’iminsi mikuru", "Mu gihe cy’amatora", "Mu gihe cy’intambara", 
  "Mu gihe cy’amahoro", "Mu gihe cy’icyorezo", "Mu gihe cy’ubukwe", 
  "Mu gihe cyo gushyingura", "Mu gihe cy’ubukangurambaga", "Igihe cy’amahindu",
  "Mu gihe cy’akazi kenshi", "Mu gihe cy’ubushakashatsi", "Mu gihe cy’ubushomeri", 
  "Mu gihe cy’imyiteguro", "Mu gihe cy’amasomo", "Mu gihe cy’ibizamini", 
  "Mu gihe cy’ikiruhuko cy’ishuri", "Mu gihe cy’ubusitani", "Mu gihe cy’amajonjora",
  "Mu gihe cy’inama", "Mu gihe cy’ubutumwa", "Mu gihe cy’ikiriyo",
  "Muri Gashyantare", "Muri Werurwe", "Muri Mata", "Muri Gicurasi", 
  "Muri Kamena", "Muri Nyakanga", "Muri Kanama", "Muri Nzeri", 
  "Muri Ukwakira", "Muri Ugushyingo", "Muri Ukuboza", "Muri Mutarama",
  "Mu gitondo cyo ku wa gatanu", "Ijoro ryo ku cyumweru", 
  "Mu gihe cy’imyigaragambyo", "Mu gihe cy’amasengesho", "Mu gihe cy’umwiherero",
  "Mu gihe cy’imyitozo ngororamubiri", "Mu gihe cy’ubwiyunge", "Mu gihe cy’ihindagurika ry’ikirere"
],
        
        // Common descriptive phrases
        descriptions: [
  // Ibyo wari usanganywe
  "yari mwiza cyane", "afite umurava", "w'umunyabwenge", "utangaje", 
  "w'umuhanga", "w'inkuba", "ufite ubwoba", "w'intwari", "w'umuhanga", 
  "ufite ubushobozi", "ukomeye", "w'umutima mwiza", "w'urugwiro", 
  "w'intege nke", "ufite ubushake", "udasanzwe", "uzwi cyane",

  // Ibindi bisobanuro by'inyongera
  "w'ubwiza bwo mu mutima", "w'umunyamurava", "w'umutima mwiza", "w'umunyantege", 
  "ufite ubushobozi bwo kwihangana", "w'umugabo w'ikirenga", "w'intyoza", "w'umuhanga mu bijyanye na...", 
  "w'icyizere", "ufite imbaraga zihariye", "w'umunyamwete", "ufite kwiyemeza", "w'umunyabushobozi", 
  "w'ubutwari", "w'icyizere gikomeye", "w’umunyakuri", "w'ijwi ryiza", "w'umushakashatsi", 
  "w'umugabo w'ubwenge", "ufite ubuzima buzira umuze", "w’umufasha w’ingenzi", "w’umugore w’intwari", 
  "w'igishushanyo cyiza", "ufite uburambe", "w'umunyamibereho", "w'inyangamugayo", 
  "w'umuyobozi w'icyitegererezo", "w'inyabutatu", "w'umunyabiruhuko", "w'umupfasoni", 
  "w'umunyabukorikori", "w'igitangaza", "w'umuvandimwe mwiza", "w'umunyemali", "w'umwiza mu kubana",
  "w'umunyarwanda utazwi", "w'umutware mu byo ukora", "ufite ubushobozi bwo guhangana", 
  "w'umunyamujinya", "w'umutima wa kibyeyi", "ufite ishyaka", "ufite imyifatire myiza", 
  "w'umuhanga mu guhanga udushya", "w'umunyabwenge mu by’imibereho", "w'umunyamuziki", 
  "w'ubushobozi bwo kuba wategura ibintu", "ufite ubusabane buhamye", "w’umutima wo gufasha abandi", 
  "w'umunyankunda", "w’umukundana", "w’icyifuzo cy’ubuzima bwiza", "w'umuyobozi ushingiye ku kuri",
  "w'umunyagushimisha", "ufite umucyo mu maso", "w'umugabo w'ukuri", "w'umukobwa utanga ibyishimo", 
  "w'umurimyi w'intambara", "w'umunyabugingo", "w'umuvandimwe utavugwa", "w'inyamibwa", 
  "w'utagira ubutwari", "w’umuryango utunganijwe", "w'ubwitange", "w'ukwiyemeza", 
  "w'umufatanyabikorwa mu buzima", "w’inyamahirwe", "w’umusizi utavuga", "w’imbuto z’amarangamutima", 
  "w'ubuyobozi bw'ubutunzi", "w’umuryango utagira umwenda", "w’umuntu w'intore", "w'inkoramutima"
],
        
        // Weather and nature
        nature: [
            "Imvura yari ikuyeho", "Izuba ryarabagije", "Umuyaga wahuha", 
            "Igihe cy'umuhindo", "Mu gihe cy'izuba ryinshi", "Ibirunga", 
            "Amashyamba manini", "Umugezi utemba", "Ikiyaga kinini", 
            "Imisozi miremire", "Ikirere cyari gipfuye", "Inyanja", "Ibitare",
            "Ibiyaga", "Ibisumo", "Imirambi", "Uruzi rucye", "Imisozi miremire", 
            "Ibihuru", "Imyombo", "Imisozi itandukanye", "Ibihe by’umuyaga mwinshi", 
            "Ubutayu", "Ibigishusho by'ikirere", "Amakara", "Amashyamba y’ibiti byinshi", 
            "Inzuzi", "Ibirunga bikikijwe n’inkengero", "Imirasire y'izuba", 
            "Amatongo", "Inzitizi z'amazi", "Ibigega", "Ibigishusho by'ibiti bihingwa",
            "Ishavu ry’imvura", "Ubwiza bw’ikirere", "Imikorere y’amazi", "Ikirere kinyerera",
            "Imiryango ya gisirikare", "Inyamaswa", "Inkombe z’inyanja", "Ibyanya", "Ibitwerekezo", 
            "Inyaruguru", "Icyo gice cy'ubutayu", "Ibihe by’umucyo", "Umuriro w'izuba", 
            "Icyerekezo cy'inkubi", "Gahunda y’ibihe", "Ubushyuhe bw’imvura", "Igitereko cy'amazi",
            "Amazi yo mu misozi", "Indege zitandukanye", "Gukunda ibihe", "Amakara yo mu gasozi",
            "Izihe", "Amasoko y’ibyatsi", "Uruziga rw’umuyaga", "Inyungu mu misozi", "Ibiti bitandukanye", 
            "Ururimi rw’ikirere", "Gukomeza iterambere", "Imisozi y’icyarabu", "Ibyo gusesengura ibihe",
            "Imirimo y'umuyaga", "Umuyaga w’umusaruro", "Imitako ya karemano", "Imiraba y'inyanja",
            "Ikirere cy’inyamaswa", "Icyerekezo cy’amazi", "Amazi yo ku bibaya", "Amashyuza mu gasozi",
            "Ibikorwa by’imbere mu gihugu", "Amashyamba manini", "Imisozi miremire", "Ibirunga",
            "Igishanga cy'umuyaga", "Amazi atemba mu misozi", "Ibyerekezo bya ruswa", "Imisozi y’amashyamba",
            "Uruzi rwa Kisoro", "Ibiraro byo mu kirere", "Ibigo by’ubuzima", "Gukunda ibitekerezo by’imyaka",
            "Amafu y’umuyaga", "Imirasire y’izuba", "Icyerekezo cy’ibyatsi", "Uruzi ruri mu butayu",
            "Imiterere y’imisozi", "Uruziga rw’inyanja", "Icyerekezo cy’umuryango", "Imigezi ibiri",
            "Icyerekezo cy'ibiti", "Gukora imyanda", "Igitabo cya karemano", "Icyerekezo cy’ibyatsi",
            "Imyitwarire y’amazi", "Uruzi rw’amakara", "Icyerekezo cy’amashyuza", "Imiterere y’inyamaswa",
            "Ihuriro ry'amazi", "Ibitabo byo mu misozi", "Ibice by'ikirere", "Amaso y'imvura",
            "Imirimo y'inyamaswa", "Ubukungu bw’ibiti", "Ibyihishe muri ibi bihe", "Igitereko cy’ibiti",
            "Gahunda y’ibiyaga", "Ibihe by'ishyuza", "Urukundo rw’imyiza", "Icyerekezo cy’umuyaga",
            "Ibihugu by’inyanja", "Uko imyaka ibasha kumera", "Imikoro y’ikirere", "Ibitabo by’amaso",
            "Ibidukikije", "Imigambi y’ubuzima", "Ibitabo byo mu gishanga", "Igenzura ry’ibiti", 
            "Ibikapu by’umuyaga", "Imiterere y’ubutayu", "Icyerekezo cy’inyamaswa", "Icyerekezo cy’imvura",
            "Imiterere y’ibyatsi", "Ihuriro ry’umuyaga", "Urusobe rw’ibiti", "Imibereho y’inyamaswa",
            "Igihe cy'umuyaga", "Ikirere kirangwa n’imvura", "Uruzi rwa Kivu", "Imizigo y’amazi",
            "Imitwe y’umuyaga", "Ibiraro by’imisozi", "Ibiranga ibikorwa", "Inzira z'amazi", "Imiyoboro y’amazi",
            "Amazi atemba", "Ibirimo by’ibyatsi", "Ibigega bitandukanye", "Ibyatsi bitwara ikirere",
            "Ikirere cy’umuyaga", "Ibihe by’umucyo", "Inyungu z’ibiti", "Ikirere cy'imvura", 
            "Ibiraro bitandukanye", "Ihuriro ry’ibiti", "Ibyihishe muri ibyo bihe", "Imirimo y’ubuzima", 
            "Inzitizi z’amazi", "Amashyuza mu misozi", "Amazi yo mu nzira", "Inzuzi nyinshi",
            "Amazi yo mu bukungu", "Ikirere cy’imisozi", "Imvange y’amazi n’umuyaga", "Ibigishusho by’umuyaga",
            "Imirambi y’ibiti", "Ibihe by’umuyaga", "Amafu y'ikirere", "Amazi ya kera", 
            "Ibikorwa bya karemano", "Inzira z'ibiyaga", "Igitabo cya karemano", "Amashyuza mu gishanga",
            "Urusobe rw’ibiti byinshi", "Ihuriro ry’ikirere", "Ibikorwa by’amazi", "Ibice by’ubuzima",
            "Amarenga y’inyamaswa", "Ihame ry’ikirere", "Ibigega by’amazi", "Imitako ya karemano",
            "Amazi atemba mu bigega", "Ikinyuranyo cy’umuyaga", "Ibitare by’imisozi", "Amaso y’imvura",
            "Ikirere cy’ingufu", "Amateka y’ibyatsi", "Ibyihishe mu bigega", "Igihe cy’umuyaga w’intambara",
            "Imyitozo y’imisozi", "Icyerekezo cy’ibiti", "Uruzi rw’imisozi", "Ibisumo by’amazi",
            "Inzira z’amazi atemba", "Ihuriro ry'inyamaswa", "Ibigega by'ubuzima", "Imisozi y'ikirere"
        ],
        
        // Emotions
        emotions: [
            "urukundo", "agahinda", "ibyishimo", "ubwoba", "uburakari", 
            "amakuba", "ukwihangana", "ishyaka", "umunezero", "agahinda gakabije", 
            "kwiheba", "icyizere", "ubushobozi", "intimba", "impuhwe", "isoni", 
            "gushima", "ihungabana", "kwiheba", "ubwenge", "kwitanga", 
            "kubabazwa", "umujinya", "ururondogoro", "umunabi", "gutaka", 
            "kwishima", "gushidikanya", "gutekereza", "gushaka gufasha", "kugenda mu mutwe", 
            "gukora ibintu bitunguranye", "gushavura", "gukundwa", "gukora cyane", 
            "guseseka", "gutekereza ku byishimo", "gushima abantu", "gukora cyane", 
            "gutaka ibintu", "kwiheba cyane", "gushavura cyane", "umujinya mwinshi", 
            "gufasha abandi", "kurera abana", "kwiheba mu mutima", "gukomera ku byiza", 
            "kwihangana mu bihe by'ubuzima", "ubwuzu", "gukunda igihugu", "kwitegereza", 
            "gushimishwa", "guhangayika", "gukorana umwete", "gushaka ubuzima bwiza", 
            "ubugwaneza", "ubwiza bw'umwuka", "gushyira mu bikorwa", "guhura n'ibibazo", 
            "kwigunga", "gushishikazwa", "kuzamura umutima", "kugora", "gutekereza ku bikorwa",
            "kumva ko uri ku rugendo", "guhangayika", "kwikunda", "gushimwa", "gushyira mu gaciro",
            "gushaka intambwe", "gutekereza ku rukundo", "kwimenyereza", "gukomera", "kurira", 
            "gushaka kumenya", "kurwanya umwenge", "gukora ubushakashatsi", "gushakisha ukuri", 
            "kwishyira hamwe", "kugumana amahoro", "ubwuzu mu mutima", "gushyira mu bikorwa amarangamutima",
            "gushimwa n'abandi", "gushyira umutima hamwe", "gutekereza ku bigeragezo", 
            "kwiha icyizere", "gushimangira", "umwete", "gushimwa kubera ibikorwa", "kwiyakira", 
            "gushungura", "guhangana n'ibibazo", "gukora ku rwego rwo hejuru", "gukunda abandi", 
            "kwigirira ikizere", "uburumbuke", "gukunda umuryango", "kubaha abandi", 
            "gutekereza ku giti cyawe", "kugira icyo ushyira imbere", "gukunda kwiga", 
            "gukora ibintu byiza", "gushishikazwa n'umuryango", "gukora mu bwisanzure", "gukunda ibikorwa", 
            "kugira umutima mwiza", "gukora amakosa", "gukunda ku rwego rwo hejuru", "gushima ibyo dukora",
            "gukora neza", "kubaho neza", "kwigirira ikizere", "gukora ibikorwa byiza", 
            "kwiheba mu mutima", "kuririmba", "gufasha abandi", "kugira intego", "kuzirikana", 
            "gukora isuzuma", "gufasha abandi mu bihe bikomeye", "gukora ibintu bisaba imbaraga", 
            "kubyishimo", "gukomeza intego", "kwishimira ibyo wagezeho", "gushyira hamwe n’abandi", 
            "gushimisha abandi", "gutekereza ku gitekerezo", "gushyira imbere amahoro", "gushimwa", 
            "kuzamura abandi", "gushaka kubaho neza", "gukora ku buryo bwiza", "guhanga udushya",
            "gufasha abashonji", "gukora ibyiza", "guhora ushishikajwe", "gukora uko wumva", 
            "gukunda gusabana", "gushishikazwa n'umurimo", "gufasha abantu", "gushiraho gahunda", 
            "guhura n'ibibazo", "gukora ibintu biryoshye", "gushimwa n'ibikorwa", "gushyira mu gaciro",
            "kwiheba kubi", "guhitamo ibyiza", "gushira imbaraga", "gukunda amahoro", "gukora mu buryo bwiza",
            "gushimwa ku bikorwa byiza", "gukora ibyiza mu buzima", "kurangiza ibintu", "gushimwa n'umuryango", 
            "kubyina", "gushyira hamwe n'abandi", "gushiraho ibitekerezo", "kwishima muri wowe", "gushyira imbere ibyo ukunda", 
            "gukora ibikorwa by'indashyikirwa", "kurwana n'ibibazo", "gukora cyane kuburyo bugaragaza", "kuba hafi y'abandi", 
            "gukunda ku buryo budasanzwe", "gutakaza umutima", "kwiheba kubera impamvu", "gutakaza ibyiringiro",
            "gufasha abandi kurenga ibibazo", "kuzirikana ku mwanya wawe", "gushyira imbere ibyiza", "gukora ibiryohe",
            "kwibuka", "gukora cyane mu buzima", "gukora ibikorwa byiza", "guhindura ibintu mu buzima", "kugira amahoro",
            "gukora ku buryo butuma ugira umutima mwiza", "gushaka ubuzima bwiza", "gukora ibintu byiza", "kubyishimo cyane", 
            "gukora ibikorwa byagutse", "gushima ubuzima", "gushyira mu bikorwa gahunda", "gukora ibintu byiza", 
            "gukora ibikorwa bigaragara", "kuri gahunda", "gukora ibintu bifite igisobanuro", "kwishimira umunsi",
            "guhindura isura y'ibintu", "gukunda ku rwego rwiza", "gushyira imbere ibikorwa byiza", "gukora imyitwarire",
            "gukora ibikorwa bisaba imbaraga", "gushimwa kubera ibikorwa", "gukora ibyo ukunda", "kugira umutima utuje"
        ],
        
        // Conversation starters
        conversations: [
            "Yaravuze ati", "Yarasubije ati", "Yarabajije ati", "Yarasekeye ati", 
            "Yatangajwe ati", "Yumvise agashya ati", "Yarababaye ati", 
            "Yaratontomye ati", "Yaratangaye ati", "Yaributswe ati", "Yaravuze mu ijwi ricagase ati", 
            "Yaravuze agahinda", "Yaravuze agashya", "Yaratunguwe n'icyo yabonye", 
            "Yarashidikanye", "Yarashoboye kuvuga", "Yaratunguwe no kumva ibyo yavuze", 
            "Yagaragaje ubushobozi", "Yavuze nk'uwiteguye", "Yahise avuga ko", 
            "Yararizihirije", "Yashubije mu buryo butunguranye", "Yarahise abwira", 
            "Yarebye hejuru ati", "Yaraganiriye mu mucyo", "Yagiye abaza", 
            "Yafashe umwanzuro wo", "Yaragarutse muri conversation", "Yavuze atuje", 
            "Yasubije mu buryo butangaje", "Yaravuze biryoheye amatwi", 
            "Yaratangaje abantu bose", "Yaramusabye ko", "Yashatse kumenya", 
            "Yavuze ibyo yararimo gukora", "Yarasubije mu buryo butunguranye", "Yahise atangira kuganira", 
            "Yatangiye kujya yibaza", "Yashatse gukora ubushakashatsi", "Yavuze ibintu byoroshye", 
            "Yaribagiwe igitekerezo cye", "Yaravuga adategwa", "Yagaragaje ubwenge", "Yaratangaye kuko", 
            "Yahise arangiza ijambo", "Yaramubwiye ko", "Yavuze ibyo yari yiteze", 
            "Yarabaye nk'uwizera", "Yavuze mu mutuzo", "Yarabajije impamvu", 
            "Yavuze amaso y'amajyambere", "Yarageze aho abwira abandi", "Yahise agaragaza ko", 
            "Yarasobanuriye abantu", "Yavuze igitekerezo kiza", "Yagize icyo avuga", "Yavuze akanyamuneza", 
            "Yarishimye cyane", "Yavuze ibintu by'ingirakamaro", "Yavuze uko ibintu byifashe", 
            "Yasubije mu buryo bwiza", "Yaratangaje abari aho", "Yatangiye gusubiramo", 
            "Yaravuze ko", "Yatanze igitekerezo gishya", "Yavuze yishimye", "Yarasekeje abantu", 
            "Yarishimye ku buryo butangaje", "Yasubije nk'uwatekereje cyane", "Yashimye icyo yavuze", 
            "Yashatse gukomeza kuganira", "Yavuze ko atunguwe", "Yarabajije akamaro", 
            "Yavuze ibintu by'ingenzi", "Yarasobanuriye neza", "Yaratumye abantu bahuriza ku gitekerezo", 
            "Yavuze ibyo atari asanzwe avuga", "Yaratangiye kuvuga ku bijyanye na", 
            "Yasubije mu buryo bwo kugaragaza ukuri", "Yaravuze ku buzima bwe", "Yavuze ibitekerezo byiza", 
            "Yaravuga yicaye mu ntebe", "Yatangiye kwibaza byinshi", "Yavuze ibintu byoroshye", 
            "Yavuze ibintu byibanda ku mutima", "Yarafashe icyemezo cyo", "Yaravuze yihanganye", 
            "Yaraganiriye nk'umuntu ufite umutekano", "Yavuze mu buryo bwiza", "Yavuze ibyo yari yumvise", 
            "Yaravuze ku bijyanye n'umuryango", "Yatangaje ko", "Yavuze ibintu byahinduye byinshi", 
            "Yaravuze byatunguye abantu", "Yarabonye igisubizo", "Yaravuze yifuza kumenya", 
            "Yavuze ibyo yatekereje", "Yavuze mu gihe cy'amarangamutima", "Yarashidikanye ku byo yavuze", 
            "Yavuze ko byari bidasanzwe", "Yarabwiye abantu ko", "Yaratangiye kubona ukuri", 
            "Yashatse kumenya byinshi", "Yavuze amagambo abahumuriza", "Yavuze ko atunguwe n'ibyabaye", 
            "Yashatse kuganira ku bibazo", "Yavuze ko ibintu byabaye", "Yavuze ibitekerezo bihamye", 
            "Yahise avuga byinshi", "Yavuze ko ibyo yavuze byari bifite ishingiro", 
            "Yarabajije icyo gukora", "Yaravuze akantu", "Yavuze ibintu byoroheje", "Yavuze mu nzira nziza", 
            "Yavuze ko byari byose", "Yahise atangira kuganira ku bintu", "Yatangiye kubona isura nshya", 
            "Yaravuze ibitekerezo by'ingirakamaro", "Yashatse kubaza byinshi", "Yaravuze n'ijwi rituje", 
            "Yarahise abwira abandi ko", "Yaravuze kubw'ikizere", "Yavuze ibitekerezo bishingiye ku bintu", 
            "Yaratunguwe no kumva ko", "Yashatse kumenya impamvu", "Yavuze amagambo aganisha ku kubana", 
            "Yaravuze mu buryo busobanutse", "Yavuze ngo ibikorwa byari bifite akamaro", 
            "Yaravuze impamvu yo kwihangana", "Yaravuze ko ibihe byahindutse", "Yavuze ku bijyanye n'imibanire", 
            "Yavuze ibitekerezo byiza ku mibereho", "Yavuze uburyo ibintu byagenze", "Yavuze byinshi", 
            "Yaravuze amahoro", "Yaratangaye kubona ibyo yavuze", "Yavuze ibitekerezo bihamye ku kazi", 
            "Yaravuze ko byari bigoye", "Yavuze ko ibyo yabonye byari bitunguranye", "Yavuze muri byose", 
            "Yaratangaje abantu bose", "Yavuze amagambo y'icyizere", "Yavuze ibintu birimo kugenda neza", 
            "Yavuze ngo ibintu byose bihindutse", "Yaratunguwe no kubona ibyo yavuze", "Yavuze ibitekerezo byahinduye byose", 
            "Yaravuze ibintu byafashije abandi", "Yavuze ko abona amahoro", "Yaravuze impamvu yo gukora", 
            "Yavuze amagambo y'inyigisho", "Yashatse gukora ibintu byiza", "Yaravuze iby'ingenzi ku mibereho", 
            "Yatangiye kubona umwanzuro", "Yavuze mu buryo bwo kugaragaza ubwiza", "Yaravuze mu buryo busobanutse", 
            "Yavuze iby'ukuri", "Yashatse kumenya uko byagenda", "Yavuze ko byari bitunguranye", 
            "Yavuze ko ibyo yavuze bibaye impamo", "Yavuze neza ko", "Yaravuze icyo yatekereje", 
            "Yavuze mu buryo bwo kuganira", "Yavuze impamvu yo kwihangana", "Yarasubije ibibazo", 
            "Yavuze n'ijwi ritandukanye", "Yarasubije mu buryo butunguranye", "Yavuze ku byerekeye abantu", 
            "Yaravuze ngo ibintu byose bizagenda neza", "Yavuze ko ibikorwa byoroshye", 
            "Yavuze ko byose bishoboka", "Yaratangiye kuganira kubyo yabonye", "Yaravuze ko byari byiza", 
            "Yavuze ku bikorwa bya buri munsi", "Yaratangiye kubaza byinshi", "Yavuze amagambo yuzuyemo ikinyabupfura", 
            "Yaravuze ko ari ibibazo bikomeye", "Yaravuze ko ibintu byose byabaye byiza", 
            "Yavuze ko abona ubuzima bwiza", "Yavuze ko ibintu byose biri ku murongo", "Yavuze ko byari byoroshye", 
            "Yaravuze ibintu byerekana ko byagenze neza", "Yaravuze ibyo yavuze akiri kumwe", "Yavuze ibyo ari bwo yatekereje", 
            "Yavuze ibintu byerekana ukuri", "Yavuze amagambo yo kwihangana", "Yavuze ibyo avuga muri rusange", 
            "Yavuze ko byose byagenze neza", "Yavuze ko byinshi bihindutse", "Yaratangiye gutekereza cyane", 
            "Yaravuze ko byose byakozwe", "Yaratangajwe n'ukuri", "Yavuze ibitekerezo bitangaje"
        ],
        
        // Cultural elements
        cultural: [
            "imihango ya gakondo", "umuganura", "gukunda inka", "kwiga neza", 
            "kubaha abakuru", "gutera imbere", "amahoro", "ubumwe n'ubwiyunge", 
            "gufashanya", "kuganira ku gasusuruko", "gukorera hamwe", "uburere bwiza",
            "gusangira", "amateka", "inzira y'amajyambere", "umurage", 
            "kwiyubakira", "umugoroba w'ababyeyi", "imurikagurisha", "imihango ya kirazira", 
            "guhesha agaciro umuco", "ubunyangamugayo", "kwicara hamwe", "gushyigikira umuryango", 
            "kwizihiza ibirori", "ubushobozi bwo gufata ibyemezo", "umurimo", "gucunga umutungo", 
            "ubuzima bwiza", "kwakira neza abashyitsi", "gukora ubuhinzi", "kugira umutima w'ubuntu", 
            "gutegura amahoro", "gusenga", "guharanira ubumwe bw'igihugu", "gusigasira ibidukikije", 
            "kwiyungura ubumenyi", "kubungabunga umuco", "kwitabira ibikorwa by'ubugiraneza", 
            "guhuza abantu", "kubana neza n'abavandimwe", "kwibuka amateka", "gukunda igihugu", 
            "kwita ku batishoboye", "uburere bw'abana", "kwibuka abacu", "ubushakashatsi ku muco", 
            "gushyira hamwe imbaraga", "gufasha abandi", "kwiyubaka", "gukunda igihugu no kubana neza", 
            "gusigasira ubutunzi bw'umuco", "kwihesha agaciro", "ubusugire bw'igihugu", 
            "gukora ibikorwa by'urukundo", "guharanira iterambere", "gushyira imbere uburenganzira bw'abandi", 
            "kwigisha abana umuco", "guteza imbere uburezi", "kugira umutima wo kugabana", 
            "gushyira imbere ubumwe", "kwita ku buzima", "gusigasira ubumwe bw'igihugu", 
            "gukunda imiryango", "kwitabira ibikorwa by'urukundo", "gusangira ibiryo", 
            "kubana neza n'abaturanyi", "kwitangira igihugu", "gukorera hamwe mu muryango", 
            "gukunda igihugu", "gukora mu buryo bwiza", "kwita ku muryango", "gushyira imbere ibikorwa by'amahoro", 
            "kubana neza mu baturanyi", "kwita ku buzima bw'abaturage", "gukunda umuryango", 
            "gukora ibikorwa by'amahoro", "kwibuka abari abambere", "kwibuka ibirori by'umuco", 
            "kwita ku gikorwa cyose", "kwitonda mu bikorwa byose", "kwigisha abantu ibijyanye n'umuco", 
            "gusigasira ibikorwa by'ingenzi", "kugira umutima w'ubuntu", "guharanira imibereho myiza", 
            "gushyira imbere ubuyobozi bwiza", "kwibuka ingororano z'umuryango", "kugira isuku", 
            "guharanira uburenganzira bwa buri wese", "kwigisha no gushyigikira abato", "gushyira imbere urukundo", 
            "gushyigikira imishinga", "kwita ku buzima bw'abandi", "kubana neza n'abaturanyi", 
            "gushyigikira ubuyobozi bwiza", "gukunda umuco w'amahoro", "gushyira imbere uburenganzira bw'abagore", 
            "kwishyira hamwe nk'igihugu", "gusigasira umutekano", "kwita ku bakene", "gukunda ibidukikije", 
            "kugira umutima w'urukundo", "gufasha abakeneye ubufasha", "kwitangira abandi", 
            "gukora ibikorwa by'urukundo", "kugira umutima w'ubuntu", "gushishikariza abandi gukora ibikorwa byiza", 
            "gukunda ibyo ukora", "gufasha abagore n'abana", "kwiga mu buryo bwo guharanira amahoro", 
            "kwibuka ibirori by'umuryango", "gukora mu buryo bwa kinyamwuga", "gushyigikira ibikorwa by'uburezi", 
            "kubana neza mu muryango", "gushyira imbere ibyiza", "kwigisha abana ibyiza", "gukora ibikorwa byiza", 
            "kwita ku buzima bw'abantu", "kugira umutima w'ubuntu", "gufasha abashoboye", "kwita ku buzima bwiza", 
            "gufasha abarwayi", "gushishikariza abantu gukorera hamwe", "gushyigikira iterambere", 
            "kwitabira ibikorwa by'umuryango", "gukunda umuco wo gusangira", "gukora ubufatanye mu bikorwa", 
            "gukora ibikorwa by'ubushobozi", "gufasha abenegihugu", "gukora ibikorwa by'ingirakamaro", 
            "kwita ku muryango no ku bantu", "kwibuka imihango y'umuco", "gusigasira uburenganzira bw'abaturage", 
            "gushyira imbere ibikorwa by'urukundo", "gufasha abandi kubaka ejo hazaza heza", "gufasha abana biga", 
            "gushyigikira ibikorwa by'amahoro", "kwihesha agaciro", "gukunda igihugu n'abaturage", "gushyigikira abakene", 
            "kwihangira imirimo", "gusigasira igihugu", "gukora ibintu byiza", "gushyigikira umuryango wacu", 
            "gukora ibikorwa by'ubugiraneza", "kwiga kubana neza n'abandi", "gushishikariza abandi gukora ibikorwa byiza", 
            "gufasha abashoboye kubana neza", "gufasha abafite intege nke", "gushyira imbere ubumwe n'amahoro", 
            "gukora ibikorwa by'ingirakamaro", "gushishikariza abandi gufata ibyemezo byiza", "kwita ku bufatanye", 
            "gushyigikira iterambere ry'umuco", "gufasha abantu mu bibazo", "gukora mu buryo bwiza", 
            "gufasha abantu kugera ku ntego zabo", "gushyigikira umuryango wose", "gukora ibikorwa by'ingenzi", 
            "gushyira imbere ibikorwa byiza"
        ],
        
        // Proverbs and wisdom
        proverbs: [
            "Akarenze umunwa karushya ihamagara", 
            "Inzira ntibwira umugenzi", 
            "Uwanze gutera intimba ntazagira amateka", 
            "Akebo kajya iwa mugarura kabanzayo akandi", 
            "Inshuti nyakuri iboneka mu bihe bikomeye", 
            "Ntawuhinga akavuna umusaruro ku munsi umwe", 
            "Igiti kigororwa kikiri gito", 
            "Impamvu zigira nyirazo"
        "Inzira ntibwira umugenzi",
  "Uwanze gutera intimba ntazagira amateka",
  "Akebo kajya iwa mugarura kabanzayo akandi",
  "Inshuti nyakuri iboneka mu bihe bikomeye",
  "Ntawuhinga akavuna umusaruro ku munsi umwe",
  "Igiti kigororwa kikiri gito",
  "Impamvu zigira nyirazo",
  "Uwububa abonwa n’uhagaze",
  "Uko ubyaye ni ko ubimenya",
  "Ukuri guca mu ziko ntigushye",
  "Isuka y’imuhana isarira ubusa",
  "Ak'imuhana kaza imvura ihise",
  "Amarira y’umugabo atemba ajya mu nda",
  "Amaso y’inkware abona kure",
  "Amarira y’inkoko ntiyica isatuye",
  "Umwana apfa mu iterura",
  "Imana yihereye ntiburirwa",
  "Inkoni ikubise mukeba uyirenza urugo",
  "Agahwa kari ku wundi karahandurika",
  "Ijoro ribara uwariraye",
  "Iyo nyoni itinya uruti ntirwubakira",
  "Ntawe utinda ku irembo atari uwe",
  "Iyo utemye igiti ntukitege amaboko",
  "Amasaka adahise ntamenywa ubwatsi",
  "Inkoko itaraye ntimenya ko bwije",
  "Agaciro k’umuntu kagaragarira mu byo akora",
  "Imbuto ntiyera aho bushye",
  "Aho umwaga wageze ntihamera",
  "Ntawarwaza aho atarwaye",
  "Amase burya araseseka ntayororwa",
  "Igihe kiragera ku ntore",
  "Uwicaye nabi abona nabi",
  "Nta nkoko ibika isake ihari",
  "Umugabo arigira ntarindira guhabwa",
  "Uwanga ko imvura igwa arayisanga",
  "Igisiga cy’iminsi kiravuna",
  "Akanyoni katagurutse ntikamenya iyo bweze",
  "Nta ndagu y’uburozi",
  "Akamasa kazamara ubwatsi ni ako mu rugo",
  "Ntawe ukoma urusyo ngo yibagirwe inkono",
  "Umuhoro w’inkono uragwa",
  "Inka y’undi igira amabere abiri",
  "Ntawe uhiga isake n’izindi zitaramira",
  "Aho bucya ni ho bwira",
  "Agaciro kawe kari mu byo uvuga n'uko ubikora"
        ],
        
        // Conflict and resolution terms
        conflict: [
            "ikibazo", "amakimbirane", "urugamba", "intambara", "igihangange", 
            "ubushyamirane", "amahane", "ubwumvikane", "umwanzuro", "ubwiyunge", 
            "kubabarira", "agakiza", "igisubizo", "amahoro", "ubumwe", "ukuri"
            "ikibazo", "amakimbirane", "urugamba", "intambara", "igihangange", 
              "ubushyamirane", "amahane", "ubwumvikane", "umwanzuro", "ubwiyunge", 
              "kubabarira", "agakiza", "igisubizo", "amahoro", "ubumwe", "ukuri",
              "iterabwoba", "ubwicanyi", "jenoside", "ubusumbane", "ivangura", 
              "ubukene", "akarengane", "ruswa", "kwikubira", "gucura imigambi", 
              "intwaro", "ubugizi bwa nabi", "iterabwoba ry'ikoranabuhanga", "cyber war", 
              "ukwishishanya", "gutinya", "kwihorera", "ibitekerezo bitandukanye", 
              "ubudasa bw’imico", "ubushotoranyi", "ibibazo by’imipaka", "ukwikoma", 
              "amacakubiri", "urugomo", "kwihagararaho", "kwikunda", "guhangana", 
              "kudahana", "kudaha agaciro abandi", "inyota y’ubutegetsi", "kudahuza imyemerere", 
              "intambara y’ubucuruzi", "gufunga abanyepolitiki", "kwikoma abanyamakuru", 
              "kugundira ubutegetsi", "kudashyira hamwe", "kutumvikana", "ibibazo by’ubuhunzi", 
              "kurwanira ubutaka", "amacakubiri y’amoko", "kwikoma amadini", "impaka za politiki", 
              "ukwivanga kw’amahanga", "kwamburwa uburenganzira", "kutubahiriza amategeko", 
              "guhohotera abana", "ihonyora ry’uburenganzira bwa muntu", "ubwicanyi bushingiye ku gitsina", 
              "gufata ku ngufu", "gukoresha abana mu ntambara", "guhungabanya ibidukikije", 
              "gukoresha nabi umutungo kamere", "kuburabuza abaturage", "guhohotera abagore", 
              "ubucakara", "ubujura buhanitse", "gufunga abantu ku buryo butemewe", 
              "gukoresha urubyiruko nabi", "intambara zishingiye ku idini", "gupyinagaza abakozi", 
              "gukoresha imvugo z’urwango", "gukoresha ikoranabuhanga mu kwangiza abandi", 
              "gukoresha drone mu ntambara", "kwibasira impunzi", "kubuza abantu ubwisanzure", 
              "intambara y’ubuhanga", "kwibasira ubukungu bw'ibindi bihugu", "gusenya ibikorwa remezo", 
              "iterabwoba ry’imitwe yitwaje intwaro", "gufunga abigaragambya", "kwica abatagira kivurira", 
              "kudaha abaturage amahitamo", "ubutegetsi bw’igitugu", "ubujura bwa Leta", 
              "guhisha ukuri", "gushyigikira inyeshyamba", "kudaha abaturage ubuvuzi", 
              "kwima abaturage uburezi", "gutoteza abatavuga rumwe na Leta", "gucunga nabi amatora", 
              "kubangamira ubwisanzure bw’itangazamakuru", "kutagira igenamigambi rirambye", 
              "gukoresha ingabo nabi", "kudahana ibyaha bikomeye", "gusesagura umutungo", 
              "gukoresha ingufu ku batavuga rumwe na Leta", "kubuza abaturage uburenganzira bwabo"
        ],
        
        // Common verbs
        verbs: [
            "kugenda", "kuza", "gufata", "kuvuga", "kubona", "kwumva", "gukora", 
            "guseka", "kurira", "kugira", "gushaka", "kwiga", "gutekereza", 
            "kubaho", "gukunda", "kwanga", "gutegereza", "kwizera", "gusangira", 
            "gutangara", "kubaka", "gusarura", "guhinga", "kuganira", "kwandika",
            "kurya", "kunywa", "kuryama", "kubyuka", "kubyina", "kwiruka",
            "gufasha", "gukina", "gutsinda", "kwiyandikisha", "kubyara", 
            "kubabarira", "gusaba", "gukomeza", "gusubiza", "kuzamuka", 
            "kumanuka", "kurambirwa", "gusobanura", "guteka", "kwambara", 
            "kugurisha", "kugura", "gucunga", "gucika", "gukizwa", "guhitamo", 
            "kwibuka", "kwibagirwa", "kwiyiriza", "gusengera", "kuramya", 
            "kugendera", "gucira", "kotsa", "kwambuka", "gusohoka", "gucumbika", 
            "gutaha", "gutungurwa", "guca bugufi", "guhoberana", "gukoropa", 
            "kubika", "gukiza", "gucana", "gufunga", "gufungura", "gutera", 
            "gukura", "kugabanya", "kwihangana", "kugorora", "guhamagara", 
            "kwakira", "guhura", "kwigisha", "kwitaba", "kwiyegereza", 
            "gukomeretsa", "guca", "guca imanza", "gukemura", "kugaruka", 
            "guhunga", "kubwira", "gutembera", "guhiga", "kwitonda", "kwihisha",
            "kuhamagara", "kubeshya", "kwisobanura", "kwitandukanya", "gucika intege",
            "gushimira", "gukora ubushakashatsi", "kubura", "kumenya", "kwibeshya",
            "gusubira", "kubangamira", "guca bugufi", "kwihuta", "gusaba imbabazi",
            "kugereranya", "kubeshwaho", "kugororwa", "kugaburira", "gucunga neza",
            "kugaragaza", "kwitandukanya", "gukomeza kwihangana", "kuzirikana", "kwihugura",
            "gutabariza", "kugambirira", "kubabarana", "kwikuramo", "gusakuza",
            "kwishima", "gusingiza", "gusuhuza", "kugendana", "gucungira hafi",
            "guhinduka", "guhindura", "gukosora", "gucira urubanza", "gupfa",
            "kwicara", "kubyina", "kwitanga", "kwirwanaho", "kubabarira",
            "gushyigikira", "gusenga", "gucika intege", "gucura", "kwizerwa",
            "kwibohora", "gusunika", "gusubukura", "gufungirwa", "kuzamura",
            "gusohora", "gucikamo", "gukubitwa", "kwicisha bugufi", "gusimbuka",
            "gusogongera", "gusoma", "gukandagira", "gutekereza cyane", "gukubitwa n'inkuba",
            "gucika intege", "kubura amahitamo", "kwikomeza", "guhatana", "gusubira inyuma",
            "gufungisha", "guhorana icyizere", "kugongana", "kwibwiriza", "gushishikariza",
            "kwicuza", "gutsindwa", "kwitondera", "kwiyemeza", "kwirinda",
            "kwizirika", "kwiheba", "kwigaragambya", "guca ukubiri", "kurota",
            "gutekinika", "gutsimbarara", "guhanga", "kwihagararaho", "gutambuka"
        ],
        
        // Story elements
        storyElements: [
            "inkuru", "umutwe w'inkuru", "umwandiko", "igitekerezo", "ibyabaye", 
            "ubuzima", "amateka", "umusaruro", "ubushakashatsi", "urugendo", 
            "ishusho", "intego", "ikinamico", "agakuru", "ibitangaza", "ubuzima",
            "ubuzima", "amateka", "umusaruro", "ubushakashatsi", "urugendo",
  "ishusho", "intego", "ikinamico", "agakuru", "ibitangaza", "abakinnyi",
  "aho bikorerwa", "ikibazo", "igisubizo", "ikiganiro", "imitekerereze",
  "ikigeragezo", "impinduka", "inyigisho", "umudiho", "ubwiru", "ubwoba",
  "urukundo", "urwango", "ubwumvikane", "iherezo", "isomo", "ubwenge",
  "icyizere", "ikibazo gikomeye", "icyemezo", "ikibatsi", "imiterere y'abakinnyi",
  "inkomoko", "ubutumwa", "intekerezo y'ibanze", "uburere", "imibanire",
  "imyitwarire", "impamvu", "icyemezo cyihutirwa", "umwijima", "urumuri",
  "inyota y’ukuri", "umutima", "ubugome", "ubugwaneza", "ihinduka ry’imitekerereze",
  "ingeso", "inyungu", "igihombo", "umugambi", "impanuro", "akaga",
  "ikibazo cy’imbere", "umwanzi", "umufasha", "ubucuti", "inshuti nyanshuti",
  "urukerereza", "umwanya", "itariki", "ibihe", "imvura", "izuba", "ijoro",
  "umucyo", "ikirere", "ahantu nyaburanga", "ikibazo cy’amahitamo", "intego yo gutsinda",
  "ipfunwe", "ikuzo", "ikinyoma", "ukuri", "icyaha", "ubutabera", "ubucamanza",
  "igihano", "ubugingo", "urupfu", "guhungabana", "gukira", "kugwa no guhaguruka",
  "icyizere cy’ejo", "ubugari bw’inkuru", "ingingo nyamukuru", "ibimenyetso",
  "inkomoko y'ibibazo", "ikimenyetso cy'ubutumwa", "indirimbo", "amagambo y’ubuhanga",
  "ibikoresho by’inkuru", "inzozi", "amahitamo", "guhitamo nabi", "guhinduka",
  "kwicuza", "kubabarira", "kwihangana", "umutima utanyeganyega", "impamvu nyamukuru",
  "intambwe", "kwiyemeza", "gutsindwa", "gutsinda", "umuyoboro", "uruziga rw’inkuru",
  "ubutwari", "kwiheba", "gusaba imbabazi", "kwihorera", "inyota y'ubutunzi",
  "inda nini", "icyaha cy’ubusambanyi", "ubusumbane", "akarengane", "kwisubiraho",
  "inyigisho zitazibagirana", "ubusizi", "ubuhamya", "urugamba", "intsinzi",
  "ikigeragezo cyanyuma", "umutima w’inkuru", "icyemezo cy’ubuzima", "kwigira",
  "kwigishwa", "gutozwa", "kureka", "gufata icyemezo gikomeye", "gukunda no kwanga",
  "indoto", "icyifuzo", "ibanga", "amaherezo adasobanutse", "impamvu z'ibikorwa",
  "abavandimwe", "urugo", "ababyeyi", "abana", "umuryango", "imyemerere",
  "gucika intege", "gutsimbarara", "gukomera ku ndangagaciro", "ubugambanyi",
  "gukemura amakimbirane", "ubumwe", "guca bugufi", "gutabarwa", "inkomoko y’intwari",
  "ibyiringiro", "akarengane gakabije", "kugambirira", "ubusabane", "ibyo umuntu yibuka",
  "ibyahise", "ibizaza", "guhindura isi", "ubumuga", "inkeke", "urukundo rutemewe",
  "urukundo rwibujijwe", "umubano wihishe", "igitinyiro", "igikomerezwa",
  "imihigo", "indahiro", "ibikomere byo mu mutima", "kwikiza", "kugirira abandi neza",
  "kwiha agaciro", "kwitangira abandi", "gushidikanya", "kwizera", "gutekereza cyane",
  "kwihagararaho", "kwirengagiza", "gutenguhwa", "gutungurwa", "guhisha ukuri",
  "gukanguka", "gukurwa ku izima", "kwibohora", "kwigenga", "kwakira",
  "gukunda igihugu", "gukunda abantu", "kwirwanaho", "uburwayi", "ubukene",
  "ubuhunzi", "kwamburwa", "gucika intege", "gufungurwa", "gufungwa", 
  "gupfa", "kubaho", "kwiruka", "guhunga", "kubaka", "gusenya", "kurwana", 
  "kwishima", "kubabara", "kugira impuhwe", "kwicisha bugufi", "kwanga ububi",
  "kumva abandi", "kumva umutima wawe", "ibisobanuro", "ubuzima bw’imbere",
  "inkomoko y’icyizere", "ikigereranyo", "icyifuzo cyihishe", "uruhare rwa buri wese"
            
        ],
        
        // Common adjectives
    adjectives: [
        "byiza", "bibi", "binini", "bito", "bishya", "bishaje", "bihebuje", 
        "bikomeye", "birebire", "bigufi", "biremereye", "byoroshye", "byinshi", 
        "bike", "bizima", "bifite uburyohe", "biryoshye", "bisharije", "bishyushye",
        "cyiza", "cyiza cyane", "gikomeye", "gito", "gishya", "gishaje", "gihanitse",
        "gikurura", "gifite imbaraga", "gikora neza", "gikomeje", "gikungahaye", "gishimishije",
        "gishimishije cyane", "gishobora kubyara", "gisa n'amateka", "gisanzwe", "gikomeye cyane",
        "gitemba", "gitemba neza", "gikundwa", "gikozwe neza", "gihoraho", "gishobora kugenda",
        "gikunda", "gikunze", "gikenerwa", "gihumuriza", "gikenewe", "gikundisha", "gikunze cyane",
        "gikosora", "gikora neza mu gihe cyose", "gikora neza ku buryo bwiza", "gikundwa cyane",
        "gikunze kuba", "gikora neza igihe cyose", "gihindura", "gishobora kugenda", "gihoraho",
        "gikundwa neza", "gikunda umwanya", "gikora neza mu buryo bwiza", "gikora neza gutya",
        "gikunda igihingwa", "gikora neza ku buryo bwiza", "gikora neza muri gahunda", "gikora neza mu nzira",
        "gikora neza neza", "gikora neza mumuryango", "gikora neza muburyo bworoshye", "gikora neza mu murimo",
        "gikora neza mu buryo bwiza", "gikora neza mu nzira nyinshi", "gikora neza mu ntego", "gikora neza mu buryo bwose",
        "gikora neza mu murimo wubaka", "gikora neza mu gahunda yihariye", "gikora neza ku mwanya ukomeye",
        "gikora neza ku buryo bwubaka", "gikora neza ku gikorwa", "gikora neza ku gikorwa runaka", "gikora neza ku ntego",
        "gikora neza ku murimo", "gikora neza mu bikorwa", "gikora neza mu bikorwa bigamije kubaka", "gikora neza mu iterambere",
        "gikora neza mu buryo bwiza", "gikora neza ku buryo", "gikora neza mu buryo bushya", "gikora neza mu rugendo",
        "gikora neza mu buryo", "gikora neza mu buryo bunoze", "gikora neza mu murimo", "gikora neza mu nzira",
        "gikora neza mu buryo bwiza", "gikora neza mu mugambi", "gikora neza mu murimo w'umuryango", "gikora neza mu bijyanye",
        "gikora neza mu bwiza", "gikora neza mu buryo bunoze", "gikora neza mu buryo bwuzuye", "gikora neza mu ntego y'iterambere"
    ]
    };

    // Story structure templates based on different genres/themes
    const storyTemplates = {
        urukundo: {
            theme: "urukundo",
            plotElements: [
                "guhura ku buryo butunguranye", 
                "kwifatanya", 
                "kubana n'ibibazo", 
                "gutandukana by'agateganyo", 
                "kwiyunga", 
                "kubabarirana",
                "gushyingiranwa"
            ],
            settings: [
                "mu mujyi wa Kigali", 
                "mu cyaro cya Rwanda", 
                "mu ishuri ryisumbuye", 
                "mu kigo cy'isomero", 
                "mu busitani bwiza",
                "ku nkombe z'ikiyaga Kivu"
            ],
            challenges: [
                "guhatana n'imiryango itumvikana", 
                "inzitizi z'amafaranga", 
                "kubura ituze ryo mu mutima", 
                "gushidikanya ku rukundo", 
                "amadini atandukanye",
                "kwimuka gushaka akazi"
            ]
        },
        ubuhanuzi: {
            theme: "ubuhanuzi",
            plotElements: [
                "indoto yuzuye ubusobanuro", 
                "guhabwa impano idasanzwe", 
                "igihe kibi kizaza", 
                "kuburira abantu", 
                "kugerageza guhagarika ibyago",
                "ishyano riteye ubwoba"
            ],
            settings: [
                "mu gihugu kirimo intambara", 
                "mu mudugudu muto w'abaturage", 
                "ahateye amabinga", 
                "mu gihe cy'amakuba", 
                "mu gitondo cy'umwijima"
            ],
            challenges: [
                "kutizera by'abaturage", 
                "igihe kidahagije", 
                "ubushobozi buke", 
                "guhangana n'inzego z'ubutegetsi", 
                "kuzira ubwoba"
            ]
        },
        amateka: {
            theme: "amateka",
            plotElements: [
                "kuzungurwa umurage w'ingenzi", 
                "gushakisha ukuri", 
                "guhura n'ibanga ry'umuryango", 
                "kuvumbura igiciro cy'ejo hashize", 
                "kwiyunga n'amateka"
            ],
            settings: [
                "mu Rwanda rwa mbere y'ubukoloni", 
                "mu gihe cy'intambara", 
                "mu Rwanda rw'ubu", 
                "mu rugo rw'umwami", 
                "mu midugudu yo mu cyaro"
            ],
            challenges: [
                "kwibagirwa k'amateka", 
                "gusoreza ibyo ushaka", 
                "kurwanya ibinyoma", 
                "kwigisha amateka arambuye", 
                "kubungabunga umuco nyarwanda"
            ]
        },
        ubutwari: {
            theme: "ubutwari",
            plotElements: [
                "guhangana n'imbaraga zikomeye", 
                "kurokora abandi mu bibazo", 
                "ubushyamirane bwo mu mutima", 
                "kwihangana no kwigumya", 
                "kubyukana ubutwari"
            ],
            settings: [
                "mu ishyamba rya Nyungwe", 
                "mu ntambara yo kuvuga ukuri", 
                "mu rugendo rurerure", 
                "mu urugendo rw'imisozi", 
                "mu ituze ry'ubuzima"
            ],
            challenges: [
                "kubura ibyiringiro", 
                "kuziga n'umunaniro", 
                "gutakaza inshuti", 
                "kurwana n'igicucu cy'umwanzi", 
                "kwigarurira ubwoba bwo mu nda"
            ]
        },
        ubuzima: {
            theme: "ubuzima",
            plotElements: [
                "imyaka yo gukura", 
                "kugerageza kugera ku nzozi", 
                "ubushuti budasanzwe", 
                "kubaka urugo", 
                "guhinduka mu buzima"
            ],
            settings: [
                "mu ishyamba rya Nyungwe", 
                "mu mudugudu muto", 
                "mu ishuri ryiza", 
                "mu rugo rurangwamo amahoro", 
                "mu kigo cy'ubucuruzi"
            ],
            challenges: [
                "ubukene bukabije", 
                "indwara idasanzwe", 
                "guhomba ibyo wageraho", 
                "gusigara wenyine", 
                "gusama agatege"
            ]
        }
    };

    // Helper functions for story generation
    
    // Get a random item from an array
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // Get multiple random items from an array without duplicates
    function getRandomItems(array, count) {
        const items = [...array];
        const result = [];
        for (let i = 0; i < count && items.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * items.length);
            result.push(items.splice(randomIndex, 1)[0]);
        }
        return result;
    }
    
    // Generate a random number between min and max (inclusive)
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Create a sentence with random elements from the dictionary
    function createSentence(templates) {
        const template = getRandomItem(templates);
        return template.replace(/\{([^}]+)\}/g, function(match, key) {
            const options = kinyarwandaDict[key];
            return options ? getRandomItem(options) : match;
        });
    }
    
    // Capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Determine the closest theme from the prompt
    function determineTheme(prompt) {
        const promptLower = prompt.toLowerCase();
        
        // Check exact matches first
        for (const theme in storyTemplates) {
            if (promptLower.includes(theme)) {
                return theme;
            }
        }
        
        // Check related terms
        const themeMapping = {
            "urukundo": ["urukundo", "gukunda", "mushiki", "mushikiwe", "inshuti", "kukundana", "abakunzi", "umugabo", "umugore"],
            "ubuhanuzi": ["ubuhanuzi", "kwibwira", "guhanura", "indoto", "kurota", "igipimo", "kuyaguruka", "ubupfumu", "gusobanukirwa"],
            "amateka": ["amateka", "umwami", "ingoma", "ejo hashize", "kera", "ubwami", "abanyarwanda", "inganzo", "umuco"],
            "ubutwari": ["ubutwari", "intwari", "intambara", "kurwana", "gutsinda", "kumenyekana", "gushyira imbere", "gutwara neza"],
            "ubuzima": ["ubuzima", "kubaho", "kwiga", "gukora", "urugendo", "gukura", "kwakira", "umugabane", "imyaka"]
        };
        
        for (const theme in themeMapping) {
            for (const term of themeMapping[theme]) {
                if (promptLower.includes(term)) {
                    return theme;
                }
            }
        }
        
        // Default to a random theme if no match found
        return getRandomItem(Object.keys(storyTemplates));
    }

    // Generate character details
    function generateCharacter() {
        const gender = Math.random() > 0.5 ? "male" : "female";
        const name = getRandomItem(kinyarwandaDict.characters);
        const age = getRandomNumber(18, 65);
        const trait = getRandomItem(kinyarwandaDict.descriptions);
        
        return {
            name,
            gender,
            age,
            trait
        };
    }

    // Generate story setting
    function generateSetting(theme) {
        const place = theme ? getRandomItem(storyTemplates[theme].settings) : getRandomItem(kinyarwandaDict.places);
        const time = getRandomItem(kinyarwandaDict.timeExpressions);
        const weather = getRandomItem(kinyarwandaDict.nature);
        
        return {
            place,
            time,
            weather
        };
    }

    // Generate conflict
    function generateConflict(theme) {
        const conflict = theme ? getRandomItem(storyTemplates[theme].challenges) : getRandomItem(kinyarwandaDict.conflict);
        return conflict;
    }
    
    // Generate paragraph of specified length
    function generateParagraph(sentenceCount, sentenceTemplates) {
        let paragraph = '';
        for (let i = 0; i < sentenceCount; i++) {
            const sentence = createSentence(sentenceTemplates);
            paragraph += capitalizeFirstLetter(sentence) + '. ';
        }
        return paragraph.trim();
    }

    // Main story generation begins here
    
    // Handle episodic stories
    let mainCharacter, secondaryCharacter, setting, conflict, storyTheme, title, episodeTitle;
    let theme, recap = '';
    
    // If this is a continuation of an episodic story, use the existing characters and setting
    if (episodicOptions && episodicOptions.isEpisodic) {
        // Use existing story elements for continuity
        mainCharacter = episodicOptions.mainCharacter;
        secondaryCharacter = episodicOptions.secondaryCharacter;
        storyTheme = episodicOptions.storyTheme;
        theme = storyTheme.theme;
        title = episodicOptions.storyTitle;
        
        // Generate a new setting but keep the characters the same
        setting = generateSetting(theme);
        
        // Generate a new conflict or escalate the existing one
        conflict = episodicOptions.episodeNumber < episodicOptions.totalEpisodes - 1 
            ? generateConflict(theme) // New challenge
            : "gukemura ibibazo byose"; // Final resolution in last episode
        
        // Generate episode-specific title
        const episodeTitleTemplates = [
            `Igice cya ${episodicOptions.episodeNumber}: ${mainCharacter.name} ${conflict}`,
            `Igice cya ${episodicOptions.episodeNumber}: ${setting.place}`,
            `Igice cya ${episodicOptions.episodeNumber}: ${getRandomItem(storyTheme.plotElements)}`,
            `Igice cya ${episodicOptions.episodeNumber}: Urugendo rukomeza...`
        ];
        
        if (episodicOptions.episodeNumber === episodicOptions.totalEpisodes) {
            episodeTitleTemplates.push(`Igice cya nyuma: Umwanzuro`);
            episodeTitleTemplates.push(`Igice cya nyuma: Iherezo ry'inkuru`);
        }
        
        episodeTitle = getRandomItem(episodeTitleTemplates);
        
        // Generate a recap of the previous episode
        if (episodicOptions.previousEpisode) {
            const previousResolution = episodicOptions.previousEpisode.resolution;
            if (previousResolution && previousResolution.length > 0) {
                // Take a snippet from the last paragraph of the previous episode
                recap = previousResolution[previousResolution.length - 1].substring(0, 150) + '...';
            }
        }
    } else {
        // This is a regular story or the first episode
        theme = determineTheme(prompt);
        storyTheme = storyTemplates[theme] || storyTemplates.ubuzima;
        
        // Generate main characters
        mainCharacter = generateCharacter();
        secondaryCharacter = generateCharacter();
        
        // Generate setting
        setting = generateSetting(theme);
        
        // Generate conflict
        conflict = generateConflict(theme);
        
        // Story title templates
        const titleTemplates = [
            `${mainCharacter.name} na ${secondaryCharacter.name} mu ${storyTheme.theme}`,
            `Urugendo rw'${mainCharacter.name}`,
            `${capitalizeFirstLetter(storyTheme.theme)} mu buzima bwa ${mainCharacter.name}`,
            `Umunsi ukomeye w'${mainCharacter.name}`,
            `${capitalizeFirstLetter(conflict)} ya ${mainCharacter.name}`,
            `Ibyago bya ${mainCharacter.name} ${setting.place}`
        ];
        
        // Generate story title
        title = getRandomItem(titleTemplates);
        
        // First episode title
        if (episodicOptions && episodicOptions.episodeNumber === 1) {
            episodeTitle = `Igice cya 1: Intangiriro`;
        }
    }
    
    // Introduction section sentence templates
    const introductionTemplates = [
        `${setting.time}, ${mainCharacter.name} yari ${setting.place}`,
        `${mainCharacter.name} yari umuntu {descriptions}`,
        `${setting.weather} ubwo ${mainCharacter.name} yatangiraga umunsi we`,
        `Mu buzima bwa ${mainCharacter.name}, byose byari {adjectives}`,
        `${mainCharacter.name} yahoranye {emotions} mu mutima we`,
        `{timeExpressions}, abantu bo ${setting.place} bamenye ${mainCharacter.name}`,
        `Igihe ${mainCharacter.name} yari afite imyaka ${mainCharacter.age}, yabonye ${secondaryCharacter.name}`,
        `${secondaryCharacter.name} yari {descriptions} cyane`,
        `Byari ibintu {adjectives} kuri ${mainCharacter.name}`,
        `"${getRandomItem(kinyarwandaDict.proverbs)}" ni amagambo ajya aradikiriza umutima wa ${mainCharacter.name}`
    ];
    
    // Rising action section sentence templates
    const risingActionTemplates = [
        `Ariko umunsi umwe, ${conflict} cyatangiye guhangayikisha ${mainCharacter.name}`,
        `${mainCharacter.name} yari yahuye na {conflict}`,
        `${secondaryCharacter.name} {conversations}: "${getRandomItem(kinyarwandaDict.proverbs)}"`,
        `${mainCharacter.name} yariyemeje gushaka igisubizo kuri {conflict}`,
        `${setting.place} hatangiye kuba {adjectives}`,
        `Abantu batangiye kuvuga ko ${mainCharacter.name} atazashobora gutsinda iki kibazo`,
        `${mainCharacter.name} yumvaga {emotions} bikomeye`,
        `${secondaryCharacter.name} yagerageje gufasha, ariko byari {adjectives}`,
        `"Nzakomeza kugeza igihe nzatsindira," ${mainCharacter.name} {conversations}`,
        `Ibyiringiro bya ${mainCharacter.name} byatangiye kugabanuka`,
        `Nta wamenya impamvu ${conflict} cyaje gitunguranye gutyo`
    ];
    
    // Climax and development section sentence templates
    const climaxTemplates = [
        `${mainCharacter.name} yageze aho asanga nta kundi bishoboka`,
        `${mainCharacter.name} {conversations}: "Uku ni ko bizagenda koko?"`,
        `${secondaryCharacter.name} yahise yibuka {cultural}`,
        `Byari ibihe bikomeye kuri ${mainCharacter.name}, ariko yakomeje kugira {emotions}`,
        `${mainCharacter.name} yibuka ibyavuzwe na sekuru: "${getRandomItem(kinyarwandaDict.proverbs)}"`,
        `Umutima wa ${mainCharacter.name} wujujwe {emotions}`,
        `${secondaryCharacter.name} ntiyashoboraga kwemera icyo ${mainCharacter.name} yashoboraga gukora`,
        `Igihe cyose ${mainCharacter.name} yatekereje kuri {conflict}, yumvaga ubwoba`,
        `"${getRandomItem(kinyarwandaDict.proverbs)}," ${secondaryCharacter.name} {conversations}`,
        `${mainCharacter.name} yari afite igitekerezo gishya`,
        `Uwo munsi, ${mainCharacter.name} yahisemo {verbs} mu buryo butandukanye`
    ];
    
    // Resolution section sentence templates
    const resolutionTemplates = [
        `Nyuma y'imyaka myinshi, ${mainCharacter.name} yashoboye kumenya impamvu y'ibyo byose`,
        `${mainCharacter.name} yasanze {cultural} ari iby'ingenzi mu buzima`,
        `${secondaryCharacter.name} na ${mainCharacter.name} bakomeje kuganira ku {conflict}`,
        `Ubuzima bwa ${mainCharacter.name} bwahindutse burundu`,
        `${mainCharacter.name} yamenye ko {emotions} ari ingenzi kuruta {emotions}`,
        `${secondaryCharacter.name} {conversations}: "Byose biragenda neza ubu"`,
        `${mainCharacter.name} ntiyari akiri umuntu {descriptions} yari asanzwe ari`,
        `${setting.place} havugwaga inkuru ya ${mainCharacter.name} nk'urugero rwiza`,
        `"${getRandomItem(kinyarwandaDict.proverbs)}" byabaye ukuri mu buzima bwa ${mainCharacter.name}`,
        `${mainCharacter.name} yize isomo rikomeye: ${getRandomItem(kinyarwandaDict.proverbs)}`,
        `Igihe ${mainCharacter.name} yatekereje ku mateka ye, yarasekeye`
    ];
    
    // Generate the story sections with varying paragraph lengths to reach >10,000 characters
    const introduction = [];
    const risingAction = [];
    const climaxDevelopment = [];
    const resolution = [];
    
    // Add paragraphs to introduction (3-4 paragraphs)
    const introParaCount = getRandomNumber(3, 4);
    for (let i = 0; i < introParaCount; i++) {
        introduction.push(generateParagraph(getRandomNumber(6, 9), introductionTemplates));
    }
    
    // Add paragraphs to rising action (4-6 paragraphs)
    const risingParaCount = getRandomNumber(4, 6);
    for (let i = 0; i < risingParaCount; i++) {
        risingAction.push(generateParagraph(getRandomNumber(8, 12), risingActionTemplates));
    }
    
    // Add paragraphs to climax development (5-7 paragraphs)
    const climaxParaCount = getRandomNumber(5, 7);
    for (let i = 0; i < climaxParaCount; i++) {
        climaxDevelopment.push(generateParagraph(getRandomNumber(9, 14), climaxTemplates));
    }
    
    // Add paragraphs to resolution (3-5 paragraphs)
    const resolutionParaCount = getRandomNumber(3, 5);
    for (let i = 0; i < resolutionParaCount; i++) {
        resolution.push(generateParagraph(getRandomNumber(7, 10), resolutionTemplates));
    }
    
    // Return the complete story object with episodic information if applicable
    const storyObject = {
        title: title,
        introduction: introduction,
        risingAction: risingAction,
        climaxDevelopment: climaxDevelopment,
        resolution: resolution,
        mainCharacter: mainCharacter,
        secondaryCharacter: secondaryCharacter,
        storyTheme: storyTheme
    };
    
    // Add episodic-specific properties if needed
    if (episodicOptions && episodicOptions.isEpisodic) {
        storyObject.isEpisodic = true;
        storyObject.episodeNumber = episodicOptions.episodeNumber;
        storyObject.totalEpisodes = episodicOptions.totalEpisodes;
        storyObject.episodeTitle = episodeTitle;
        storyObject.recap = recap;
    }
    
    return storyObject;
}
