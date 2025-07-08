# Stage 1: Build the app
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY ItemService /build
WORKDIR /build
RUN mvn clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]
