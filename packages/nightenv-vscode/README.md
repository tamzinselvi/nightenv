# nightenv-vscode

A VSCode plugin for [nightenv](https://github.com/tomselvi/nightenv-iterm).

## Requirements

* node >= 6.11

## Installation & usage

Install this module globally alongside `nightenv`:

```
npm i -g nightenv-vscode
```

Then update your `~/.nightenv.json` by adding a new entry to your `configurations`:

```
{
  ...
  "configurations": {
    ...
    "nightenv-vscode": {
      "day": "Themer Light",
      "night": "Themer Dark"
    },
    ...
  },
  ...
}
```

Where `day` is the VSCode theme you want enabled during day, and `night` is the VSCode theme you want enabled at night.
