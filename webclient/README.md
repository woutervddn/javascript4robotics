# Installation

use the following command to install de dependencies:


    npm install bootstrap-slider


After installing bootstrap-slider, move this directory to an accessiable directory in a webserver like apache.
for a clean installed ubuntu you can use the following method:

   sudo apt-get update                               # Update your package sources
   sudo apt-get install apache2                      # Install Apache
   sudo cp _YOURDIR_/webclient/* /var/www/html/      # Copy all files
   sudo chmod -R www-data:www-data /var/www/html/*   # Change permissions for all files

# Usage

Now visit the following url: `http://MY_APACHE_SERVER_URL/index.html`

Select the number of servos you use in your project & define the address of your robot as follow:

    http://MY_NODE_SERVER_URL:NODE_PORT/api/robots/robotArm

Submit the form.

If all goes correct, you should see the same amount of sliders as you defined. 
With all sliders showing the initial positions of your servo's.
