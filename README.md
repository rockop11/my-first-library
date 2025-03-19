# Creacion de Libreria npm

## creamos un proyecto con vite

```bash
    npm create vite
```

 - "nombre-del-proyecto" | en este caso `"my-first-library"`
 - Vanilla
 - Typescript
 - cd nombre-del-proyecto
 - npm install


## Instalaciones Complementarias

```bash
    npm i -D @types/node vite-plugin-dts
```

ts-node: *definiciones de Node.JS* 
vite-plugin-dts: *plugin de Vite que genera archivos de definiciones* (ayuda en tiempo de desarrollo)

## Borramos directorios
Se borran todas las carpetas y archivos que no van a ser tenidos en cuenta.
xEj: index.html | /public | styles.css | counter.ts | typescript.svg | etc.
 - como estamos creando una libreria de utilidades solamente vamos a necesitar crear un archivo index.ts.


## creamos el vite.config.ts
 - en este archivo agregamos las configs para que rollup buildee el proyecto.

 ```js
    import { resolve } from 'path'
    import { defineConfig } from 'vite'
    import dts from 'vite-plugin-dts'

    export default defineConfig({
        build: {
            lib: {
                entry: resolve(__dirname, ('src/index.ts')),
                name: 'my-first-library'
            }
        },
        plugins: [dts({ outDir: 'dist' })]
    })
 ```


## Modificamos el package.json
 - quitamos el `"private": true` ya que nuestra libreria se va a subir a npm. en el caso de que hagamos una libreria privada lo dejamos, pero hay que pagar...

 - agregamos los typings: `"typings": "./dist/index.d.ts"`. Rollup ira a buscar los archivos de definiciones a esa ruta.

 - declaramos la manera de como se va a importar nuestra librearia:
 ```json
 "exports": {
    ".": {
      "import": "./dist/my-first-library.js",
      "require": "./dist/my-first-library.umd.cjs"
    }
  },
 ```

 - exponemos todos los archivos que esten el directorio `/dist`
 ```json
 "files": [
    "dist"
  ],
 ```

 - agregamos el publishConfig para declarar donde se va a publicar nuestra libreria
 ```json
 "publishConfig": {
    "registry": "htts://registry.npmjs.org" //preguntar si aca va a el link de nuestra lib ya desplegado. o solamente el link de npm
  },
 ```

 ## Buildeamos la librearia
 ```bash
    npm run build
 ```

 - este script nos va a generar as carpetas `/dist` y sus correspondientes archivos dentro (el .js, el .umd.cjs, y el d.ts). 
