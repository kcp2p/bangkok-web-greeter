// Import local classes
import { Data } from './data';
import { UI } from './ui';
import { Authenticator } from './auth';
import { Idler } from './idler';

declare global {
	interface Window {
		data: Data;
		auth: Authenticator;
		ui: UI;
		idler: Idler;

		sleep(ms: number): Promise<void>;
		restartComputer(): boolean;
		brightness: {
			decrease: () => void;
			increase: () => void;
		};
	}
}

// use with await window.sleep(1000); to sleep for 1 second
async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
window.sleep = sleep;

// use with window.restartComputer(); to restart the computer
window.restartComputer = () => {
	try {
		if (!window.lightdm?.can_restart) {
			window.ui.setDebugInfo("Rebooting failed: lightdm.can_restart is false");
			return false;
		}

		window.lightdm?.restart();
		return true;
	}
	catch (err) {
		window.ui.setDebugInfo(`Rebooting failed: ${err}`);
		return false;
	}
};

window.brightness = {
	decrease: () => {
		if (!window.lightdm?.can_access_brightness) {
			window.ui.setDebugInfo('Brightness control failed: lightdm.can_access_brightness is false');
			return;
		}
		window.lightdm?.brightness_decrease(10);
	},
	increase: () => {
		if (!window.lightdm?.can_access_brightness) {
			window.ui.setDebugInfo('Brightness control failed: lightdm.can_access_brightness is false');
			return;
		}
		window.lightdm?.brightness_increase(10);
	}
};

async function initGreeter(): Promise<void> {
	// Initialize local classes
	window.data = new Data();
	window.auth = new Authenticator();
	window.ui = new UI(window.data, window.auth);
	window.idler = new Idler(window.ui.isLockScreen);

	// Add reboot keybind to reboot on ctrl+alt+del
	// only when the lock screen is not shown
	document.addEventListener('keydown', (e) => {
		if (e.ctrlKey && e.altKey) { // Special keybinds
			switch (e.code) {
				case 'Delete': // Ctrl + Alt + Delete = reboot computer
					window.ui.setDebugInfo('Reboot requested through LightDM');
					window.restartComputer();
					break;
				case 'KeyE': // Ctrl + Alt + E = override exam mode
					window.ui.setDebugInfo('Exam mode override enabled');
					window.ui.overrideExamMode();
					break;
			}
		}
		else { // Regular keybinds
			switch (e.code) {
				case 'F1': // F1 = Decrease brightness
					window.brightness.decrease();
					break;
				case 'F2': // F2 = Increase brightness
					window.brightness.increase();
					break;
			}
		}
	});
}

window.addEventListener("GreeterReady", () => {
	initGreeter();
});
