console.log('%c Conectado...', 'color:red')
/***********************************************************/
/*    para usar imagenes primero tienes que importarlas    */
/***********************************************************/
import scss from './sass/style.scss'
import logo from './assets/img/boilerplate.png'

/***********************************************************/
/*               registramos el ServiceWorker              */
/***********************************************************/
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
        console.log('%c ServiceWorker registrado...', 'color:green')
    })
}

/***********************************************************/
/*             importamos archivos javascript              */
/***********************************************************/
import {saludo} from './js/app'
saludo()
