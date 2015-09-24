# About this Repo
This repo is the codebase for the **Javascript4Robotics** project. **Javascript3Robotics** is a subproject that is part of the **Engineering Project** from **PXL University College** department **Tech**.

# Requirements
- Have Node.js installed on either a Raspberry Pi, Arduino Yun or a PC with an Arduino connected to it.
- Have npm installed

## Ubuntu requirements
Following extra requirements where necessary to get this code running on Ubuntu. We're not sure if these applications are necessary on other Operating Systems.

We installed following application in order to get **cylon-firmata**'s **serialport** running:
- build-essential
- node legacy

Install both of these on Ubuntu using the following command:

    sudo apt-get install build-essential node-legacy


# Installation
For now the whole project is fairly vanilla, installing the required modules is as simple as running `npm install` from inside the `/src/` directory.

# Running the code
You can run our code by launching your node.js server. Do this by running either:

    node /folderPath/src/app.js

or running:

    nodejs /folderPath/src/app.js


**Whether your computer uses the `node` or `nodejs`command depends on your operating system.**


# Other JS4R libraries
There are other libraries than cylon.js. We might end up using more than one of them. Some possibilities are:

- [NodeBots](http://nodebots.io/)
- [Johny Five](http://johnny-five.io/)



# Other crazy projects
- [A bull fighting javascript quad copter](https://github.com/substack/matador-copter)