FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY ./*.csproj .
COPY nuget.config .
COPY ./*.csproj .
RUN dotnet restore --use-current-runtime --configfile nuget.config 

# copy everything else and build app
COPY ./ ./
RUN dotnet publish --use-current-runtime --self-contained false --no-restore -o /app


# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app ./app
ENTRYPOINT ["dotnet", "GBB.Miyagi.RecommendationService.dll"]