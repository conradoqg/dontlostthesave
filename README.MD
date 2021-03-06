# Don't Lost The Save
> Your essential utility tool to avoid the time lost when you die in the game and to accelerate your learning curve. It backups automatically the saves of the game, and provide detailed information about the Slots and Character being played. (for Windows only, for now...)

## Instalation

* Download the [Installer](https://s3-sa-east-1.amazonaws.com/releases.conradoqg.eti.br/dontlostthesave/dontlostthesaveSetup0.1.5.exe) (or the [Standalone](https://s3-sa-east-1.amazonaws.com/releases.conradoqg.eti.br/dontlostthesave/dontlostthesaveStandalone0.1.5.zip)) - `v0.1.5`;
* Follow the setup instructions;
* Start the app;
* Search the Don't Starve directory and select the place to save the backup;
* Enjoy ;)

## Features

* Automatic backup of the saves;
* Naming, so you can find your most valuable saves;
* Restore button to make your life easier;

![Screenshot](resources/screenshots/sampleData.png)

## Development

This app is made using:
* Node
* Electron
* React
* Gulp

### Installation

    $ git clone git@github.com:conradoqg/dontlostthesave.git
    $ npm install
    $ npm install -g gulp

### Running

    # Run the gulp default task (compile and watch)
    $ npm dev

    # Run the electron app
    $ npm start

#### Tasks

    $ gulp <task>

The important ones are:
* Default - Compile and watch the sources (to recompile when needed). After you modify the main .js file, you need to restart the app;
* Help - Details the avaliable tasks;
* Dist - Compiles, Builds, and generate the Dist version, containing the electron app and the installer. (Requires NSIS installed and in the PATH environment variable)

### Contribution

Looking for contributors to extend this app to Linux and MacOS.

#### Issues

When you find issues, please report them:

WEB: [https://github.com/conradoqg/dontlostthesave/issues](https://github.com/conradoqg/dontlostthesave/issues)


### Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work.

## License

Copyright (c) 2016-2016, Conrado Quilles Gomes. (MIT License)

See LICENSE for more info.
