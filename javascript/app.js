/**APARENTEMENTE FUNCIONANDO TODO EL CRUD BIEN */
//Contenedor de tareas, donde se almacenara cada tarea nueva creada
const contTareas = document.querySelectorAll('.contenedor-tareas');
//Se almacena la ventana modal
const ventanaModal = document.querySelector('.modal');

//Se almacenan todos los elementos del plus
const btnplus = document.querySelectorAll('.panel-izquierdo img');
let btnDia;

//Elementos del formulario
const formulario = document.getElementById('formulario');
const inputTitulo = document.getElementById('titulo');
const textAreaNotas = document.getElementById('notas');
const selectDificultad = document.getElementById('dificultad');
const inputIDActu = document.getElementById('idActu');

//Se almacena la base de datos
const baseDatos = new BaseDatos();
//MODIFICACION

function crearDiv(dia, tareasDia) {

    //Se crea todos los elemento de la tarea
    const divTarea = document.createElement('div');

    //En el encabezado va el titulo y el boton de elimnar
    const divTareaEncabezado = document.createElement('div');
    divTareaEncabezado.classList.add('encabezadoT');

    const tituloTarea = document.createElement('h3');
    tituloTarea.textContent = tareasDia.value.titulo;
    tituloTarea.setAttribute('id', dia.concat(tareasDia.key).concat('titulo'));

    const notasTarea = document.createElement('p');
    notasTarea.textContent = tareasDia.value.notas;
    notasTarea.setAttribute('id', dia.concat(tareasDia.key).concat('notas'));

    const dificultadTarea = document.createElement('p');

    const strongDif = document.createElement('strong');
    strongDif.style.color = '#180079';
    strongDif.textContent = 'Dificultad : ';

    const labelDificultad = document.createElement('label');
    labelDificultad.textContent = tareasDia.value.dificultad;
    labelDificultad.setAttribute('id', dia.concat(tareasDia.key).concat('dificultad'));

    dificultadTarea.appendChild(strongDif);
    dificultadTarea.appendChild(labelDificultad);

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'X';
    btnEliminar.classList.add('btn-eliminar');

    //Se agregan los elemento al ancabezado
    divTareaEncabezado.appendChild(tituloTarea);
    divTareaEncabezado.appendChild(btnEliminar);
    
    //Se agregan todos los elementos al divTarea
    divTarea.appendChild(divTareaEncabezado);
    divTarea.appendChild(notasTarea);
    divTarea.appendChild(dificultadTarea);
    

    divTarea.classList.add('tarea');
    //Esto se agrega para que al actulizar el dom solamente sea necesario modificar este div con ese id
    divTarea.setAttribute('id', dia.concat(tareasDia.key));

    //Se le agrega el evento para actualizar
    divTarea.addEventListener('click', function () {

        //Se le pone al formulario para que al dar submit se sepa que va a actualizar
        formulario.setAttribute('tipo-accion', 'actualizar');
        //Se le agrega el atributo actu-dia para poder hacer el correcto update en el indexeddb
        formulario.setAttribute('actu-dia', dia);

        //Se le agrega las propiedades para abrir el modal del formulario
        ventanaModal.classList.add('modal-show');

        //Nos traemos todos los elementos que contienen los datos de las tareas
        const tit = document.getElementById(dia.concat(tareasDia.key).concat('titulo'));
        const not = document.getElementById(dia.concat(tareasDia.key).concat('notas'));
        const dif = document.getElementById(dia.concat(tareasDia.key).concat('dificultad'));
        //Llenar los datos en el formulario para realizar la actu
        inputTitulo.value = tit.textContent;
        textAreaNotas.value = not.textContent;
        selectDificultad.value = dif.textContent;
        //Se agrega el id al input hidden para saber a cual hacerle el update
        inputIDActu.value = tareasDia.key;

    });

    btnEliminar.addEventListener('click', (e)=> {
        e.stopPropagation();
        console.log('Eliminar');        

        //Se elimina del indexeddb
        baseDatos.eliminar(tareasDia.key, dia);
        //Se elimina en el dom
        divTarea.remove();

    });

    return divTarea;
}

