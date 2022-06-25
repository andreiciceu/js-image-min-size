# Min image size

Node script that ensures all images in a directory have at least 256 (or given) width/height in pixels. (Converts the ones smaller).

Use case: To easily upload a bunch of photos into Google Photos.

## Running

- `npm install`
- `node convert.js <FOLDER_PATH>` or `node convert.js <FOLDER_PATH> <MIN_SIZE>`

e.g.

```sh
node .\convert.js ../test 256
```
