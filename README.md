## WebStreams with PureScript

This is the demo app from my <a href="http://blog.brakmic.com/using-web-streams-with-purescript/">article on WebStreams with PureScript</a>.

### Installation & Building

Install all packages first.

```shell
pulp dep install
npm i
```

Then build backend (foreign imports etc.) with

```shell
gulp
```

And the frontend (client demo in browser console) with

```shell
gulp build-demo
```

### Usage

Run the demo with HapiJS via `npm start` and open your browser at http://localhost:8080

Open your browser's console to see the stream data flowing in.

<img src="http://fs5.directupload.net/images/160126/t3fefcfm.png">

### License

<a href="https://github.com/brakmic/WebStreams-with-PureScript/blob/master/LICENSE">MIT</a>