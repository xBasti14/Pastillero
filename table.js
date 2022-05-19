function calculate(remedio, details, previous_date, current_date){
    if(remedio.id == details['product_id']){
        remedio.quantity+=details['quantity'];
        if(previous_date!=null){
            let days = Math.round((current_date-previous_date)/ (1000*60*60*24));
            let pastillas_consumidas = days*remedio.frequency;
            remedio.quantity-=pastillas_consumidas;
            if(remedio.quantity<0) remedio.quantity=0;
        }
    }
}

function llenarArray(data, arr){
    for(let item of data['payload']){
        const remedio = {
            id: item['id'],
            name: item['name'],
            concentration: item['concentration'],
            image: item['imagesUrl'],
            quantity: 0,
            frequency: 1
        }
        arr.push(remedio);
    }
}

function rellenarArray(data, arr){
    let current_date = null;
    let previous_date = null;
    for(let purchase of data['payload']){
        current_date = new Date(purchase["received_date"]);
        for(let details of purchase['details']){
            arr.forEach(remedio => calculate(remedio, details, previous_date, current_date));
        }
        previous_date = current_date;
        current_date = null;
    }


    let res = document.querySelector('#res')

    arr.forEach(remedio => {
        if(remedio.quantity > 0){
            res.innerHTML+= `
            <tr>
                <td>
                    <img src=${remedio.image} width="62px" height="62px">
                </td>
                <td class="izq">
                    <h1>${remedio.name}</h1>
                    <p>${remedio.concentration}</p>
                    <p>
                        <a href='#'>
                            Quedan ${remedio.quantity} comprimidos <br>
                            Para ${Math.round(remedio.quantity/remedio.frequency)} días
                        </a>
                    </p>
                </td>
                <td>
                    <a class="icono" href='#'> <i class="fa-solid fa-cart-plus"></i></a>
                </td>
            </tr>
            `
        }
    });
}

async function fun(arr){
    const res = await fetch("https://private-anon-d83d5c583b-inventurestest.apiary-mock.com/products");
    const data_products = await res.json();
    llenarArray(data_products, arr);
    const res2 = await fetch("https://private-anon-d83d5c583b-inventurestest.apiary-mock.com/purchases");
    const data_purchases = await res2.json();
    rellenarArray(data_purchases, arr);
}

const remedios = []
fun(remedios);