function listarTareasDOM(semana) {

    //Se traen los datos del indexedDB en un objeto
    const objecSemana = semana;

    //Se crean los fragmentos
    const fragmentoLunes = document.createDocumentFragment();
    const fragmentoMartes = document.createDocumentFragment();
    const fragmentoMiercoles = document.createDocumentFragment();
    const fragmentoJueves = document.createDocumentFragment();
    const fragmentoViernes = document.createDocumentFragment();
    const fragmentoSabado = document.createDocumentFragment();
    const fragmentoDomingo = document.createDocumentFragment();

    const arregloFragmentos = [fragmentoLunes,
        fragmentoMartes,
        fragmentoMiercoles,
        fragmentoJueves,
        fragmentoViernes,
        fragmentoSabado,
        fragmentoDomingo];

    console.log(objecSemana);

    //Este recorre todos los contenedores de tareas de los días
    contTareas.forEach((contDia, i) => {

        //Esto recorre las tareas por día, aquí se crean los div tarea
        objecSemana[contDia.getAttribute('cont-tareas-dia')].forEach(tareasDia => {

            
            const divTarea = crearDiv(contDia.getAttribute('cont-tareas-dia'), tareasDia);

            //Aquí se le agrega al fragmento todos los divs de tarea
            arregloFragmentos[i].appendChild(divTarea);
        });

    });

    //Se agregan los fragmentos a los contenedores de tareas
    contTareas.forEach((contDia, i) => contDia.appendChild(arregloFragmentos[i]));

}

//Se abre la base de datos y se agregan los eventos
window.addEventListener('DOMContentLoaded', () => {
    //Luego de iniciar la base de datos listar todas las tareas por medio de una función pasada como callback
    baseDatos.iniciarBaseDatos(function () {

        baseDatos.listarDatos(listarTareasDOM);

    });

    //Se agrega el evento para cerrar la ventana modal
    ventanaModal.addEventListener('click', (e) => {

        if (e.target.classList.contains('modal')) {
            ventanaModal.classList.toggle('modal-show');

            //Para que cuando se cierre la ventana modal se reinicie el formulario
            if (!ventanaModal.classList.contains('modal-show')) {
                formulario.reset();
            }
        }
    });


    //Se le agrega a los botones plus el evento para abrir la ventana modal
    btnplus.forEach(plus => {

        plus.addEventListener('click', () => {

            ventanaModal.classList.add('modal-show'); //Se le agrega las propiedades para abrir el modal del formulario

            console.log(plus.getAttribute('btn-dia'));

            btnDia = plus.getAttribute('btn-dia'); //Se almacena dia

            formulario.setAttribute('tipo-accion', 'insertar');

        });

    });
});


//Evento del formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault();


    const tarea = {
        titulo: inputTitulo.value,
        notas: textAreaNotas.value,
        dificultad: selectDificultad.value,
    }

    console.table(tarea);

    if (formulario.getAttribute('tipo-accion') == 'insertar') {

        //Almacenar la tarea en el indexedDB
        baseDatos.insertar(tarea, btnDia); //Le pasamos la tarea y el día en el que se almacenara la tarea

        //actualizar al dom con los nuevos datos
        baseDatos.listarDatosPorDia(btnDia, insertarTareaDom);


    } else if (formulario.getAttribute('tipo-accion') == 'actualizar') {

        //Nos traemos la llave del input hidden
        const key = parseInt(inputIDActu.value);
        //Nos traemos el día
        const dia = formulario.getAttribute('actu-dia');
        //Actualizamos en el indexedDB
        baseDatos.actualizar(tarea, key, dia);

        //Se modifican los campos del divTarea
        const tit = document.getElementById(dia.concat(key).concat('titulo'));
        tit.textContent = tarea.titulo;
        const not = document.getElementById(dia.concat(key).concat('notas'));
        not.textContent = tarea.notas;
        const dif = document.getElementById(dia.concat(key).concat('dificultad'));
        // dif.textContent = tarea.dificultad; //Esta línea eliminarla por la de abajo
        dif.innerHTML =  `${tarea.dificultad}`;
    }

    //Despues de hacer la inserción cerrar la ventana modal
    ventanaModal.classList.toggle('modal-show');



    formulario.reset();

});

function insertarTareaDom(dia, tareasDelDia) {

    const fragmentoDia = document.createDocumentFragment();

    //Este for llena el fragmento de las tareas del día
    tareasDelDia.forEach(tareasDia => {

        const divTarea = crearDiv(dia, tareasDia);

        fragmentoDia.appendChild(divTarea);
    })

    //se agrega al contenedor de tareas
    let contenedorDia;

    contTareas.forEach(contDia => {
        if (contDia.getAttribute('cont-tareas-dia') == dia) {

            contenedorDia = contDia;

        }
    });
    contenedorDia.innerHTML = '';
    contenedorDia.appendChild(fragmentoDia);

}

