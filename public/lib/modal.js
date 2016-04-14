var modal = document.querySelector('[data-modal-content]');
var buttonOpen = document.querySelector('[data-button-modal-open]');
var buttonClose = document.querySelector('[data-button-modal-close]');

// When the user clicks on the button, open the modal 
buttonOpen.onclick = function() {
	event.preventDefault();
    modal.parentElement.style.display = "block";
}

// When the user clicks the x, close the modal
buttonClose.onclick = function() {
    modal.parentElement.style.display = "none";
}

// When the user clicks anywhere outside of the modal content, when the modal is open, close it
window.onclick = function(event) {
    if (event.target == modal.parentElement) {
        modal.parentElement.style.display = "none";
    }
}