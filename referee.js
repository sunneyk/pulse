document.addEventListener('DOMContentLoaded', (event) => {
const socket = new WebSocket('ws://localhost:8080');

document.getElementById('goodLift').addEventListener('click', () => {
    if (socket.readyState === WebSocket.OPEN) {
    socket.send('good');
    } else {
    alert('WebSocket is not connected.');
    }
});

document.getElementById('noLift').addEventListener('click', () => {
    if (socket.readyState === WebSocket.OPEN) {
    socket.send('no');
    } else {
    alert('WebSocket is not connected.');
    }
});
});
