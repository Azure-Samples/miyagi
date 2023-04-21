output "jumpbox" {
  value = {
    for key, vm in module.jumpbox : "jumpbox-${key}" => "ssh ${module.jumpbox[key].admin_username}@${module.jumpbox[key].public_ip}"
  }
}

output "aks" {
  value = {
    for k in module.aks[*] : "${module.aks[k]}.name" => module.aks[k]
  }
}