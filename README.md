# b2share-dtap

_This document describes how to set up and use development environment for B2Share._


Requirements
------------

It is assumed that you are working in a Mac OS X environment.

* Brew, to install some of the other stuff: see [brew], if you haven't installed it yet.
* [Git](https://github.com/join) (`brew install git`).
* [Vagrant](https://www.vagrantup.com/) (`brew cask install vagrant`)
* [VirtualBox](https://www.virtualbox.org/wiki/Downloads): (Download link or `brew cask install virtualbox`.)
* The vagrant-vbguest plugin for vagrant: (`vagrant plugin install vagrant-vbguest`).
* Ansible (`brew install ansible` or `sudo pip install ansible==2.4.0.0`)
* [DANS-Bridge](https://github.com/DANS-KNAW/dataverse-bridge-service)


 Requirement            | Version
------------------------|------------------------------------------------------------------
Git                     | 2.20.1
Vagrant                 | 2.2.3
Ansible                 | 2.7.5
VirtualBox              | 5.2.22


### Steps

1. Clone this project:

        git clone https://github.com/ekoi/b2share-dtap.git

2. Create a static host name for the local VMs in your `/etc/hosts` file. Make sure
   the following lines are present:

	    192.168.33.11   devb2share.dans.knaw.nl

3. Go to the `b2share-dtap` project directory:
   
              cd b2share-dtap
 
4. Edit the `provisioning/host_vars/devb2share.yml` file
                
              b2access_consumer_key=REPLACE_WITH_YOUR_OWN_KEY
              b2access_secret_key=REPLACE_WITH_YOUR_OWN_SECRET
              b2share_jsonschemas_host=your-chosen-domain-name:5000
              b2share_jsonschemas_port=bridge-url:port/api/v1
              bridge_ip_address=REPLACE_WITH_YOUR_BRIDGE_IP_ADDRESS
              bridge_port=REPLACE_WITH_YOUR_BRIDGE_PORT
              bridge_apikey=REPLACE_WITH_YOUR_BRIDGE_APIKEY
              bridge_dar_username=REPLACE_WITH_YOUR_DAR_USERNAME
              bridge_dar_password=REPLACE_WITH_YOUR_DAR_PASSWORD
              
5. Clone and install [DANS Bridge](https://github.com/DANS-KNAW/dataverse-bridge-service)    
      	   