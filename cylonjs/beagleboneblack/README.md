# Cylon.js

## Requirements
- Have Node.js installed on either a Raspberry Pi, Arduino Yun or a PC with an Arduino connected to it.
- Have npm installed

### Ubuntu requirements
Following extra requirements where necessary to get this code running on Ubuntu. We're not sure if these applications are necessary on other Operating Systems.

We installed following application in order to get **cylon-firmata**'s **serialport** running:
- build-essential
- nodejs legacy

Install both of these on Ubuntu using the following command:

    sudo apt-get install build-essential nodejs-legacy


## Installation
For now the whole project is fairly vanilla, installing the required modules is as simple as running `npm install` from inside the `/src/` directory.

## Running the code
You can run our code by launching your node.js server. Do this by running either:

    node /folderPath/bin/app.js

or running:

    nodejs /folderPath/bin/app.js


**Whether your computer uses the `node` or `nodejs`command depends on your operating system.**

## Project To Do

- Run on different target "robots"
- Use different JS Libraries
- Use different platforms

## Action list

- Easing function
- Degrees to val (-180 > +180 degrees to 0 > 255 val)
- Universal actuate servo control
- Universal set(+actuate) servo control
