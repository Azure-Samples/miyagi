#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["GBB.Miyagi.RecommendationService.csproj", "GBB.Miyagi.RecommendationService/"]
RUN dotnet restore "GBB.Miyagi.RecommendationService/GBB.Miyagi.RecommendationService.csproj"
COPY . .
WORKDIR "/src/GBB.Miyagi.RecommendationService"
RUN dotnet build "GBB.Miyagi.RecommendationService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GBB.Miyagi.RecommendationService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GBB.Miyagi.RecommendationService.dll"]