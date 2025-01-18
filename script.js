        let is24Hour = false;
        let showSeconds = true;
        let isDarkMode = false;
        let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let alarms = [];
        let stopwatchInterval;
        let timerInterval;
        let stopwatchTime = 0;
        let timerTime = 0;

        function updateClock() {
            const now = new Date();
            const timeElement = document.getElementById('time');
            const dateElement = document.getElementById('date');

            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            
            if (!is24Hour) {
                const period = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
            }
            
            hours = hours.toString().padStart(2, '0');
            
            let timeString = `${hours}:${minutes}`;
            if (showSeconds) timeString += `:${seconds}`;
            if (!is24Hour) timeString += ` ${period}`;
            
            timeElement.textContent = timeString;
            
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString(undefined, options);

            checkAlarms(now);
        }

        function toggleTimeFormat() {
            is24Hour = !is24Hour;
            updateClock();
        }

        function toggleSeconds() {
            showSeconds = !showSeconds;
            updateClock();
        }

        function toggleDarkMode() {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode');
        }

        function changeFont() {
            const font = document.getElementById('fontSelect').value;
            document.querySelector('.time').style.fontFamily = font;
        }

        function changeTextColor() {
            const color = document.getElementById('textColor').value;
            document.documentElement.style.setProperty('--text-color', color);
        }

        function changeBackground() {
            const color = document.getElementById('bgColor').value;
            document.documentElement.style.setProperty('--clock-bg', color);
        }

        function setAlarm() {
            const time = document.getElementById('alarmTime').value;
            const sound = document.getElementById('alarmSound').value;
            
            if (time) {
                alarms.push({ time, sound, active: true });
                updateAlarmList();
            }
        }

        function checkAlarms(now) {
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            alarms.forEach(alarm => {
                if (alarm.active && alarm.time === currentTime) {
                    playAlarm(alarm.sound);
                }
            });
        }

        function playAlarm(sound) {
            const audio = new Audio(`/alarms/${sound}.mp3`);
            audio.play();
        }

        function updateAlarmList() {
            const alarmList = document.getElementById('alarmList');
            alarmList.innerHTML = '';
            
            alarms.forEach((alarm, index) => {
                const alarmElement = document.createElement('div');
                alarmElement.className = 'alarm-item';
                alarmElement.innerHTML = `
                    <span>${alarm.time}</span>
                    <button onclick="deleteAlarm(${index})">Delete</button>
                `;
                alarmList.appendChild(alarmElement);
            });
        }

        function deleteAlarm(index) {
            alarms.splice(index, 1);
            updateAlarmList();
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }

        function toggleStopwatch() {
            const stopwatchElement = document.getElementById('stopwatch');
            
            if (stopwatchElement.style.display === 'none') {
                stopwatchElement.style.display = 'block';
                startStopwatch();
            } else {
                stopwatchElement.style.display = 'none';
                clearInterval(stopwatchInterval);
            }
        }

        function startStopwatch() {
            stopwatchInterval = setInterval(() => {
                stopwatchTime++;
                updateStopwatchDisplay();
            }, 1000);
        }

        function updateStopwatchDisplay() {
            const hours = Math.floor(stopwatchTime / 3600);
            const minutes = Math.floor((stopwatchTime % 3600) / 60);
            const seconds = stopwatchTime % 60;
            
            document.getElementById('stopwatch').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function toggleTimer() {
            const timerElement = document.getElementById('timer');
            
            if (timerElement.style.display === 'none') {
                timerElement.style.display = 'block';
                const minutes = prompt('Enter minutes for timer:', '5');
                if (minutes) {
                    timerTime = minutes * 60;
                    startTimer();
                }
            } else {
                timerElement.style.display = 'none';
                clearInterval(timerInterval);
            }
        }

        function startTimer() {
            updateTimerDisplay();
            timerInterval = setInterval(() => {
                if (timerTime > 0) {
                    timerTime--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    playAlarm('alarm1');
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            const hours = Math.floor(timerTime / 3600);
            const minutes = Math.floor((timerTime % 3600) / 60);
            const seconds = timerTime % 60;
            
            document.getElementById('timer').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function resetAll() {
            is24Hour = false;
            showSeconds = true;
            isDarkMode = false;
            document.body.classList.remove('dark-mode');
            document.getElementById('fontSelect').value = 'Orbitron';
            document.getElementById('textColor').value = '#00ff00';
            document.getElementById('bgColor').value = '#000000';
            document.documentElement.style.setProperty('--text-color', '#00ff00');
            document.documentElement.style.setProperty('--clock-bg', '#000000');
            document.querySelector('.time').style.fontFamily = 'Orbitron';
            alarms = [];
            updateAlarmList();
            clearInterval(stopwatchInterval);
            clearInterval(timerInterval);
            stopwatchTime = 0;
            timerTime = 0;
            document.getElementById('stopwatch').style.display = 'none';
            document.getElementById('timer').style.display = 'none';
            updateClock();
        }

        function populateTimezones() {
            const timezoneSelect = document.getElementById('timezone');
            const timezones = Intl.supportedValuesOf('timeZone');
            
            timezones.forEach(timezone => {
                const option = document.createElement('option');
                option.value = timezone;
                option.textContent = timezone.replace(/_/g, ' ');
                if (timezone === currentTimezone) {
                    option.selected = true;
                }
                timezoneSelect.appendChild(option);
            });
        }

        function changeTimezone() {
            currentTimezone = document.getElementById('timezone').value;
            updateClock();
        }

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 't':
                        e.preventDefault();
                        toggleTimeFormat();
                        break;
                    case 's':
                        e.preventDefault();
                        toggleSeconds();
                        break;
                    case 'd':
                        e.preventDefault();
                        toggleDarkMode();
                        break;
                    case 'f':
                        e.preventDefault();
                        toggleFullscreen();
                        break;
                }
            }
        });

        const themes = {
            classic: { text: '#00ff00', bg: '#000000', font: 'Orbitron' },
            modern: { text: '#ffffff', bg: '#2c3e50', font: 'Roboto Mono' },
            retro: { text: '#ff8c00', bg: '#2a2a2a', font: 'Digital-7' },
            minimal: { text: '#000000', bg: '#ffffff', font: 'Roboto Mono' }
        };

        function applyTheme(themeName) {
            const theme = themes[themeName];
            document.documentElement.style.setProperty('--text-color', theme.text);
            document.documentElement.style.setProperty('--clock-bg', theme.bg);
            document.querySelector('.time').style.fontFamily = theme.font;
            document.getElementById('fontSelect').value = theme.font;
            document.getElementById('textColor').value = theme.text;
            document.getElementById('bgColor').value = theme.bg;
        }

        let previousTime = '';
        function animateTimeChange(newTime) {
            if (previousTime !== newTime) {
                const timeElement = document.getElementById('time');
                timeElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    timeElement.style.transform = 'scale(1)';
                }, 100);
                previousTime = newTime;
            }
        }

        function initializeClock() {
            populateTimezones();
            updateClock();
            setInterval(updateClock, 1000);

            // Add transition for time element
            const timeElement = document.getElementById('time');
            timeElement.style.transition = 'transform 0.1s ease-in-out';

            // Register service worker for offline functionality
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch(err => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            }
        }

        document.addEventListener('DOMContentLoaded', initializeClock);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(stopwatchInterval);
                clearInterval(timerInterval);
            } else {
                if (document.getElementById('stopwatch').style.display !== 'none') {
                    startStopwatch();
                }
                if (document.getElementById('timer').style.display !== 'none' && timerTime > 0) {
                    startTimer();
                }
            }
        });

        window.addEventListener('online', () => {
            document.body.style.opacity = '1';
        });

        window.addEventListener('offline', () => {
            document.body.style.opacity = '0.8';
        });
