// Modal elements
const modal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');

// Modal functions 
export function showModal(message) {
    modalMessage.textContent = message;
    modal.showModal(); // VIDEO COMMENT: 4 ------- Modal Dialogos display
}

export function closeModal() {
    modal.close();
}