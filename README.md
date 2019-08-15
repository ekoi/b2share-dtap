# b2share-dtap

_This document describes how to set up and use development environment for B2Share._


Requirements
------------

It is assumed that you are working in a Mac OS X environment.

* Brew, to install some of the other stuff: see [brew], if you haven't installed it yet.
* [Git](https://github.com/join) (`brew install git`).
* [Vagrant] (`brew cask install vagrant`)
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
 
4. Edit the `provisioning/roles/b2share-setup/files/b2share_devenvrc` file
                
              export B2ACCESS_CONSUMER_KEY='REPLACE_WITH_YOUR_OWN_KEY'
              export B2ACCESS_SECRET_KEY='REPLACE_WITH_YOUR_OWN_SECRET'
              export B2SHARE_SECRET_KEY='SECRET-KEY'
              
              export B2SHARE_JSONSCHEMAS_HOST=your-chosen-domain-name:5000   
              
              export BRIDGE_URL=bridge-url:port/api/v1
              export BRIDGE_APIKEY=REPLACE_WITH_YOUR_BRIDGE_APIKEY
              export BRIDGE_DAR_USERNAME=REPLACE_WITH_YOUR_DAR_USERNAME
              export BRIDGE_DAR_PASSWORD=REPLACE_WITH_YOUR_DAR_PASSWORD
              
5. Edit the `provisioning/roles/b2share-setup/templates/b2share.service` file  

              Environment="B2ACCESS_CONSUMER_KEY=REPLACE_WITH_YOUR_OWN_KEY"
              Environment="B2ACCESS_SECRET_KEY=REPLACE_WITH_YOUR_OWN_SECRET"
              Environment="B2SHARE_SECRET_KEY=SECRET-KEY"
              
              Environment="B2SHARE_JSONSCHEMAS_HOST=your-chosen-domain-name:5000"   
              
              Environment="BRIDGE_URL=bridge-url:port/api/v1"
              Environment="BRIDGE_APIKEY=EPLACE_WITH_YOUR_BRIDGE_APIKEY"
              Environment="BRIDGE_DAR_USERNAME=REPLACE_WITH_YOUR_DAR_USERNAME"
              Environment="BRIDGE_DAR_PASSWORD=REPLACE_WITH_YOUR_DAR_PASSWORD"               	   