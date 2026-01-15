// Update date and time display
function updateDateTime() {
    const now = new Date();
    
    // Convert to CET (Central European Time)
    // CET is UTC+1, CEST (summer time) is UTC+2
    const options = {
        timeZone: 'Europe/Zurich',
        hour12: false
    };
    
    // Get the time in Zurich timezone
    const zurichTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Zurich' }));
    
    // Round down to nearest 5 minutes
    const minutes = zurichTime.getMinutes();
    const roundedMinutes = Math.floor(minutes / 5) * 5;
    zurichTime.setMinutes(roundedMinutes);
    zurichTime.setSeconds(0);
    zurichTime.setMilliseconds(0);
    
    // Format date
    const dateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    const dateString = zurichTime.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.');
    
    // Format time (without seconds)
    const timeString = zurichTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    
    // Update DOM elements
    document.getElementById('date').textContent = dateString;
    document.getElementById('time').textContent = timeString;
    
    // Apply brightness filter based on time of day
    applyDaylightFilter(zurichTime);
}

// Apply brightness filter to simulate daylight changes
function applyDaylightFilter(time) {
    const hour = time.getHours();
    const img = document.querySelector('.webcam-image');
    
    // Night (22:00 - 5:59): Lift shadows
    if (hour >= 22 || hour < 6) {
        img.style.filter = 'url(#lift-shadows) brightness(0.6) contrast(1.1)';
    }
    // Dawn (6:00 - 7:59): Gradually lift shadows more
    else if (hour >= 6 && hour < 8) {
        const progress = (hour - 6) / 2;
        const brightness = 0.7 + progress * 0.3; // 0.7 to 1.0
        img.style.filter = `url(#lift-shadows) brightness(${brightness}) contrast(1.15)`;
    }
    // Day (8:00 - 17:59): Maximum shadow lift with SVG filter and added contrast
    else if (hour >= 8 && hour < 18) {
        img.style.filter = 'url(#lift-shadows) brightness(1.0) contrast(1.2)';
    }
    // Dusk (18:00 - 21:59): Gradually reduce shadow lift
    else if (hour >= 18 && hour < 22) {
        const progress = (hour - 18) / 4;
        const brightness = 1.0 - progress * 0.4; // 1.0 to 0.6
        const contrast = 1.2 - progress * 0.1; // 1.2 to 1.1
        img.style.filter = `url(#lift-shadows) brightness(${brightness}) contrast(${contrast})`;
    }
}

// Refresh the image by adding a timestamp to prevent caching
function refreshImage() {
    const img = document.querySelector('.webcam-image');
    const timestamp = new Date().getTime();
    const baseUrl = 'temp.jpg';
    img.src = `${baseUrl}?t=${timestamp}`;
    updateDateTime();
}

// Update immediately
updateDateTime();

// Refresh image and time every 5 minutes (300000 milliseconds)
setInterval(refreshImage, 300000);
