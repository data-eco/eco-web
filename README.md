Eco Web UI
==========

Setup
-----

**Pre-requisites**

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

**Configuration**

1. Copy the example config directory to a new location on your system
2. Edit `config.yml` to point to the location where your data is stored
3. Add one or more project-specific config files to the `config/projects/`, using the
   provided example project config as a guide.
4. Add an environmental variable to your shell configuration to indicate the location of
   your configuratin, as well as the root data directory you wish to use, e.g.:

```
# ~/.zshenv
export ECO_CONF_DIR="/home/user/.config/eco"
export ECO_DATA_DIR="/data"
```

Future versions will not depend on there being a single root "data" directory; this is
just for testing/development.

Usage
-----

To build web UI containers and bring them up, run:

```
docker-compose up --build
```

And to bring them down:

```
docker-compose down
```

