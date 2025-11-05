const staffIds = [
    "406084422308331522", // cooles
    "789872551731527690", // fox
    "853550207039832084", // nexx
    "848339671629299742", // thor
    "500212086765518858", // clay
    "250322741406859265", // katlyn
    "929208515883569182", // indi
    "258731845267619840", // p0rtl
    "1180778779682033715", // aster
    "1124647765075566662", // michelle
    "613725399263739926", // 4mmar
    "422319200095436800"  // artem4egg_
];

const bannerMap = {
    "406084422308331522": "https://i.imgur.com/vzyxjz8.gif", // cooles
    "789872551731527690": "https://i.imgur.com/U3xaMjR.gif", // fox
    "853550207039832084": "https://i.ibb.co/MBY0qxx/nexpid.gif", // nexx
    "848339671629299742": "https://i.imgur.com/FiRr8Lj.png", // thor
    "500212086765518858": "https://i.imgur.com/bAuCtgB.png", // clay
    "250322741406859265": "https://i.imgur.com/mkTL1S8.png", // katlyn
    "929208515883569182": "https://i.imgur.com/ZflpQQ3.png", // indi
    "258731845267619840": "https://i.imgur.com/2mitqtb.png", // p0rtl
    "1180778779682033715": "", // aster
    "1124647765075566662": "", // michelle
    "613725399263739926": "", // 4mmar
    "422319200095436800": ""  // artem4egg_
};

const StatusLabels = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline",
};

const ActivityTypes = {
    0: 'Playing ',
    1: 'Streaming ',
    2: 'Listening to ',
    3: 'Watching ',
    4: 'Custom ',
    5: 'Competing in ',
}

function getActivityLabel(activity) {
    return ActivityTypes[activity.type] ?? ''
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        [array[i], array[r]] = [array[r], array[i]];
    }
}

async function fetchUsers(ids) {
    const results = await Promise.all(
        ids.map(async (id) => {
            try {
                const res = await fetch(`https://lanyard.equicord.org/v1/users/${id}`);
                if (!res.ok) return null;
                const json = await res.json();
                return json.success ? [id, json.data] : null;
            } catch {
                return null;
            }
        })
    );

    const filtered = results.filter(Boolean);
    return Object.fromEntries(filtered);
}

function createStaffMember(userData, id) {
    const u = userData.discord_user;
    const activities = userData.activities || [];
    const discordStatus = userData.discord_status;

    const avatarUrl = u.avatar
        ? u.avatar.startsWith("a_") ? `https://cdn.discordapp.com/avatars/${id}/${u.avatar}.gif?size=128`
            : `https://cdn.discordapp.com/avatars/${id}/${u.avatar}.webp?size=128`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';

    const displayName = u.global_name || u.username || "Unknown";
    const statusLabel = StatusLabels[discordStatus] || "Unknown";

    const customStatus = activities.find(a => a.type === 4);
    const otherActivity = activities.find(a => a.type !== 4);

    const bannerUrl = bannerMap[id] || "https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png";

    let statusText = `<p><strong>Status:</strong> ${statusLabel}</p>`;

    if (discordStatus !== "offline") {
        if (customStatus?.state) {
            statusText += `<p><strong>Custom Status:</strong> ${customStatus.state}</p>`;
        }

        if (otherActivity) {
            const activityText = otherActivity.details ?? otherActivity.name;
            statusText += `<p><strong>Activity:</strong> ${getActivityLabel(otherActivity)}${activityText}</p>`;
        }
    }

    return `
        <div class="staff-member">
            <img class="banner" src="${bannerUrl}">
            <div class="username" data-id="${id}">${displayName} (@${u.username})</div>
            <div class="staff-content">
                <div class="avatar-container">
                    <img class="avatar" data-id="${id}" src="${avatarUrl}" alt="User Avatar">
                </div>
                <div class="description-box">
                    ${statusText}
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    shuffleArray(staffIds);
    const userData = await fetchUsers(staffIds);
    const container = document.querySelector('.container');

    container.innerHTML = staffIds
        .map(id => {
            const user = userData[id];
            return user ? createStaffMember(user, id) : '';
        })
        .join('');
});