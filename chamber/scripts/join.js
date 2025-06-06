document.addEventListener('DOMContentLoaded', () => {

    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    
    const closeModalButtons = document.querySelectorAll('dialog .close');

    // Function to open a dialog
    function openModal(dialog) {
        if (dialog == null) return;
        dialog.showModal();
    }

    // Function to close a dialog
    function closeModal(dialog) {
        if (dialog == null) return;
        dialog.close();
    }

    // Handling the Learn More buttons
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dialog = document.querySelector(button.dataset.modalTarget);
            openModal(dialog);
        });
    });

    // Closing the Modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dialog = button.closest('dialog');
            closeModal(dialog);
        });
    });

    // Dealing with the time stamp
    const joinForm = document.querySelector('.join-form');
    const timestampInput = document.getElementById('formTimestamp');

    joinForm.addEventListener('submit', () => {
        const now = new Date();
        
        timestampInput.value = now.toISOString();
    });
});