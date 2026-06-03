# =========================
# Étape 1 : Build Maven
# =========================
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copier uniquement le pom pour optimiser le cache Docker
COPY pom.xml .

# Télécharger les dépendances
RUN mvn dependency:go-offline

# Copier le code source
COPY src ./src

# Compiler le projet Spring Boot (JAR)
RUN mvn clean package -DskipTests


# =========================
# Étape 2 : Runtime (JRE léger)
# =========================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copier le JAR généré depuis l'étape build
COPY --from=build /app/target/*.jar app.jar

# Port Spring Boot
EXPOSE 8080

# Lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]