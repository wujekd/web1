// Function to validate user credentials
export default function(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user by username
    const user = users.find(user => user.username === username);
    
    // Check if user exists and password matches
    if (user) {
        if (password == user.password) {
            return true; // Valid credentials
        } else {
            return false; // Invalid password
        }
    } else {
        return null; // User not found
    }
}
