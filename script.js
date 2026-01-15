// Update date and time display
function updateDateTime() {
    const now = new Date();
    
    // Round down to nearest 5 minutes
    const minutes = now.getMinutes();
    const roundedMinutes = Math.floor(minutes / 5) * 5;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    
    // Convert to CET (Central European Time)
    // CET is UTC+1, CEST (summer time) is UTC+2
    const options = {
        timeZone: 'Europe/Zurich',
        hour12: false
    };
    
    // Format date
    const dateOptions = {
        ...options,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    const dateString = now.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.');
    
    // Format time (without seconds)
    const timeOptions = {
        ...options,
        hour: '2-digit',
        minute: '2-digit'
    };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    // Update DOM elements
    document.getElementById('date').textContent = dateString;
    document.getElementById('time').textContent = timeString;
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
