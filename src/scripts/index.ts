import '../styles/style.css';


function component() {
    const element = document.createElement('div');
    element.innerHTML = "Hello webpack! kurczę!"

    element.classList.add('hello');

    return element;
}

document.body.appendChild(component());
