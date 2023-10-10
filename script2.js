var commentContainer = document.getElementById('comment-form'); // Get the comment form element

// Toggle the display property to 'none'
commentContainer.style.display = (commentContainer.style.display = 'none');

// Function to toggle the visibility of the comment form
function toggleCommentContainer() {
    // Toggle the display property between 'none' and 'block'
    commentContainer.style.display = (commentContainer.style.display === 'none' || commentContainer.style.display === '') ? 'block' : 'none';
}

// Add event listener for form submission
document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent default form submission behavior
    
    var data = new FormData(this);  // Create a FormData object from the form
    var object = {};  // Initialize an empty object
    
    // Get the submit button element
    var submitButton = this.querySelector('button[type="submit"]');
    // Disable the submit button and change its text
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Iterate through the FormData entries and populate the object
    data.forEach(function(value, key){
      object[key] = value;
    });
    
    // Send a POST request to the Cloudflare Worker
    fetch('https://comments-form.crownzcom.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  // Set the content type to JSON
      },
      body: JSON.stringify(object),  // Stringify the object to JSON for the request body
    })

    .then(response => response.json())  // Parse the response as JSON

    .then(data => {
      console.log(data);  // Log the response data to the console
      // Check the result property of the response data
      if (data.result === 'Success') {
        // Clear the comment textarea
        document.querySelector('#comment-form textarea[name="comment"]').value = '';
        alert('Comment submitted successfully!');  // Alert success message
      } else {
        alert('Error: ' + data.message);  // Alert error message
      }
    })

    .catch(error => {
      console.error('Error:', error);  // Log any errors to the console
      alert('An error occurred. Please try again later.');  // Alert error message
    })

    .finally(() => {
        // Re-enable the submit button and change its text back to "Submit"
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    });
});