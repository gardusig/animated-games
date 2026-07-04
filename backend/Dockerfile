# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY backend/gradlew backend/gradle backend/build.gradle.kts backend/settings.gradle.kts ./
RUN chmod +x gradlew
COPY backend/src ./src
RUN ./gradlew bootJar --no-daemon

# Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
HEALTHCHECK CMD curl -f http://localhost:8080/healthcheck || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
