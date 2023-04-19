output "jumpbox" {
  value = {
    ssh = "ssh ${local.admin_username}@${module.jumpbox.public_ip}"
  }
}