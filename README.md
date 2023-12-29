# Fetchuruza

### Install

```
npm i @arskang/fetchuruza
// o
yarn add @arskang/fetchuruza
```

### How to use?

```javascript
const Fetchuruza = require('@arskang/fetchuruza');
// o
import Fetchuruza from '@arskang/fetchuruza';
```

```javascript
const fetchu = new Fetchuruza();
```

### Methods

- 

### Cancel request

```javascript
(async () => {
    fetchu.setCancelToken(); // You need generate te signal before the request
    const resp = await fetchu.getJson({
        url: 'https://www.demo.com',
        params: {
            // you may send query params in an object
            limit: 1000,
            page: 1,
            // Final url:
            // https://www.demo.com?limit=1000&page=1
        }
    })
})()

setTimeout(() => {
    fetchu.cancel();
}, 2000);
```