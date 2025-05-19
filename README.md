# Crunch App - Gestor de Tareas y Productividad (TO-DO) 
Crunch App es un prototipo de aplicación móvil construido con **Expo + React Native**. Permite crear, organizar, y dar seguimiento a tareas y medir la productividad. Este README documenta los pasos necesarios para clonar, instalar y ejecutar el proyecto.

>**Materia:** Diseño y Evaluación de Interfaces de Usuario 6°F

>**Institución:** Facultad de Telemática, Universidad de Colima

## Dependencias principales
Estas son las librerías y frameworks clave utilizados en este proyecto:

### Core React Native + Expo
| Paquete | Versión | Descripción |
|---------|---------|-------------|
| **expo** | `~53.0.7` | Framework base multiplataforma |
| **react‑native** | `0.79.2` | Motor UI nativo |
| **react** | `19.0.0` | Biblioteca de UI declarativa |
| **expo‑router** | `~5.0.5` | Enrutador estilo Next.js |
| **react‑native‑paper** | `^5.14.1` | UI Material Design |

### Navegación
- `@react-navigation/native` `^7.1.6`  
- `@react-navigation/drawer` `^7.3.11`  
- `@react-navigation/bottom-tabs` `^7.3.10`  
- `@react-navigation/elements` `^2.3.8`

### Funcionalidad adicional
- `@react-native-async-storage/async-storage` `2.1.2` – Storage local  
- `@react-native-community/datetimepicker` `^8.3.0` – Picker nativo  
- `react-native-toast-message` `^2.3.0` – Toasts  
- `moti` `^0.30.0` – Animaciones declarativas  
- `date-fns` `^4.1.0` – Utilidades de fecha  

### Interfaz y UI
- `@react-native-material/core` `^1.3.7`  
- `@expo/vector-icons` `^14.1.0`  
- `react-native-color-picker`, `react-native-wheel-color-picker`  
- `expo-haptics`, `expo-av`, `expo-image`, `expo-blur`, `expo-font`, `expo-status-bar`, etc.  

### 🧪 Desarrollo y herramientas
`eslint`, `eslint-config-expo`, `typescript`, `@babel/core`, `@types/react`

---
## 🛠️ Instrucciones de instalación

### 1. Clonar el repositorio

``` bash
git clone https://github.com/WhiteBryz/to-do-app
cd to-do-app
```

### 2. Intalar dependencias
``` bash
npm install
```

Requisito: Node.js 18.x y Expo CLI
``` bash
npm install -g expo-cli
```
### 3. Ejecutar en modo desarrollo
``` bash
npx expo start
```
## ▶️ Cómo ejecutar la aplicación

Al ejecutar `npm start` **o** `npx expo start` se abrirá en tu navegador el panel **Expo Dev Tools**.  
Desde ahí puedes lanzar la app de tres maneras:

### 1. Dispositivo físico (Android) — **opción recomendada**
1. Descarga **Expo Go** desde Google Play → [Enlace para descargar Expo Go en GooglePlay](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=es_MX&pli=1)
2. Abre Expo Go y **escanea el código QR** que aparece en Expo Dev Tools.  
> La forma más rápida de probar en hardware real.

---

### 2. Navegador (Web)
- En la consola de Metro presiona la tecla **`w`** o haz clic en **_Run in web browser_**.  
> Ideal para una vista rápida; recuerda que ciertas APIs nativas (notificaciones, sensores, etc.) pueden no estar disponibles.

---

### 3. Emulador Android (Windows)
1. Instala **Android Studio** → [Enlace hacia la página oficial de Android Studio](https://developer.android.com/studio?hl=es-419)
2. Abre **Device Manager** y **crea un AVD** con una imagen de Android (API 34 recomendada).  
3. Asegúrate de que el emulador esté encendido.  
4. En tu terminal del proyecto ejecuta:  
```bash
   npm start
```

**Requisito importante:** Asegúrate de tener configuradas las variables de entorno:
`ANDROID_HOME= Ruta a tu .../Android/Sdk`
`PATH += %ANDROID_HOME%\emulator`
`PATH += %ANDROID_HOME%\platform-tools`

**Guía oficial** Expo + AVD: [Guía oficial para instalar emulador de Android Studio + Expo](https://docs.expo.dev/workflow/android-studio-emulator/)

---

### 4. Instalar la APK directamente (Android)

Otra opción **altamente recomendada** es instalar la app directamente desde un archivo `.apk` generado con EAS Build.

📲 Puedes descargarla desde el siguiente enlace:  
🔗 [Descargar APK de la app (build Expo)](https://expo.dev/accounts/yaelperalta_1/projects/to-do-app/builds/52866814-646c-4f1e-8b6c-76b90fb83373)

> Al hacer clic en el botón **Install**, se descargará la APK en tu dispositivo.  
> Solo necesitas abrirla para instalarla (puede pedirte habilitar la instalación desde fuentes desconocidas).

