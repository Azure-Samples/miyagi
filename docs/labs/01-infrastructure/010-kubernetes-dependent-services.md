# Kubernetes Dependent Services

In this lab we will install/deploy the required cluster wide applications/services into our Kubernetes cluster. These services include:

- Ingress-Nginx
- Cert-Manager

## Retrieve your kubernetes credentials

```bash
# List your kubernetes clusters
az aks list -o table

# Example output
Name                   Location    ResourceGroup    KubernetesVersion    CurrentKubernetesVersion    ProvisioningState    Fqdn
---------------------  ----------  ---------------  -------------------  --------------------------  -------------------  ---------------------------------------------------
miyagi-xxxx-0-cluster  eastus      miyagi-xxxx      1.25.6               1.25.6                      Succeeded            miyagi-xxxx-0-cluster-xxxxxxxx.hcp.eastus.azmk8s.io

az aks get-credentials -n miyagi-xxxx-0-cluster -g miyagi-xxx
```

## Ingress-Nginx

In this section we will install [ingress-nginx](https://github.com/kubernetes/ingress-nginx) which will be used as our layer7 http/s proxy and help us direct web requests to the correct backend services (e.g. Miyagi Web UI).  From the repo root directory run the following commands:

```bash
# Add ingress-nginx helm repo
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# Update helm with new repo info
helm repo update

# Install ingress-nginx v.4.7.0
# Make sure you're in the repo root directory
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace --version 4.7.0 --values infrastructure/kubernetes/manifests/10-infrastructure/ingress-nginx/values.yaml
```

Next we will need to obtain the external IP address created for the cluster for future use:

```bash
kubectl get svc -n ingress-nginx

# Example output
NAME                                 TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   192.168.0.116   xx.xx.xx.xx   80:32724/TCP,443:32592/TCP   28s
ingress-nginx-controller-admission   ClusterIP      192.168.0.25    <none>        443/TCP                      28s
```

The value under ```EXTERNAL-IP``` is what we will need i.e. ```xx.xx.xx.xx```.  Please keep note of this value.

## Cert-Manager

Cert-Manager is a tool that helps us obtain SSL Certificates for our services.  This can be done for both services and ingress objects with a public IP address.  Later in this lab we will attempting to obtain an SSL Certificate for our cluster via [sslip.io](https://sslip.io) and our address will be in the form of ```xx.xx.xx.xx.sslip.ip```.  This helps to provide our service with some security in transit even in our demo environment.  For now we must install Cert-Manager which runs in our Kubernetes cluster as a cluster wide service and will help us obtain our SSL certificates from a Public Certificate Authority (LetsEncrypt in our case).

Please run the following commands to install Cert-Manager

```bash
# Add the jetstack helm repo (Jetstack maintains the cert-manager helm chart)
helm repo add jetstack https://charts.jetstack.io

# Update helm with the new repo info
helm repo update

# Install cert-manager
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.12.0 --set installCRDs=true
```

That's all for now until we deploy our services that have an ingress definition.  Please keep note of your IP address "```xx.xx.xx.xx```".
