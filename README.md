# Library managment service

1. Full CI/CD Pipeline for a Microservices App
2. Tech Stack: Jenkins + Spring Boot + PostgreSQL + Docker
Scenario:
* Multi-branch pipeline using Jenkinsfile
* Unit testing, code quality checks (SonarQube), Docker image build
* Push to Docker Hub or GitLab Container Registry
* Auto-deploy to a staging Kubernetes cluster using Helm

## ✅ Skills: Multi-stage pipelines, parallel builds, shared libraries, Docker, GitOps


```.
├── library-frontend/                  <-- Git Repository 1: React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookList.js
│   │   │   ├── UserList.js
│   │   │   └── LoanForm.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   ├── Jenkinsfile
│   └── helm/
│       └── library-frontend-chart/
│           ├── Chart.yaml
│           ├── values.yaml
│           └── templates/
│               ├── deployment.yaml
│               └── service.yaml
│               └── ingress.yaml
│
├── book-service/                      <-- Git Repository 2: Spring Boot Book Service
│   ├── src/
│   │   ├── main/java/com/library/book/
│   │   │   ├── BookApplication.java
│   │   │   ├── model/Book.java
│   │   │   ├── repository/BookRepository.java
│   │   │   └── controller/BookController.java
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   ├── Dockerfile
│   ├── Jenkinsfile
│   └── helm/
│       └── book-service-chart/
│           ├── Chart.yaml
│           ├── values.yaml
│           └── templates/
│               ├── deployment.yaml
│               └── service.yaml
│               └── secret.yaml (for DB credentials)
│
├── user-service/                      <-- Git Repository 3: Spring Boot User Service
│   ├── src/
│   │   ├── main/java/com/library/user/
│   │   │   ├── UserApplication.java
│   │   │   ├── model/User.java
│   │   │   ├── repository/UserRepository.java
│   │   │   └── controller/UserController.java
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   ├── Dockerfile
│   ├── Jenkinsfile
│   └── helm/
│       └── user-service-chart/
│           ├── Chart.yaml
│           ├── values.yaml
│           └── templates/
│               ├── deployment.yaml
│               └── service.yaml
│               └── secret.yaml
│
└── loan-service/                      <-- Git Repository 4: Spring Boot Loan Service
    ├── src/
    │   ├── main/java/com/library/loan/
    │   │   ├── LoanApplication.java
    │   │   ├── model/Loan.java
    │   │   ├── repository/LoanRepository.java
    │   │   └── controller/LoanController.java
    │   └── resources/
    │       └── application.properties
    ├── pom.xml
    ├── Dockerfile
    ├── Jenkinsfile
    └── helm/
        └── loan-service-chart/
            ├── Chart.yaml
            ├── values.yaml
            └── templates/
                ├── deployment.yaml
                └── service.yaml
                └── secret.yaml
                ```