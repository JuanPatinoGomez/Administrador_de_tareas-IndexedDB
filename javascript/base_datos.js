class BaseDatos{

    constructor(){
        this.indexedDB = window.indexedDB;
        this.db;
    }


    iniciarBaseDatos(callback){

        const request = this.indexedDB.open('SEMANA', 1); //Solicitud de abrir la base de datos


        request.onupgradeneeded = () => {

            this.db = request.result;

            const objectStore1 = this.db.createObjectStore('lunes' , {autoIncrement: true});
            const objectStore2 = this.db.createObjectStore('martes' , {autoIncrement: true});
            const objectStore3 = this.db.createObjectStore('miercoles' , {autoIncrement: true});
            const objectStore4 = this.db.createObjectStore('jueves' , {autoIncrement: true});
            const objectStore5 = this.db.createObjectStore('viernes' , {autoIncrement: true});
            const objectStore6 = this.db.createObjectStore('sabado' , {autoIncrement: true});
            const objectStore7 = this.db.createObjectStore('domingo' , {autoIncrement: true});

            console.log('BASE DE DATOS CREADA');

        }

        request.onsuccess = () => {
            
            this.db = request.result;

            console.log('BASE DE DATOS ABIERTA');

            callback(); //Se ejecuta la función callback que es la que listara los datos
        }

        request.onerror = () =>{
            console.log('Ha ocurrido un error');
        } 
    }

    insertar(data, dia){

        //Creamos las transaccion
        const transaction = this.db.transaction([dia], 'readwrite');
        //Creamos un almacen de datos en la transacción
        const objectStore = transaction.objectStore(dia);

        const request = objectStore.add(data); //En ese almacenamiento insertamos

        console.log('SE HA INSERTADO UN DATO EN EL DÍA', dia);
    }

    actualizar(data, key, dia){

        const transaction = this.db.transaction([dia], 'readwrite');

        const objectStore = transaction.objectStore(dia);

        const request = objectStore.put(data, key);

        console.log('SE HA ACTULIZADO UN DATO EN EL DÍA', dia);
    }

    eliminar(key, dia){
        
        const transaction = this.db.transaction([dia], 'readwrite');

        const objectStore = transaction.objectStore(dia);

        const request = objectStore.delete(key);
    }

    listarDatos(callback){

        const semana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

        const objecSemana = {
            lunes: [],
            martes: [],
            miercoles: [],
            jueves: [],
            viernes: [],
            sabado: [],
            domingo: []
        }

        semana.forEach((dia, i) => {
            const transaction = this.db.transaction([dia], 'readonly');
            const objectStore = transaction.objectStore(dia);

            const request = objectStore.openCursor();

            request.onsuccess = (e) => {

                const cursor = e.target.result;

                if(cursor){

                    objecSemana[dia].push({key: cursor.key, value: cursor.value});

                    cursor.continue();

                }else{

                    console.log('SE HAN LISTADO TODOS LOS ELEMENTOS DEL DIA' , dia, i);

                    //No sé pq pero cuando se termina de listar el ultimo es el lunes
                    //Por eso la posición 0
                    if(i == 0){
                        callback(objecSemana);
                    }
                }
            }

        });
        
    }

    //Tal vez no sea necesario
    listarDatosPorDia(dia , callback){
        
        const tareasDelDia = [];
        const transaction = this.db.transaction([dia], 'readonly');
        const objectStore = transaction.objectStore(dia);

        const request = objectStore.openCursor();

        request.onsuccess = (e) => {
            
            const cursor = e.target.result;

            if(cursor){

                tareasDelDia.push({key: cursor.key, value: cursor.value});

                cursor.continue();
            }else{

                console.log('SE LISTARON LOS ELEMENTOS DEL DÍA' , dia);

                //Se ejecuta la función para imprimir las tareas del día
                callback(dia, tareasDelDia);
            }
        }
    }
}