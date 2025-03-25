console.warn('debug.js loaded');
document.getElementById('info-debug').innerText = 'Running in debug mode';

// Make sure all elements are somewhat presentable
const logo = document.getElementById('logo');
// logo.src = 'assets/logo.png';

avatar = document.getElementById('active-user-session-avatar');
avatar.src = 'assets/default-user.png';

const message = document.getElementById('message');
message.innerText = 'This is a test message that could have been sent by the back-end server for displaying.';

const examModeProjects = document.getElementById('exam-mode-projects');
examModeProjects.innerText = 'Exam Rank 00, Exam Rank 01, Exam Rank 02, non-existing debug exams';

const lockedAgo = document.getElementById('active-user-session-locked-ago');
lockedAgo.innerText = 'Automated logout occurs in 42 minutes';

// Add options container
const optionsContainer = document.createElement('div');
optionsContainer.id = 'screen-switcher';
optionsContainer.style.position = 'fixed';
optionsContainer.style.bottom = '48px';
optionsContainer.style.left = '0';
optionsContainer.style.width = '100%';
optionsContainer.style.textAlign = 'center';
optionsContainer.style.zIndex = '9000';
document.body.appendChild(optionsContainer);

// Screen switcher
const screenSwitcherContainer = document.createElement('div');
screenSwitcherContainer.style.marginTop = '8px';
optionsContainer.appendChild(screenSwitcherContainer);
function switchScreen(screenId) {
	const screens = document.querySelectorAll('#center > form');
		screens.forEach(screen => {
			screen.style.display = 'none';
		});

		if (screenId === 'none') {
			return;
		}
		const selectedScreen = document.getElementById(screenId);
		if (['lock-form', 'exam-form', 'welcome-form'].includes(screenId)) {
			selectedScreen.style.removeProperty('display');
		}
		else {
			selectedScreen.style.display = 'block';
		}
		if (screenId === 'welcome-form') {
			// Play the welcome sound
			try {
				const audio = new Audio('assets/welcome.mp3');
				audio.volume = 0.1; /* 10% volume, to avoid blasting the sound through the entire cluster */
				audio.play();
			}
			catch (err) {
				console.log('Failed to play welcome sound:', err);
			}
		}

		logo.style.display = screenId === 'login-form' ? 'none' : 'block';
		if (screenId === 'lock-form') {
			logo.style.removeProperty('display');
		}

	// Make sure the correct input field is checked
	const selectedInput = document.getElementById(`radio-${screenId}`);
	selectedInput.checked = true;
}
function addScreenSwitchOption(screenName, screenId) {
	const screenSwitcherInput = document.createElement('input');
	screenSwitcherInput.type = 'radio';
	screenSwitcherInput.name = 'screen';
	screenSwitcherInput.value = screenId;
	screenSwitcherInput.id = `radio-${screenId}`;

	const screenSwitcherLabel = document.createElement('label');
	screenSwitcherLabel.textContent = screenName;
	screenSwitcherLabel.htmlFor = `radio-${screenId}`;
	screenSwitcherLabel.style.marginRight = '8px';

	screenSwitcherContainer.appendChild(screenSwitcherInput);
	screenSwitcherContainer.appendChild(screenSwitcherLabel);

	screenSwitcherInput.addEventListener('change', () => {
		switchScreen(screenId);
	});
}
addScreenSwitchOption('Login screen', 'login-form');
addScreenSwitchOption('Lock screen', 'lock-form');
addScreenSwitchOption('Exam mode', 'exam-form');
addScreenSwitchOption('Welcome screen', 'welcome-form');
switchScreen('lock-form');

// Add a fake calendar event from the template in HTML
// Unfortunately these are not clickable without the proper UI toolkit
const calendarEventTemplate = document.getElementById('intra-calendar-event-template');
for (let i = 0; i < 5; i++) {
	const calendarEvent = calendarEventTemplate.content.cloneNode(true);
	document.getElementById('intra-calendar').appendChild(calendarEvent);
}

// Add file picker for wallpaper
const wallpaperPicker = document.createElement('input');
wallpaperPicker.type = 'file';
wallpaperPicker.accept = 'image/*';
optionsContainer.appendChild(wallpaperPicker);
wallpaperPicker.addEventListener('change', () => {
	const file = wallpaperPicker.files[0];
	const reader = new FileReader();
	reader.onload = () => {
		document.body.style.backgroundImage = `url(${reader.result})`;
	};
	reader.readAsDataURL(file);
});

// Add slider to change the background brightness
const brightnessFilter = document.createElement('div');
brightnessFilter.style.position = 'fixed';
brightnessFilter.style.top = '0';
brightnessFilter.style.left = '0';
brightnessFilter.style.width = '100%';
brightnessFilter.style.height = '100%';
brightnessFilter.style.backdropFilter = 'brightness(1)';
document.body.insertBefore(brightnessFilter, document.body.firstChild);

const brightnessSlider = document.createElement('input');
brightnessSlider.type = 'range';
brightnessSlider.min = '0';
brightnessSlider.max = '5';
brightnessSlider.step = '0.1';
brightnessSlider.value = '1';
brightnessSlider.title = 'Adjust wallpaper brightness';
optionsContainer.appendChild(brightnessSlider);
brightnessSlider.addEventListener('input', () => {
	brightnessFilter.style.backdropFilter = `brightness(${brightnessSlider.value})`;
});

closeErrorWindow();
