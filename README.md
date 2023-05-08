
# Guía de instalación

## [Instalación de Laravel](#instalación-de-laravel)

[Composer](#composer)

[Descargar Proyecto](#descargar-proyecto)

[Base de datos](#base-de-datos)

[Storage](#storage)

[Ejecución del servidor Laravel](#ejecución-del-servidor-laravel)


## [Instalación de Angular](#instalación-de-angular)

[Instalación](#instalación)

[Librerías](#librerías)

[Ejecución del servidor Angular](#ejecución-del-servidor-angular)]

## Instalación de Laravel

Verifica si tu equipo cumple con los requisitos mínimos para instalar
Laravel:

-   PHP versión 7.3 o superior

-   Extensión de PHP JSON

-   Extensión de PHP Ctype

-   Extensión de PHP Tokenizer

-   Extensión de PHP Mbstring

-   Extensión de PHP OpenSSL

-   Extensión de PHP PDO

-   Extensión de PHP BCMath

-   Extensión de PHP Fileinfo

### Composer

Instala Composer [Composer
(getcomposer.org)](https://getcomposer.org/download/) si no lo tienes
instalado en tu equipo.

### Descargar Proyecto

El siguiente paso es descargar nuestro proyecto del Github
[RubenLechosa/Gold-Rush-Fusion: Proyecto final DAW2
(github.com)](https://github.com/RubenLechosa/Gold-Rush-Fusion), una vez
descargado configuraremos el .env y la base de datos

### Base de datos

Abre el archivo .env en la raíz de tu proyecto de Laravel. Este archivo
contiene las variables de entorno para tu aplicación.

Busca las siguientes líneas en el archivo .env:

![](media/image1.emf)

Estas líneas configuran la conexión a la base de datos para tu
aplicación. Asegúrate de que la información sea correcta para tu sistema
de base de datos.

Si estás usando MySQL como tu sistema de base de datos, asegúrate de que
la extensión PHP **pdo_mysql** esté habilitada. Puedes verificar esto
ejecutando el siguiente comando en una terminal o línea de comandos:

![](media/image2.emf)

Si la extensión está habilitada, verás el resultado **pdo_mysql** en la
pantalla.

Crea una base de datos vacía en tu sistema de base de datos.

Ejecuta las migraciones de Laravel para crear las tablas necesarias en
tu base de datos. Ejecuta el siguiente comando en una terminal o línea
de comandos en la raíz de tu proyecto de Laravel:

![](media/image3.emf)

Esto creará la base de datos si no lo está, todas las tablas necesarias
y llenara la base de datos para hacer pruebas, todo en un solo comando.

### Storage

Para poder guardar todas las imágenes en el servidor debemos enlazar las
rutas, lo hacemos con el siguiente comando:

![](media/image4.emf)

### Ejecución del servidor Laravel

Una vez finalizada la instalación y configuración de la base de datos,
navega hasta la carpeta del proyecto de Laravel utilizando el siguiente
comando:

![](media/image5.emf)

Y para terminar de instalar las librearias de nuestro proyecto debemos
ejecutar el siguiente comando:

![](media/image6.emf)

Ejecuta el siguiente comando para iniciar el servidor de desarrollo:

![](media/image7.emf)

Esto iniciará el servidor de desarrollo de Laravel en el puerto 8000.
Ahora, puedes navegar a http://localhost:8000 en tu navegador para ver
la página de inicio de Laravel y comprobar que no hay ningún problema
con la instalación. Hay que destacar que no usaremos esta ruta ya que
tenemos el Frontend con Angular.

## Instalación de Angular

Asegúrate de tener instalado Node.js en tu sistema. Puedes descargar e
instalar Node.js desde su sitio web oficial: [Node.js
(nodejs.org)](https://nodejs.org/en)

### Instalación

Abre una terminal o línea de comandos y ejecuta el siguiente comando
para instalar Angular CLI de forma global:

![](media/image8.emf)

Este comando instalará la herramienta de línea de comandos de Angular
CLI que se utiliza para crear y gestionar proyectos de Angular.

Navega hasta la carpeta del proyecto de Angular utilizando el siguiente
comando:

![](media/image9.emf)

### Librerías

Debemos instalar todas las librerías que hemos utilizado y lo haremos
con el siguiente comando:

![](media/image10.emf)

### Ejecución del servidor Angular

Ejecuta el siguiente comando para iniciar el servidor de desarrollo de
Angular:

![](media/image11.emf)

Este comando iniciará el servidor de desarrollo de Angular en el puerto
4200. Ahora, puedes navegar a http://localhost:4200 en tu navegador para
ver la página de inicio de Angular.

Recordar que las dos carpetas (backend y frontend) deben estar juntas.
