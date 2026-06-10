console.log("APP CARGADA");

let esAdmin = false;

const acceso = confirm(
    "¿Ingresar como administrador?"
);



if(acceso){

    const password =
        prompt(
            "Contraseña:"
        );

if(password === "1234"){

    esAdmin = true;

    document.getElementById(
        "panelAdmin"
    ).style.display = "block";

    document.getElementById(
        "zonaCompra"
    ).style.display = "none";

}else{

    alert(
        "Contraseña incorrecta"
    );

    document.getElementById(
        "panelAdmin"
    ).style.display = "none";
}

}else{

    document.getElementById(
        "panelAdmin"
    ).style.display = "none";

}

window.onload = () => {

    setTimeout(() => {

        document.getElementById(
            "pantallaInicio"
        ).style.display = "none";

    }, 3000);

};

const btn = document.getElementById("btnGuardar");



let asientosSeleccionados = [];

let peliculaSeleccionada = "";

let horarioSeleccionado = "";

let precioSeleccionado = 0;

let asientosOcupados = [];

async function cargarAsientosOcupados(){

    if(
        !peliculaSeleccionada ||
        !horarioSeleccionado
    ){
        asientosOcupados = [];
        return;
    }

    try{

        const respuesta =
            await fetch(
                "/api/peliculas/asientos-ocupados/"
                + encodeURIComponent(
                    peliculaSeleccionada
                )
                + "/"
                + encodeURIComponent(
                    horarioSeleccionado
                )
            );

        if(!respuesta.ok){

            console.error(
                "Error en ruta:",
                respuesta.status
            );

            asientosOcupados = [];
            return;

        }

        asientosOcupados =
            await respuesta.json();

    }catch(error){

        console.error(error);

        asientosOcupados = [];

    }

}

btn.addEventListener("click", async () => {

    const pelicula = {

        titulo: document.getElementById("titulo").value,
        genero: document.getElementById("genero").value,
        descripcion: document.getElementById("descripcion").value,
        precio: Number(
            document.getElementById("precio").value
        ),

    fecha: document.getElementById(
        "fecha"
    ).value,


        horario1: document.getElementById("horario1").value,
        horario2: document.getElementById("horario2").value,
        horario3: document.getElementById("horario3").value,
        imagen: document.getElementById("imagen").value

    };

    console.log("ENVIANDO:");

    console.log(pelicula);

    const respuesta = await fetch(
        "/api/peliculas",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pelicula)
        }
    );

    const data = await respuesta.json();

    console.log("GUARDADO:");
    console.log(data);

document.getElementById("titulo").value = "";
document.getElementById("genero").value = "";
document.getElementById("descripcion").value = "";
document.getElementById("precio").value = "";
document.getElementById("horario1").value = "";
document.getElementById("horario2").value = "";
document.getElementById("horario3").value = "";
document.getElementById("imagen").value = "";

    cargarPeliculas();
    

});

async function cargarPeliculas() {

    const respuesta = await fetch(
        "/api/peliculas"
    );

    const peliculas = await respuesta.json();

    const cartelera =
        document.getElementById(
            "cartelera"
        );

    cartelera.innerHTML = "";

  peliculas.forEach(pelicula => {

    if (!pelicula.titulo) {
        return;
    }

cartelera.innerHTML += `

<div class="card">

${esAdmin ? `

<button
    class="btn-eliminar"
    onclick="eliminarPelicula('${pelicula._id}')"
>
    🗑 Eliminar
</button>

` : ""}

    <img
        src="${pelicula.imagen}"
        alt="${pelicula.titulo}"
    >

    <div class="card-body">

        <h3>${pelicula.titulo}</h3>

        <p>
            🎭 ${pelicula.genero}
        </p>

        <p>
            ${pelicula.descripcion}
        </p>

        <p class="precio">
            🎟 $${pelicula.precio}
        </p>

        <p>
    📅 ${pelicula.fecha || "Sin fecha"}
</p>

<div class="horarios">

    <button
        class="btnHorario"
        onclick="
seleccionarHorario(
'${pelicula.titulo}',
${pelicula.precio},
'${pelicula.horario1}'
)
"
    >
        ${pelicula.horario1}
    </button>

    <button
        class="btnHorario"
        onclick="
seleccionarHorario(
'${pelicula.titulo}',
${pelicula.precio},
'${pelicula.horario2}'
)
"
    >
        ${pelicula.horario2}
    </button>

    <button
        class="btnHorario"
        onclick="
seleccionarHorario(
'${pelicula.titulo}',
${pelicula.precio},
'${pelicula.horario3}'
)
"
    >
        ${pelicula.horario3}
    </button>

</div>

<button
    class="btn-comprar"
>
    🍿 Selecciona un horario(entrada)
</button>

    </div>

</div>

`;

});

}

(async () => {

    await cargarAsientosOcupados();

(async () => {

    await cargarAsientosOcupados();

    cargarPeliculas();

    cargarCompras();

    cargarEstadisticas();

})();
})();

function seleccionarHorario(
    titulo,
    precio,
    horario
){

    peliculaSeleccionada =
        titulo;

    precioSeleccionado =
        precio;

    horarioSeleccionado =
        horario;

    document.getElementById(
        "peliculaSeleccionada"
    ).innerHTML =

        "🎬 Película: "
        + titulo +

        "<br><br>🕐 Horario: "
        + horario;

cargarAsientosOcupados()
.then(() => {

    crearAsientos();

});

}





