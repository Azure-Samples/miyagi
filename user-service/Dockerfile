ARG IMAGE="mcr.microsoft.com/cbl-mariner/base/core"
ARG TAG="2.0"
FROM ${IMAGE}:${TAG}

LABEL "Author"="Microsoft"
LABEL "Support"="Microsoft OpenJDK Support <openjdk-support@microsoft.com>"

ARG package="msopenjdk-17"
ARG PKGS="tzdata ca-certificates freetype shadow-utils"

ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'
ENV JAVA_HOME=/usr/lib/jvm/msopenjdk-17

RUN rpm -Uhv https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm && \
    tdnf install -y ${package} ${PKGS} && \
    tdnf clean all && \
    groupadd --system --gid=101 app && \
    adduser --uid 101 --gid 101 --system app && \
    install -d -m 0755 -o 101 -g 101 "/home/app" && \
    rm -rf /var/cache/tdnf && \
    rm -rf /usr/lib/jvm/${package}/lib/src.zip && \
    echo java -Xshare:dump && \
    java -Xshare:dump

ARG PORT=8702
RUN mkdir /app
COPY target/*.jar /app/app.jar
COPY target/agent/applicationinsights-agent.jar /app/applicationinsights-agent.jar
COPY target/classes/applicationinsights.json /app/applicationinsights.json
WORKDIR /app
EXPOSE ${PORT}
CMD ["java", "-javaagent:applicationinsights-agent.jar" ,"-Xmx256m", "-jar", "app.jar"]