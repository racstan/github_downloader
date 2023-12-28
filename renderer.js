document.getElementById('download-button').addEventListener('click', () => {
    const githubUrl = document.getElementById('github-url').value;
    console.log('Sending download-from-github event with URL:', githubUrl);
    window.api.send('download-from-github', githubUrl);
});

window.api.on('download-progress', (progress) => {
    document.getElementById('progress-bar').value = progress;
});

window.api.on('download-complete', (filePath) => {
    console.log('Download complete:', filePath);
    window.api.openPath(filePath).catch(error => {
        console.error('Error opening file:', error);
    });
});

window.api.on('download-error', (error) => {
    console.error('Download error:', error);
});