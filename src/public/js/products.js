const form = document.getElementById('testForm');
const productosContainer = document.querySelector('.productsContainer');

form.addEventListener('submit', evt => {
    evt.preventDefault();
    let data = new FormData(form);
    let obj = {};
    data.forEach((value, key) => obj[key] = value);
    if (obj.name != '' && obj.price != '' && obj.thumbnail != '') {
        socket.emit('addProduct', obj);
        form.reset();
    } else {
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('errorMessage');
        errorMessage.textContent = 'Debes completar todos los casilleros';
        form.append(errorMessage);
        setTimeout(() => {
            errorMessage.remove();
        },3000)
    }
})

socket.on('sendProduct', data => {
    console.log(data);

    productosContainer.textContent = '';

    data.forEach(product => {
        const productName = document.createElement('h3');
        const productPrice = document.createElement('p');
        const productIMG = document.createElement('img');
        const div = document.createElement('div');

        productName.textContent = product.name;
        productPrice.textContent = `$${product.price}`;
        productIMG.setAttribute('src', product.thumbnail);
        productIMG.setAttribute('alt', 'Imagen de producto');

        div.append(productName);
        div.append(productPrice);
        div.append(productIMG);

        productosContainer.append(div);
    })
})