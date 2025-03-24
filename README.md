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

- ts-node: *definiciones de Node.JS* 
- vite-plugin-dts: *plugin de Vite que genera archivos de definiciones* (ayuda en tiempo de desarrollo)

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



# Versionado Semantico:
```json
    "version": "0.0.0" // Major.Minor.Patch
```

el versionado de nuestro package json va a informar las actualizaciones que tiene nuestra libreria.
- el primer numero, es la version `major`: esta se va aumentando a medida que hagamos cambios que puedan llegar a romper el flujo existente *(Breaking changes)*.
- el segundo numero, es la version `minor`: esta se modifica cuando agregamos nueva funcionalidad sin romper compatibilidad. (features)
- el tercero, es la version `patch`: correcciones de errores, o mejoras menores que no afectan la compatibilidad. (estilos css, o cambios que no sean urgentes.)


## Configuracion ESLint
 `ESLint` es una herramienta para analizar y corregir errores en código JavaScript y TypeScript. Ayuda a mantener buenas prácticas, asegurando un código limpio y consistente mediante reglas configurables.

```bash
    npm init @eslint/config
```
 - check sintaxys and find problems
 - JavaScript Modules
 - None of these
 - Typescript
 - Browser
 - install required dependencies / npm

 //estas opciones son solamente para crear una librearia de terceros.


 ### Import Aliases
  - Los import aliases nos van a permitir porder ingresar a diferentes directorios sin necesidad de agregar "../../../" para salir o entrar a diferentes carpetas. con esto, logramos entrar a los directorios directamente. xEj: (@src/file-name, @components/file-name, @services/file-name).

 ```bash
    npm i -D vite-tsconfig-paths
 ```

primero agregamos la propiedad resolve dentro de nuestro `vite.config.ts`

```javascript
    resolve: {
        alias: {
            '@src': resolve(__dirname, '/src')
        }
    }
```

y luego, agregamos los paths en nuestro `tsconfig.ts`

```json
    "paths": {
      "@src/*": ["./src/*"]
    },
```


# Husky
[Husky](https://github.com/typicode/husky#readme)
es una herramienta para gestionar git hooks de manera sencilla en proyectos JavaScript/TypeScript, permitiendo ejecutar scripts antes de commits o pushes para mejorar la calidad del código.

### Version simple:
 - implementamos una feature
 - cambiamos la version del package.json
 - corremos test y eslint
 - hacemos la build manual / automatica
 - publicamos en npm, yarn, etc.

 ### Version Pro: 
 - implementamos una feature
 - cambiamos la version del package.json
 - corremos test y eslint
 - pusheamos a una bracnh feature
 - review del PR / MR
 - merge a rama estable
 - GITHUB Action para hacer test, build, y publish en npm.

 para poder inicializar husky, es fundamental tener subido nuestro codigo a github. (o cualquier versionador).

 ```bash
    npx husky-init && npm i
 ```

 Esto nos va a crear una carpeta oculta `.husky` con un archivo dentro de ese directorio, llamado pre-commit .(sin extension, porq por defecto es un archivo bash, que ejecuta un script.). Dentro de ese archivo pre-commit veremos el script `npm test`. si no tenes un script de test en el package.json, esto te dara error. por lo tanto se debe modificar. Para una simple prueba, puedes modificar el script npm test por `npm run lint`

 ### para crear distintos tipos de scripts en husky:
 - npx husky add .husky/file-name "script"

 ```bash
    npx husky add .husky/pre-push "npm run build"
 ```

 - script para agregar el commit lint con husky

 ```bash
    npx husky add .husky/commit-msg 'npx --no -- commitlint -- edit ${1}'
 ```

# Conventional Commits
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
esta herramienta nos permite redactar commits con ciertas reglas semanticas. (esto se ejecuta en el pre-commit de husky). Esta libreria nos pide que: los commits sean en minuscula, que sean concisos los mensajes (mensajes cortos).

[commit lint](https://commitlint.js.org/guides/getting-started.html)

```bash
    npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

ejecutamos este otro script para crear el archivo de configuracion de commit lint

```bash
    echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

- formato de commit: 
 `<type>[optional scope]: <description>`

`git commit -m "chore: add commitlint"` 