# Music App
Aplicación de Musica desarrollada con React.js y la Open API de Spotify

![img](https://user-images.githubusercontent.com/77751686/203214278-72bc3ccd-2bbf-4675-995c-fd544e4cb1f2.png)

## Requirements
Debes tener instalado en tu PC [Node.js](https://nodejs.org/en/) y [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable), además debes tener una cuenta en [Spotify for developers](https://developer.spotify.com/dashboard/)

### Spotify
A continuación en este [enlace](https://developer.spotify.com/documentation/web-api/) podrás conocer un poco más acerca de la API de Spotify y revusar las instrucciones necesarias para registrar una app y tomar las credenciales que vamos a necesitar más adelante

## Clone project
```
git clone https://github.com/LancerR40/ronald_abusaleh_full-stack.git
```

## Install dependencies
```
cd <project_name> && yarn
```

## Setup environment variables
En la raíz del proyecto crea un nuevo archivo llamado .env y pega todas las variables que verás en el archivo .env.example dentro del .env. Luego desdel el Dashboard de Spotify al crear y registrar una app tomaremos los valores de:
* Client ID
* Client Secret
* Redirect URIs
Luego de colocar las credenciales correctas nuestro proyecto estará listo para funcionar

## Run project
```
yarn start
```
