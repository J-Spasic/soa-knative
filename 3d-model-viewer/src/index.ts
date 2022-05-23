document.body.onload = async (): Promise<void> => {
    const rootDivElement: HTMLDivElement = document.getElementById('root') as HTMLDivElement;

    const controlsDivElement: HTMLDivElement = document.createElement('div');
    controlsDivElement.className = 'choose-model-controls';
    rootDivElement.appendChild(controlsDivElement);

    const displayModelPlaceholderDivElement: HTMLDivElement = document.createElement('div');
    displayModelPlaceholderDivElement.className = 'display-model-placeholder';
    rootDivElement.appendChild(displayModelPlaceholderDivElement);

    const modelViewerElement: HTMLElement = document.createElement('model-viewer');
    modelViewerElement.setAttribute('ar', 'true');
    modelViewerElement.setAttribute('autoplay', 'true');
    modelViewerElement.setAttribute('camera-controls', 'true');
    displayModelPlaceholderDivElement.appendChild(modelViewerElement);

    const modelSelectElement: HTMLSelectElement = document.createElement('select');
    modelSelectElement.className = 'form-select';
    modelSelectElement.setAttribute('style', 'max-width: 200px;');
    controlsDivElement.appendChild(modelSelectElement);

    await fetch('http://127.0.0.1:8080/3dModels', {
        method: 'GET',
        mode: 'cors'
    }).then((response: Response): Promise<string[]> => {
        return response.json();
    }).then((availableModels: string[]): void => {
        availableModels.forEach((model: string) => {
            const modelOptionElement: HTMLOptionElement = document.createElement('option');
            modelOptionElement.setAttribute('key', model);
            modelOptionElement.setAttribute('value', model);
            modelOptionElement.innerHTML = model;
            modelSelectElement.add(modelOptionElement);
        });
    });

    const displayModelButtonElement: HTMLButtonElement = document.createElement('button');
    displayModelButtonElement.classList.add('btn', 'btn-primary');
    displayModelButtonElement.innerHTML = 'Display Model';
    displayModelButtonElement.onclick = async (event: Event): Promise<void> => {
        event.preventDefault();

        const modelName: string = (modelSelectElement.selectedOptions.item(0) as HTMLOptionElement)
            .getAttribute('key') as string;
        await fetch(`http://127.0.0.1:8080/3dModels/${modelName}`, {
            method: 'GET',
            mode: 'cors'
        }).then((response: Response): Promise<string> => {
            return response.text();
        }).then((resourceUri: string): void => {
            modelViewerElement.setAttribute('src', resourceUri);
        });
    };
    controlsDivElement.appendChild(displayModelButtonElement);

    if (modelSelectElement.options.length !== 0) {
        (modelSelectElement.options.item(0) as HTMLOptionElement).selected = true;
    } else {
        displayModelButtonElement.disabled = true;
    }
};
