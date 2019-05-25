# nightenv-osx

An OSX plugin for [nightenv](https://github.com/tomselvi/nightenv-iterm).  This plugin will automatically toggle Dark Mode, and optionally swap your desktop background.

## Requirements

* node >= 6.11
* OSX 10.10 (tested on 10.14)

## Installation & usage

Install this module globally alongside `nightenv`:

```
npm i -g nightenv-osx
```

Then update your `~/.nightenv.json` by adding a new entry to your `configurations`:

```
{
  ...
  "configurations": {
    ...
    "nightenv-osx": {
      "pictures": [
        ...
        {
          "day": "/absolute/path/to/day.png",
          "night": "/absolute/path/to/night.png"
        },
        ...
      ],
    },
    ...
  },
  ...
}
```

Where `pictures` is an array of objects where each index corresponds to a display, the first typically being your primary.  Each object contains `day`, an absolute path to the desktop background you would like during the day, and `night`, the absolute path to the desktop background you would like at night.  `pictures` can be omitted as a whole.