function crearAsientos(){

    const contenedor =
        document.getElementById("asientos");

    contenedor.innerHTML = "";

    asientosSeleccionados = [];

    const filas =
        ["A","B","C","D","E"];

    filas.forEach(fila => {

        for(let i=1;i<=5;i++){

            const codigo =
                fila + i;

            const asiento =
                document.createElement("div");

            asiento.className =
                "asiento";

            asiento.innerText =
                codigo;

            if(
                asientosOcupados.includes(codigo)
            ){
                asiento.classList.add(
                    "ocupado"
                );

                contenedor.appendChild(
                    asiento
                );

                continue;
            }

            asiento.onclick = () => {

                if(
                    asientosSeleccionados.includes(
                        codigo
                    )
                ){

                    asientosSeleccionados =
                        asientosSeleccionados.filter(
                            a => a !== codigo
                        );

                    asiento.classList.remove(
                        "seleccionado"
                    );

                }else{

                    asientosSeleccionados.push(
                        codigo
                    );

                    asiento.classList.add(
                        "seleccionado"
                    );

                }

                actualizarResumen();

            };

            contenedor.appendChild(
                asiento
            );

        }

    });

}

function actualizarResumen(){

    const total =
        precioSeleccionado *
        asientosSeleccionados.length;

    document.getElementById(
        "asientoElegido"
    ).innerHTML = `

    🎟 Boletos:
    ${asientosSeleccionados.length}

    <br><br>

    🕐 Horario:
${horarioSeleccionado}

<br><br>

    💺 Asientos:
    ${asientosSeleccionados.join(", ")}

    <br><br>

    💰 Total:
    $${total}

    `;

}

document
.getElementById("btnConfirmar")
.addEventListener("click", async () => {

    if(
        !peliculaSeleccionada
    ){
        alert(
            "Selecciona una película"
        );
        return;
    }

    if(
        asientosSeleccionados.length === 0
    ){
        alert(
            "Selecciona al menos un asiento"
        );
        return;
    }

    const total =
        precioSeleccionado *
        asientosSeleccionados.length;

        await fetch(
    "/api/peliculas/compra",
    {
        method: "POST",
        headers: {
            "Content-Type":
                "application/json"
        },
        body: JSON.stringify({

            pelicula:
                peliculaSeleccionada,

            horario:
                horarioSeleccionado,

            asientos:
                asientosSeleccionados,

            total:
                total

        })
    }
);

document.getElementById(
    "detalleCompra"
).innerHTML = `

🎬 <b>${peliculaSeleccionada}</b>

<br><br>

🕐 ${horarioSeleccionado}

<br><br>

💺 ${asientosSeleccionados.join(", ")}

<br><br>

💰 $${total}

`;

document.getElementById(
    "modalCompra"
).style.display = "flex";

await cargarAsientosOcupados();

cargarCompras();

cargarEstadisticas();

crearAsientos();

});

async function eliminarPelicula(id){

    const confirmar = confirm(
        "¿Eliminar esta película?"
    );

    if(!confirmar){
        return;
    }

    await fetch(
        "/api/peliculas/" + id,
        {
            method: "DELETE"
        }
    );

    cargarPeliculas();

}

async function cargarCompras(){

    const respuesta =
        await fetch(
            "/api/peliculas/compras"
        );

    const compras =
        await respuesta.json();

    const lista =
        document.getElementById(
            "listaCompras"
        );

    if(!lista){
        return;
    }

    lista.innerHTML = "";

    compras.forEach(compra => {

        lista.innerHTML += `

        <div class="compraCard">

            <h3>
                🎬 ${compra.pelicula}
            </h3>

            <p>
                🕐 ${compra.horario}
            </p>

            <p>
                💺 ${compra.asientos.join(", ")}
            </p>

            <p>
                💰 $${compra.total}
            </p>

        </div>

        `;

    });

}

document
.getElementById(
    "btnCerrarModal"
)
.addEventListener(
    "click",
    () => {

        document.getElementById(
            "modalCompra"
        ).style.display = "none";

    }
);

document
.getElementById(
    "btnEstrenos"
)
.addEventListener(
    "click",
    () => {

        alert(
            "🎬 Próximamente podrás recibir notificaciones de nuevos estrenos."
        );

    }
);

async function cargarEstadisticas(){

    const respuesta =
        await fetch(
            "/api/peliculas/compras"
        );

    const compras =
        await respuesta.json();

    const estadisticas =
        document.getElementById(
            "estadisticas"
        );

    if(!estadisticas){
        return;
    }

    estadisticas.innerHTML = "";

    const resumen = {};

    compras.forEach(compra => {

        if(
            !resumen[compra.pelicula]
        ){

            resumen[
                compra.pelicula
            ] = {

                boletos: 0,
                ingresos: 0

            };

        }

        resumen[
            compra.pelicula
        ].boletos +=
            compra.asientos.length;

        resumen[
            compra.pelicula
        ].ingresos +=
            compra.total;

    });

    for(
        let pelicula
        in resumen
    ){

        estadisticas.innerHTML += `

        <div class="compraCard">

            <h3>
                🎬 ${pelicula}
            </h3>

            <p>
                🎟 Boletos:
                ${resumen[pelicula].boletos}
            </p>

            <p>
                💰 Ingresos:
                $${resumen[pelicula].ingresos}
            </p>

        </div>

        `;

    }

}

function moverDerecha(id){

    document.getElementById(id)
    .scrollBy({

        left:300,

        behavior:"smooth"

    });

}

function moverIzquierda(id){

    document.getElementById(id)
    .scrollBy({

        left:-300,

        behavior:"smooth"

    });

}