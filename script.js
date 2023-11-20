// script.js

// Function to set Discord avatar if the image URL is not available
function setDiscordAvatar(element, discordId, defaultAvatar) {
    element.src = `https://cdn.discordapp.com/avatars/${discordId}/${defaultAvatar}`;
}

document.addEventListener("DOMContentLoaded", function() {
    // Check and set Discord avatars for each staff member
    const avatars = document.querySelectorAll('.avatar');
    avatars.forEach(avatar => {
        avatar.onerror = function() {
            // If the avatar URL fails, load the specified Discord avatar
            const discordId = this.getAttribute('data-discord-id');
            const defaultAvatar = this.getAttribute('data-default-avatar');
            setDiscordAvatar(this, discordId, defaultAvatar);
        };
    });
});
