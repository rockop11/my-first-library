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
    "registry": "htts://registry.npmjs.org"
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

- agregamos los scripts de ESLint al package.json
 ```json
    "lint": "eslint . --ext .ts --ignore-pattern dist/",
    "lint:fix": "npm run lint --fix",
 ```

 - Desde la version 9.x.x se recomienda que el archivo de configuracion de eslint se llame `eslint.condig.ts`
 
 ```javascript
    import { defineConfig } from "eslint/config";

    export default defineConfig([
	    {
		    languageOptions: {
			    parserOptions: {
				    ecmaVersion: "latest",
				    sourceType: "module",
			    },
		    },
		    files: ["**/*.ts"],
		    rules: {
			    semi: "error",
			    "prefer-const": "error",
			    "no-var": "error",
		    },
	    },
    ]);
 ```


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
 - pusheamos a una branch feature
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
    npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
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


# Unit Testing | Pruebas Unitarias
Las pruebas unitarias son tests automatizados que verifican el funcionamiento de unidades individuales de código (como funciones o métodos) de manera aislada. Su objetivo es asegurar que cada componente funcione correctamente por sí solo.

- en este caso vamos a usar [vitest](https://vitest.dev/).
```bash
    npm i -D vitest
```

- creamos los scripts en el package.json para poder ejecutar los tests:
```json
    "test": "vitest run --coverage",
    "test:watch": "vitest --watch", 
```

- en el caso de no tener instalado `@vitest/coverage-v8`, la terminal va a solicitar instalarlo apretando "Y" en la terminal.
- con respecto a la estructura de carpetas, en lo personal voy a usar una carpeta `/__test__` por modulos. ya que con esto tendriamos funcionalidad y tests en la misma jerarquia.
- al ejecutar `npm run test`, este script nos va a generar un directorio llamado `coverage`, el que debemos agregar al `.gitignore`
- dentro de esa carpeta coverage que se genera, hay un archivo `index.html` el cual contiene el "coverage de los test." se puede hacer doble click en el archivo y este va a abrir "una pagina con los test y su coverage"

### config adicional para los test unitarios.
- creamos un archivo `vitest.config.ts` en la raiz del proyecto.

```javascript
    import { defineConfig, mergeConfig } from 'vitest/config'

    import viteConfig from './vite.config'

    export default mergeConfig(
        viteConfig, 
        defineConfig({
            test: {
                globals: true
            },
        })
    )
```

- para poder tener los global imports de la librearia de vitest, podemos agregar en el `tsconfig.ts` la siguiente linea:
```json
    "types": ["vitest/globals"]
```


# Github Actions
 - es un sistema de automatizaciones que permite ejecutar flujos de trabajos (pipelines), en respeusta a eventos, dentro de un repositorio, a traves de archivos de configuracion.

 - en este caso vamos a usar dependabot (bot de dependencias).

 1) creamos una carpeta oculta `.github`. (este nombre lo necesita github para chequear justamente los archivos dentro de esa carpeta.) 
 2) dentro de la carpeta .github, creamos un archivo llamado `dependabot.yml`
 3) agergamos esto dentro del archivo.
 
 ```yaml
# dependabot.yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: /
    schedule:
      interval: "weekly"
```

4) entramos a github, y vamos al repo.
 - vamos al apartado de *Security*
 - habilitamos Dependabot alerts y Dependabot security updates.
5) Dependabot nos va a generar un PR con las dependencias que deberiamos actualizar.