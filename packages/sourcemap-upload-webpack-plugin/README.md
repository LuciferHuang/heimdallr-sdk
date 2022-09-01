## Usage

```js
import UploadSourceMapPlugin from "@heimdallr-sdk/sourcemap-upload-webpack-plugin";

config.plugins = [
    new UploadSourceMapPlugin({
        folder: '__test__',
        url: `http://localhost:8888/uploadFile`
    })
]
```
