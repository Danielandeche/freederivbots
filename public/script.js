const fileList = document.getElementById("file-list");
let currentSection = 'bots';  // To keep track of the current section

// Fetch the list of files based on the current section (Deriv Bots or Strategy)
function fetchFiles() {
    let fetchUrl = currentSection === 'bots' ? 'https://freederivbots.vercel.app/files' : 'https://freederivbots.vercel.app/strategies';

    fetch(fetchUrl)
        .then(response => response.json())
        .then(files => {
            fileList.innerHTML = ''; // Clear previous file list
            files.forEach(file => {
                const fileItem = document.createElement("div");
                fileItem.classList.add("file-item");

                const fileInfo = document.createElement("span");

                const fileName = document.createElement("h2");
                fileName.textContent = file.name;

                const fileDescription = document.createElement("p");
                fileDescription.textContent = file.description || "No description available.";

                fileInfo.appendChild(fileName);
                fileInfo.appendChild(fileDescription);

                const downloadButton = document.createElement("a");
                downloadButton.href = `https://freederivbots.vercel.app/download/${file.name}`;
                downloadButton.textContent = "Download";
                downloadButton.classList.add("download-btn");

                fileItem.appendChild(fileInfo);
                fileItem.appendChild(downloadButton);

                fileList.appendChild(fileItem);
            });
        })
        .catch(error => console.error('Error fetching files:', error));
}

// Fetch files on page load for the default section (bots)
fetchFiles();

// Handle section button clicks
document.getElementById('deriv-bots-btn').addEventListener('click', function() {
    currentSection = 'bots';
    document.getElementById('file-input').setAttribute('accept', '.xml');
    fetchFiles();
});

document.getElementById('strategy-btn').addEventListener('click', function() {
    currentSection = 'strategies';
    document.getElementById('file-input').setAttribute('accept', '.pdf,.doc,.docx');
    fetchFiles();
});

// Handle file upload
document.getElementById('upload-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('file-input');
    const descriptionInput = document.getElementById('description-input');

    if (fileInput.files.length === 0) {
        alert("Please choose a file.");
        return;
    }

    formData.append('file', fileInput.files[0]);
    formData.append('description', descriptionInput.value);

    let uploadUrl = currentSection === 'bots' ? 'https://freederivbots.vercel.app/upload' : 'https://freederivbots.vercel.app/upload-strategy';

    fetch(uploadUrl, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchFiles(); // Refresh file list after upload
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
});

// Theme toggle switch functionality
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("change", function() {
    if (themeToggle.checked) {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    }
});

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }, function(error) {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// Handle install prompt (beforeinstallprompt event)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    document.body.appendChild(installButton);

    installButton.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    });
});
const fileList = document.getElementById("file-list");

function fetchFiles() {
    fetch('http://localhost:3000/files')
        .then(response => response.json())
        .then(files => {
            fileList.innerHTML = ''; // Clear previous file list
            files.forEach(file => {
                const fileItem = document.createElement("div");
                fileItem.classList.add("file-item");

                const fileInfo = document.createElement("span");

                const fileName = document.createElement("h2");
                fileName.textContent = file.name;

                const fileDescription = document.createElement("p");
                fileDescription.textContent = file.description || "No description available.";

                fileInfo.appendChild(fileName);
                fileInfo.appendChild(fileDescription);

                const downloadButton = document.createElement("a");
                downloadButton.href = `http://localhost:3000/download/${file.name}`; // Updated to use the new download route
                downloadButton.textContent = "Download";
                downloadButton.classList.add("download-btn");

                fileItem.appendChild(fileInfo);
                fileItem.appendChild(downloadButton);

                fileList.appendChild(fileItem);
            });
        })
        .catch(error => console.error('Error fetching files:', error));
}

// Fetch files on page load
fetchFiles();

document.getElementById('upload-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.querySelector('input[name="xmlFile"]');
    const descriptionInput = document.querySelector('input[name="description"]');

    if (fileInput.files.length === 0) {
        alert("Please choose a file.");
        return;
    }

    formData.append('xmlFile', fileInput.files[0]);
    formData.append('description', descriptionInput.value);

    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchFiles(); // Refresh file list after upload
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
});

// Theme toggle switch functionality
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("change", function() {
    if (themeToggle.checked) {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    }
});

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }, function(error) {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// Handle install prompt (beforeinstallprompt event)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    document.body.appendChild(installButton);

    installButton.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    });
});
