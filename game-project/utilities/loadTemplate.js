

export default function loadTemplate(tempID) {
    const template = document.getElementById(tempID);
    let element = template.content.cloneNode(true).firstElementChild;
    
    // Start the fade-out transition
    mainContainer.style.opacity = '0';  // Trigger the fade-out

    setTimeout(() => {
        // Remove the previous content and append the new one
        mainContainer.innerHTML = "";  
        mainContainer.appendChild(element);
        
        // Start the fade-in transition after the content is swapped
        mainContainer.style.opacity = '100%';  
    }, 400);
}