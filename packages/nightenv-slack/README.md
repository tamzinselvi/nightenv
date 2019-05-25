# nightenv-iterm

An ITerm2 plugin for [nightenv](https://github.com/tomselvi/nightenv-iterm).

## Requirements

* node >= 6.11

## Installation & usage

Install this module globally alongside `nightenv`:

```
npm i -g nightenv-iterm
```

Then update your `~/.nightenv.json` by adding a new entry to your `configurations`:

```
{
  ...
  "configurations": {
    ...
    "nightenv-iterm": {
      "day": "Day",
      "night": "Night"
    },
    ...
  },
  ...
}
```

Where `day` is the ITerm2 profile you would like to use during the day, and `night` is the ITerm2 profile you would like to use at night.

Afterwards, run `nightenv-update --force` to generate an ITerm2 dynamic profile called `Nightenv` which you will need to set as your default.
