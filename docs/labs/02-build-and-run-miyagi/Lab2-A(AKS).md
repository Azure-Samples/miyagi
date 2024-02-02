# Lab 2.1: Containerizing Miyagi UI and Recommendation service to Azure Kubernetes Service(AKS)

In this lab, you'll be building the docker images and publishing them to Azure Kubernetes Service(AKS).

### Task 1: Deploy AKS Services
1. Navigate back to the Visual studio code window and navigate to **miyagi/deploy/infrastructure/kubernetes/50-miyagi** right click on 50-miyagi in cascading menu, select Open in integrate Terminal

2. Run the following command to log in to the Azure portal.
   ```
   az aks get-credentials -n [ClusterName] -g [ResourceGroupName]
   ```

3. Once the command finishes you should now have access to the cluster and can run the following commands to deploy the application services.
   ```
    kubectl apply -f ./miyagi-recommendation-service.yaml
   ```
   ```
    kubectl apply -f ./miyagi-ui-service.yaml
   ```

4. Once the services have been deployed run the below command and keep track of the service's external ip's. It could take a few minutes for the external ip's to appear so wait a few minutes before running the command.
   ```
    kubectl get svc
   ```
    ![](./Media/serviceips.png)

5. Next navigate to **miyagi/services/recommendation-service/dotnet** and open app settings.
   
6. Copy the miyagi-ui IP address from the console and paste it in the CorsAllowedOrigins section formatted as an http endpoint.  
![](./Media/ui-cors.png)

1. Next navigate to **miyagi/ui** and open the .env file.

2. Copy the miyagi-recommendation-service IP address from the console and paste it in the NEXT_PUBLIC_RECCOMMENDATION_SERVICE_URL value.
![](./Media/ui-service-value.png)

### Task 2: Build a Docker Image for the Miyagi UI
1. Open the **Docker** Application from the Lab VM desktop by double-clicking on it.

   ![](./Media/docker1.png)
   
2. In the **Docker Subscription Service Agreement** window, click **Accept**.

   ![](./Media/docker2.png)

3. In the **Welcome to Docker Desktop** window, click on **Continue without signing in**.

   ![](./Media/without-signin.png)

4. In the **Tell us about the work you do** window, click on **Skip**.
   
5. Navigate back to **Visual studio code** window and navigate to **miyagi/ui/typescript** right - click on dotnet in cascading menu, select **Open in integrate Terminal**.

   ```
   docker build . -t miyagi-ui      
   ```

   > **Note**: Please wait as this command may require some time to complete.

6. Run the following command to get the newly created image.

   ```
   docker images
   ```
7. Navigate back to **Docker desktop**, from the left pane select **Images**.

   ![](./Media/docker7.png)

8. In the **Images** blade, notice **miyagi-ui(1)** image is created, select **run(2)** icon .

   ![](./Media/ui.png)

9. In the **Run a new container** window select the dropdown arrow.

   ![](./Media/docker14-(1).png)

10. In the **Run a new containe**, under **Ports** for **Host Port** enter **3000** and click on **Run**.

    ![](./Media/ui-port.png)

11. Click on **3000:3000** URL link

   ![](./Media/ui-port-open.png)
   
12. You should be able to see the application running locally
   
   ![](./Media/docker-ui.png)

### Task 3: Build Docker Images for the Recommendation service

1. Navigate back to **Visual studio code** window and navigate to **miyagi/services/recommendation-service/dotnet** right - click on dotnet in cascading menu, select **Open in integrate Terminal**.

1. Run the following command to build a **Docker image**

   ```
   docker build . -t miyagi-recommendation      
   ```

   ![](./Media/task2-1.png)

   > **Note**: Please wait as this command may require some time to complete.

1. Run the following command to get the newly created image.

   ```
   docker images
   ```
   
   ![](./Media/task2-2.png)

1. Navigate back to **Docker desktop**, from the left pane select **Images**.

   ![](./Media/docker7.png)

