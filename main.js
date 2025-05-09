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
            "Niyonzima", "Nshimiyimana", "Ishimwe", "Cyusa", "Umuhoza", "Mugisha"
        ],
        
        // Places
        places: [
            "Kigali", "Huye", "Nyamirambo", "Musanze", "Rubavu", "Nyanza", 
            "Muhanga", "Nyagatare", "Rusizi", "Nyungwe", "Akagera", "Kibungo", 
            "Kibuye", "Nyamagabe", "Gisagara", "Karongi", "Rwamagana", "Bugesera",
            "Nyamasheke", "Gakenke", "Ngororero", "Rulindo", "Umudugudu"
        ],
        
        // Time expressions
        timeExpressions: [
            "Kare cyane", "Mu gitondo", "Saa sita z'amanywa", "Mu masaa ya nimugoroba", 
            "Ijoro ryinamye", "Bukeye", "Hashize iminsi", "Mu kwezi gushize", 
            "Umunsi umwe", "Umwaka ushize", "Ejo hashize", "Biratinda", "Mu gihe cy'ihinga", 
            "Mu gihe cy'isarura", "Mu igihe cya kera", "Imyaka itanu ishize", "Uyu mwaka"
        ],
        
        // Common descriptive phrases
        descriptions: [
            "yari mwiza cyane", "afite umurava", "w'umunyabwenge", "utangaje", 
            "w'umuhanga", "w'inkuba", "ufite ubwoba", "w'intwari", "w'umuhanga", 
            "ufite ubushobozi", "ukomeye", "w'umutima mwiza", "w'urugwiro", 
            "w'intege nke", "ufite ubushake", "udasanzwe", "uzwi cyane"
        ],
        
        // Weather and nature
        nature: [
            "Imvura yari ikuyeho", "Izuba ryarabagije", "Umuyaga wahuha", 
            "Igihe cy'umuhindo", "Mu gihe cy'izuba ryinshi", "Ibirunga", 
            "Amashyamba manini", "Umugezi utemba", "Ikiyaga kinini", 
            "Imisozi miremire", "Ikirere cyari gipfuye", "Inyanja", "Ibitare"
        ],
        
        // Emotions
        emotions: [
            "urukundo", "agahinda", "ibyishimo", "ubwoba", "uburakari", 
            "amakuba", "ukwihangana", "ishyaka", "umunezero", "agahinda gakabije", 
            "kwiheba", "icyizere", "ubushobozi", "intimba", "impuhwe", "isoni"
        ],
        
        // Conversation starters
        conversations: [
            "Yaravuze ati", "Yarasubije ati", "Yarabajije ati", "Yarasekeye ati", 
            "Yatangajwe ati", "Yumvise agashya ati", "Yarababaye ati", 
            "Yaratontomye ati", "Yaratangaye ati", "Yaributswe ati", "Yaravuze mu ijwi ricagase ati"
        ],
        
        // Cultural elements
        cultural: [
            "imihango ya gakondo", "umuganura", "gukunda inka", "kwiga neza", 
            "kubaha abakuru", "gutera imbere", "amahoro", "ubumwe n'ubwiyunge", 
            "gufashanya", "kuganira ku gasusuruko", "gukorera hamwe", "uburere bwiza",
            "gusangira", "amateka", "inzira y'amajyambere", "umurage"
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
            "Impamvu zigira nyirazo",
            "Uwububa abonwa n'uhagaze",
            "Uko ubyaye ni ko ubimenya",
            "Ukuri guca mu ziko ntigushye",
            "Isuka y'imuhana isarira ubusa",
            "Ak'imuhana kaza imvura ihise",
            "Amarira y'umugabo atemba ajya mu nda"
        ],
        
        // Conflict and resolution terms
        conflict: [
            "ikibazo", "amakimbirane", "urugamba", "intambara", "igihangange", 
            "ubushyamirane", "amahane", "ubwumvikane", "umwanzuro", "ubwiyunge", 
            "kubabarira", "agakiza", "igisubizo", "amahoro", "ubumwe", "ukuri"
        ],
        
        // Common verbs
        verbs: [
            "kugenda", "kuza", "gufata", "kuvuga", "kubona", "kwumva", "gukora", 
            "guseka", "kurira", "kugira", "gushaka", "kwiga", "gutekereza", 
            "kubaho", "gukunda", "kwanga", "gutegereza", "kwizera", "gusangira", 
            "gutangara", "kubaka", "gusarura", "guhinga", "kuganira", "kwandika"
        ],
        
        // Story elements
        storyElements: [
            "inkuru", "umutwe w'inkuru", "umwandiko", "igitekerezo", "ibyabaye", 
            "ubuzima", "amateka", "umusaruro", "ubushakashatsi", "urugendo", 
            "ishusho", "intego", "ikinamico", "agakuru", "ibitangaza", "ubuzima"
        ],
        
        // Common adjectives
        adjectives: [
            "byiza", "bibi", "binini", "bito", "bishya", "bishaje", "bihebuje", 
            "bikomeye", "birebire", "bigufi", "biremereye", "byoroshye", "byinshi", 
            "bike", "bizima", "bifite uburyohe", "biryoshye", "bisharije", "bishyushye"
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