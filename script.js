document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const imageContainer = document.getElementById('imageContainer');
    const overlayText = document.getElementById('overlayText');
    const overlayButton = document.getElementById('overlayButton');
    const saveButton = document.getElementById('saveButton');

    let images = [];

    imageInput.addEventListener('change', (event) => {
        images = Array.from(event.target.files);
        displayImages(images);
    });

    overlayButton.addEventListener('click', () => {
        const text = overlayText.value;
        if (!text) return;

        images.forEach((image, index) => {
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;

                    ctx.drawImage(img, 0, 0);
                    ctx.fillStyle = 'gray';
                    ctx.fillRect(0, canvas.height - 50, canvas.width, 50); // Gray background for text
                    ctx.font = '30px Arial';
                    ctx.fillStyle = 'white';

                    // Split text into lines and adjust Y position for each line
                    const lines = text.split('\n');
                    lines.forEach((line, lineIndex) => {
                        const y = canvas.height - 10 - (lines.length - 1 - lineIndex) * 30;
                        ctx.fillText(line, 20, y);
                    });

                    images[index] = canvas.toDataURL('image/png');
                };
            };

            reader.readAsDataURL(image);
        });

        displayImages(images);
    });

    saveButton.addEventListener('click', () => {
        images.forEach((imageDataUrl, index) => {
            const a = document.createElement('a');
            a.href = imageDataUrl;
            a.download = `image_${index + 1}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });

    function displayImages(images) {
        imageContainer.innerHTML = '';
        images.forEach((imageDataUrl, index) => {
            const img = document.createElement('img');
            img.src = imageDataUrl;
            img.alt = `Image ${index + 1}`;
            imageContainer.appendChild(img);
        });
    }
});
