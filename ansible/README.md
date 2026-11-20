# Server configuration (Ansible)

The VPS that runs this frontend and the [backend](https://github.com/skociuba/backend-boilerplate),
described as code. GitHub Actions deploys the applications (images, `docker-compose`, scripts);
this playbook sets up what they run on.

| Role      | What it manages                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------ |
| `base`    | Docker and Compose v2, daemon defaults (log limits, live-restore), app directories               |
| `certbot` | certbot and its nginx plugin; checks that the Let's Encrypt certificate exists                   |
| `nginx`   | the shared site config (VPS1, VPS2, VPS3 on one server), validated before reload                 |
| `backup`  | `age` and `rclone`, `/etc/vps2-backup` (B2 credentials from the vault), daily cron, log rotation |

Not managed here: application `.env` files (created by hand on the server) and the other projects
that share the server (VPS1, VPS3).

## Running it

Requirements: Ansible on your machine (`sudo apt install ansible-core`) and SSH access to the
server as in [inventory/production.yml](inventory/production.yml).

```sh
cd ansible
ansible-playbook site.yml --check          # dry run: shows the diff, changes nothing
ansible-playbook site.yml                  # apply
ansible-playbook site.yml --tags nginx     # one role only
```

Always run `--check` first. Every run prints a diff of the files it would change
(`[diff] always` in [ansible.cfg](ansible.cfg)), so an unexpected change is visible before it
happens. A broken nginx config never gets loaded: the role runs `nginx -t` and restores the
previous file if the test fails.

## Secrets (ansible-vault)

The B2 credentials live in `group_vars/vps2/vault.yml`, encrypted with ansible-vault, so the file
can be committed. The format is in [vault.yml.example](group_vars/vps2/vault.yml.example).

```sh
ansible-vault create group_vars/vps2/vault.yml    # first time
ansible-vault edit group_vars/vps2/vault.yml      # later
ansible-playbook site.yml --ask-vault-pass        # runs that need the vault
```

Keep the vault password in a password manager. Without `vault.yml` the playbook leaves
`/etc/vps2-backup/rclone.conf` alone and only checks that it exists.

## New server

1. Point the DuckDNS domain at the new IP and update `inventory/production.yml` and
   `vps2_server_ip` in [group_vars/vps2/main.yml](group_vars/vps2/main.yml).
2. Issue the certificate once: `certbot certonly --standalone -d skociuba-vps2.duckdns.org`
   (before nginx is configured, so port 80 is free).
3. `ansible-playbook site.yml --ask-vault-pass`.
4. Create the `.env` files in `/var/www/backend-node` (see `.env.example` in the backend repo)
   and restore the database from the latest B2 backup (`scripts/backup-db.sh` in the backend
   repo has the restore steps).
5. Run "Deploy Backend" and "Deploy Frontend" from GitHub Actions with the current versions.
