


export default function(container, logged, top, games){

    const template = document.getElementById("menuTemplate");
    const element = template.content.cloneNode(true).firstElementChild;

    container.style.opacity = '0';  // Trigger the fade-out

    // Listen for the end of the transition (fade-out complete)
    setTimeout(()=> {
        // Remove the previous content and append the new one
        container.innerHTML = "";  
        container.appendChild(element);
        
        // Start the fade-in transition after the content is swapped
        container.style.opacity = '100%';  

        // Remove the event listener to prevent it from firing multiple times
        container.removeEventListener('transitionend', onTransitionEnd);
    },450);
}