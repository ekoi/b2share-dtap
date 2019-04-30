# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define "devb2share" do |devb2share|
      devb2share.vm.box = "geerlingguy/centos7"
      devb2share.vm.hostname = "devb2share"
      devb2share.vm.network :private_network, ip: "192.168.33.11"
      devb2share.vm.provision "ansible" do |ansible|
        ansible.playbook = "provisioning/sites.yml"
        ansible.inventory_path = "provisioning/hosts"
      end
      devb2share.vm.provider "virtualbox" do |v|
        v.memory = 2048
        v.cpus = 2
      end
  end
end
