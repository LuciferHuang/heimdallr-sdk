# @heimdallr-sdk/vite-plugin-sourcemap-upload

> Vite plug-in, upload sourcemap file

## Options

|Name|Type|Describe|Default|
|-|-|-|-|
|url|String|File upload url|-|
|appname|String|Application name (must be consistent with the application name when initializing the sdk)|-|
|errcode|String|Interface judgment basis field|code|
|errmsg|String|Interface error information field|msg|

## Usage

```js
import sourceMapUpload from "@heimdallr-sdk/vite-plugin-sourcemap-upload";

export default defineConfig({
  plugins: [vue(), sourceMapUpload({
    appname: 'playground',
    url: `http://localhost:8001/sourcemap/upload`
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: true
  }
})
```
