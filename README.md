# LauzHack-22

Project name: **sustAInability**

Please refer to our [DevPost](https://devpost.com/software/sustainabilitiy) page for more information.

You may also watch [our demo video](https://youtu.be/JNPiUXHRBic).

## Ownership

Excluding some images, all the source code is our own work.

## Development

### Backend

Directory `backend`.

Runs on Python 3 with a pip installation.

You need to have the environment variable `DIFKEY` defined.

Then run the following commands:

```
pip install -r requirements.txt
python3 server.py
```

The backend will start on: [http://0.0.0.0:8080](http://0.0.0.0:8080)

### Frontend

Directory `frontend`.

Recommended Node.js version 18 and npm version 8.

First make sure to set the following environment variable in `.env`:

```
REACT_APP_BACKEND_ENDPOINT=http://0.0.0.0:8080
```

Then, setup and start the development server with:

```
npm install
npm start
```

The development server can be reached at the following URL: [http://localhost:3000/](http://localhost:3000/)
