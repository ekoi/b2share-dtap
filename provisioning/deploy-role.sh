#!/usr/bin/env bash

function print_usage() {
    echo "Usage: ./deploy-role.sh [help] <roles> [<server> [<remote-user> [<vars>]]]"
    echo
    echo "OPTIONS:"
    echo "    help: print this help"
    echo "    roles: the roles to deploy; comma-separated if multiple need to be deployed"
    echo "    server: the server to deploy to (default: deasy)"
    echo "    remote-user: the remote user to perform the Ansible tasks with (default: vagrant)"
    echo "    vars: extra variables to pass to Ansible. See Ansible's -e option (default: '')"
}

if [[ "$#" == "0" ]]; then
  print_usage
  exit
fi

if [[ "$1" == "help" ]]; then
  print_usage
  exit
fi

# allow for multiple roles in comma separated list
for role in $(echo ${1:-""} | tr "," "\n")
do
    ROLES="$ROLES
        - $(basename $role)"
done

SERVER=${2:-"devb2share"}
REMOTE_USER=${3:-"vagrant"}
VARS=${4:-""}

if [[ "$SERVER" == "devb2share" ]] ; then
    PRIVATE_KEY="./.vagrant/machines/devb2share/virtualbox/private_key"
    ASK_PASS=""
else
    PRIVATE_KEY="~/.ssh/id_rsa"
    ASK_PASS="--ask-become-pass --ask-pass"
fi

if ([[ "$SERVER" == "tdvn" ]] || [[ "$SERVER" == "advn" ]] || [[ "$SERVER" == "dvn" ]] || [[ "$SERVER" == "ddevb2share" ]]); then
    ASK_VAULT_PASS="--ask-vault-pass"
    PASSWORDS="-e @$HOME/git/ansible-vault/dataverse/dataverse_passwords.yml"
else
    ASK_VAULT_PASS=""
fi

if [[ "$VARS" != "" ]] ; then
    VARS="-e @$VARS"
fi

echo "
    - hosts: $SERVER
      become: yes
      vars:
        maven_use_local_cache: yes
      roles:$ROLES
" > provisioning/tmp.yml


ansible-playbook provisioning/tmp.yml \
  -i provisioning/hosts \
  --private-key $PRIVATE_KEY \
  -u $REMOTE_USER \
  $ASK_PASS \
  $ASK_VAULT_PASS \
  --limit $SERVER \
  $PASSWORDS \
  $VARS

rm provisioning/tmp.yml





