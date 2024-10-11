export default function(username, password){
    let users = JSON.parse(localStorage.getItem('users')) || [];
 
        const user = users.find(user => user.username === username);
        if (user){
            if (password == user.password){
                return true;
            } else {
                return false;
            }
        } else {
            return null;
        }
}