1. In the **Images** blade, notice **miyagi-recommendation(1)** image is created, select **run(2)** icon .

   ![](./Media/docker13.png)

1. In the **Run a new container** window select the dropdown arrow.

   ![](./Media/docker14-(1).png)

1. In the **Run a new containe**, under **Ports** for **Host Port** enter **5224** and click on **Run**.

    ![](./Media/recommendation-port.png)

1. Click on **5224:80** URL link

   ![](./Media/recommendation-port-open.png)
   
1. You should be able to see the application running locally
   
   ![](./Media/docker-recommend.png)

### Task 4: Push the Docker Image of Recommendation service to Container registry

In this task, you'll Push miyagi-recommendation images to acr. 

1. Navigate back to the **Visual studio code** window and navigate to **miyagi/services/recommendation-service/dotnet** right - click on dotnet in cascading menu, select **Open in integrate Terminal**

1. Run the following command to log in to the **Azure portal**.

    ```
    az login
    ```

1. This will redirect to **Microsoft login page**, select your Azure account **<inject key="AzureAdUserEmail"></inject>**, and navigate back to the **Visual studio code**.

   ![](./Media/azure-account-select.png)

1. Run the following command to log in to an **Azure Container Registry (ACR)** using the Azure CLI.

   > **Note**: Please replace **[ACRname]** and **[uname]** with **<inject key="AcrUsername" enableCopy="true"/>**, and **[password]** with **<inject key="AcrPassword" enableCopy="true"/>**.
   
   ```
   az acr login -n [ACRname] 
   ```
    
1. Run the following command to add the tag.

   > **Note**: To get the **[ACRname]** navigate to the Container registry created in the previous lab, go to Overview, and copy the **Login server**. The value should be in the format **[ACRname].azurecr.io**.

   ```
   docker tag miyagi-recommendation:latest [ACRname]/miyagi-recommendation:latest
   ```

1. Run the following command to push the image to the container registry.

   > **Note**: Please replace **[ACRname]** with **<inject key="AcrLoginServer" enableCopy="true"/>**.

   ```
   docker push [ACRname]/miyagi-recommendation:latest
   ```

   ![](./Media/task2-6.png)

### Task 5: Deploy AKS Pods
1. Navigate back to the Visual studio code window and navigate to **miyagi/deploy/infrastructure/kubernetes/50-miyagi** right click on 50-miyagi in cascading menu, select Open in integrate Terminal

2. Open the miyagi-recommendation.yaml file and replace the &lt;ACR-NAME&gt; with you Azure container registry name created earlier.
   ![](./Media/service-acr.png)

3. Open the miyagi-ui.yaml file and replace the &lt;ACR-NAME&gt; with you Azure container registry name created earlier.
   ![](./Media/ui-acr.png)

4. Run the following commands to deploy the application pods.
   ```
    kubectl apply -f ./miyagi-recommendation.yaml
   ```
   ```
    kubectl apply -f ./miyagi-ui.yaml
   ```

5. The applications should now be deployed. To verify run the below command and you should see both pods in a running state.
   ```
    kubectl get pods
   ```
   
   ![](./Media/running-pods.png)

# Lab 2.2: Explore and Verify the Containerized Miyagi UI and Recommendation service in AKS

### Task 1: Explore Recommendation service in AKS using Ingress Endpoint

1. To test the API run the below command to get the service IP addresses
   ```
    kubectl get svc
   ```
   
   ![](./Media/serviceips.png)


2. Copy the IP address of the miyagi-recommendation-service and enter it into the browser. You should now see the swagger endpoint.
    ![](./Media/service-swagger.png)
   
### Task 2: Explore Miyagi App in Azure Container Apps using Ingress Endpoint

1. To test the UI run the below command to get the service IP addresses
   ```
    kubectl get svc
   ```
   
   ![](./Media/serviceips.png)


2. Copy the IP address of the miyagi-ui and enter it into the browser. You should now see the Miyagi frontend.
    ![](./Media/miyagi-ui.png)