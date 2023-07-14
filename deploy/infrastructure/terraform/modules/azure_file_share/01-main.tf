locals {
    account_name = substr(replace(var.account_name, "-", ""), 0, 22)
}